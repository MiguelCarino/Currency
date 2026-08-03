// Carino Currency — FX TRENDS + MOVERS pillar.
// Fetches daily ECB reference rates (via Frankfurter) of settings.base vs each
// watched currency over settings.windowDays, then renders per-currency trend
// cards, top mover tiles, and writes report.fx for the JSON export.
//
// STRENGTH convention: Frankfurter gives rate_t = units of T per 1 BASE. We plot
// the STRENGTH of T vs base = 1/rate_t (how much base one T buys), so a RISING
// series / positive change means T strengthened — which makes the sparkline
// color (auto from viz.js) and the delta agree: gold/green = T up, red = T down.

import {
  $, el, setText, clear, fmtPct, fmtNum, pctChange, trend, T, Tf, currencyName,
  isoDate, daysAgo, fetchJSON, tryAll, cached, TTL,
} from './util.js';
import { settings, saveSettings, toggleWatch, report } from './state.js';
import { CURRENCIES, BY_CODE } from './data/currencies.js';
import { sparkline } from './viz.js';

// Human label for the current window, e.g. "90D" / "1Y".
function winLabel(days) { return days === 365 ? T('1Y') : T(days + 'D'); }

// ---- init: base select + watch chips ------------------------------------
export function initFx() {
  const sel = $('baseSelect');
  if (sel) {
    clear(sel);
    for (const c of CURRENCIES) {
      const o = el('option', null, c.code + ' · ' + currencyName(c.code, c.name));
      o.value = c.code;
      sel.appendChild(o);
    }
    sel.value = settings.base;
    // init* runs again on a language switch to relabel the options, so the
    // listener is bound once — the element outlives the repaint, its children
    // do not.
    if (!sel.dataset.wired) { sel.dataset.wired = '1';
    sel.addEventListener('change', () => {
      settings.base = sel.value;
      saveSettings();
      renderChips();          // base must never also appear as a chip
      runFx().catch((e) => console.warn('fx', e));
    }); }
  }
  renderChips();
}

// Build one chip per currency EXCEPT the current base; 'on' when watched.
function renderChips() {
  const wrap = $('fxWatchChips');
  if (!wrap) return;
  clear(wrap);
  for (const c of CURRENCIES) {
    if (c.code === settings.base) continue;
    const on = settings.watch.includes(c.code);
    const chip = el('span', 'chip' + (on ? ' on' : ''));
    chip.appendChild(el('span', 'flag', c.flag));
    chip.appendChild(el('span', null, c.code));
    chip.addEventListener('click', () => {
      toggleWatch(c.code);
      renderChips();
      runFx().catch((e) => console.warn('fx', e));
    });
    wrap.appendChild(chip);
  }
}

// Small inline empty/error note inside a container.
function emptyNote(node, msg) {
  clear(node);
  if (node) node.appendChild(el('p', 'empty-note', msg));
}

// ---- run: fetch, compute, render ----------------------------------------
export async function runFx() {
  const base = settings.base;
  const windowDays = settings.windowDays;
  const grid = $('fxGrid');
  const movers = $('fxMovers');

  // Watched targets excluding the base itself (Frankfurter can't quote base/base).
  const symbols = settings.watch.filter((c) => c !== base && BY_CODE[c]);
  if (!symbols.length) {
    emptyNote(grid, T('No currencies watched — tap a chip above to add one.'));
    if (movers) clear(movers);
    setText('fxAsOf', '');
    report.fx = { base, window: windowDays, asOf: null, rows: [], movers: [] };
    return;
  }

  const FROM = isoDate(daysAgo(windowDays));
  const TO = isoDate(new Date());
  const csv = symbols.join(',');
  const qs = `${FROM}..${TO}?base=${base}&symbols=${csv}`;

  let data;
  try {
    data = await cached('fx:' + base + ':' + symbols.join(',') + ':' + windowDays, TTL.fx, () =>
      tryAll([
        () => fetchJSON(`https://api.frankfurter.dev/v1/${qs}`),
        () => fetchJSON(`https://api.frankfurter.app/${qs}`),
      ])
    );
  } catch (e) {
    console.warn('fx fetch', e);
    emptyNote(grid, T('Could not load FX rates right now. Please refresh in a moment.'));
    if (movers) clear(movers);
    setText('fxAsOf', '');
    report.fx = { base, window: windowDays, asOf: null, rows: [], movers: [] };
    return;
  }

  const rates = (data && data.rates) || {};
  const dates = Object.keys(rates).sort();   // ascending, working days only
  if (!dates.length) {
    emptyNote(grid, T('No rate data returned for this window.'));
    if (movers) clear(movers);
    setText('fxAsOf', '');
    report.fx = { base, window: windowDays, asOf: null, rows: [], movers: [] };
    return;
  }
  const asOf = data.end_date || dates[dates.length - 1];

  // Build one row per watched target: raw rate series + strength (1/rate) series.
  const rows = [];
  for (const t of symbols) {
    const raw = [];
    for (const d of dates) {
      const v = rates[d] && rates[d][t];
      if (v != null && isFinite(v) && v > 0) raw.push(v);
    }
    if (raw.length < 1) continue;
    const strength = raw.map((r) => 1 / r);
    const rateLast = raw[raw.length - 1];
    const change = strength.length >= 2 ? pctChange(strength[0], strength[strength.length - 1]) : null;
    const meta = BY_CODE[t];
    rows.push({ code: t, name: meta ? meta.name : t, flag: meta ? meta.flag : '', rate: rateLast, change, strength });
  }

  if (!rows.length) {
    emptyNote(grid, T('No rate data returned for the watched currencies.'));
    if (movers) clear(movers);
  } else {
    renderGrid(grid, base, rows, windowDays);
    renderMovers(movers, rows, windowDays, asOf);
  }

  setText('fxAsOf', Tf('as of {d} · vs {b}', { d: asOf, b: base }));

  // Shared report for JSON export.
  report.fx = {
    base,
    window: windowDays,
    asOf,
    rows: rows.map((r) => ({ code: r.code, name: r.name, rate: r.rate, change: r.change })),
    movers: buildMovers(rows).map((m) => ({ code: m.code, change: m.change, kind: m.kind })),
  };
}

// ---- render: trend cards -------------------------------------------------
function renderGrid(grid, base, rows, windowDays) {
  if (!grid) return;
  clear(grid);
  const wl = winLabel(windowDays);
  for (const r of rows) {
    const card = el('div', 'fx-card');

    const top = el('div', 'fx-top');
    top.appendChild(el('span', 'fx-flag', r.flag));
    top.appendChild(el('span', 'fx-pair', base + '/' + r.code));
    top.appendChild(el('span', 'fx-name', currencyName(r.code, r.name)));
    card.appendChild(top);

    card.appendChild(el('div', 'fx-rate', '1 ' + base + ' = ' + fmtNum(r.rate) + ' ' + r.code));

    const spark = el('div', 'fx-spark');
    spark.innerHTML = sparkline(r.strength);   // trusted, locally-generated SVG
    card.appendChild(spark);

    const foot = el('div', 'fx-foot');
    foot.appendChild(el('span', 'delta ' + trend(r.change), fmtPct(r.change)));
    foot.appendChild(el('span', 'fx-name', Tf('{w} vs {b}', { w: wl, b: base })));
    card.appendChild(foot);

    grid.appendChild(card);
  }
}

// ---- movers: pick top gainer + top loser --------------------------------
function buildMovers(rows) {
  const scored = rows.filter((r) => r.change != null && isFinite(r.change));
  if (!scored.length) return [];
  let up = scored[0], down = scored[0];
  for (const r of scored) {
    if (r.change > up.change) up = r;
    if (r.change < down.change) down = r;
  }
  const out = [{ code: up.code, flag: up.flag, change: up.change, kind: 'gainer' }];
  if (down !== up) out.push({ code: down.code, flag: down.flag, change: down.change, kind: 'loser' });
  return out;
}

function renderMovers(node, rows, windowDays, asOf) {
  if (!node) return;
  clear(node);
  const mv = buildMovers(rows);
  const wl = winLabel(windowDays);

  for (const m of mv) {
    const tile = el('div', 'mover');
    tile.appendChild(el('div', 'mv-l', T(m.kind === 'gainer' ? 'Top gainer' : 'Top weakener') + ' ' + wl));
    const v = el('div', 'mv-v');
    const code = el('span', 'mv-code');
    code.appendChild(el('span', 'flag', m.flag + ' '));
    code.appendChild(el('span', null, m.code));
    v.appendChild(code);
    v.appendChild(el('span', 'mv-pct ' + trend(m.change), fmtPct(m.change)));
    tile.appendChild(v);
    node.appendChild(tile);
  }

  // 3rd informational tile: as-of date.
  if (asOf) {
    const tile = el('div', 'mover');
    tile.appendChild(el('div', 'mv-l', T('As of')));
    const v = el('div', 'mv-v');
    v.appendChild(el('span', 'mv-code', asOf));
    tile.appendChild(v);
    node.appendChild(tile);
  }
}
