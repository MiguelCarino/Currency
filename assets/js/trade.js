// Carino Currency — TRADE pillar (exports & imports value).
// Source: World Bank Indicators API (keyless, CORS-friendly). We pull two
// indicators for the selected economy — exports (NE.EXP.GNFS.CD) and imports
// (NE.IMP.GNFS.CD) of goods & services, current US$ — build aligned annual
// series, and render stat tiles, a two-line chart, and a table. Nothing throws
// out of runTrade(); on failure the table area shows a small .empty-note.

import { $, el, setText, clear, fmtMoney, fmtPct, pctChange, trend, cached, fetchJSON, TTL } from './util.js';
import { settings, saveSettings, report } from './state.js';
import { COUNTRIES, COUNTRY_BY_ISO3 } from './data/countries.js';

const WB = 'https://api.worldbank.org/v2/country/';
const Q = '?format=json&per_page=60&date=2000:2024';

// Parse a World Bank [meta, data] payload into an ASCENDING [{year,value}]
// array, dropping the null years the API returns for recent/missing data.
function parseSeries(payload) {
  const rows = Array.isArray(payload) && Array.isArray(payload[1]) ? payload[1] : [];
  const out = [];
  for (const r of rows) {
    const year = +r.date;
    const value = r.value;
    if (value == null || !isFinite(value) || !isFinite(year)) continue;
    out.push({ year, value: +value });
  }
  out.sort((a, b) => a.year - b.year);   // API is descending; we want ascending
  return out;
}

// Fetch both indicators for an ISO3 and return raw ascending series.
async function fetchTrade(iso3) {
  const [expP, impP] = await Promise.all([
    cached('trade:exp:' + iso3, TTL.trade, () => fetchJSONBoth(iso3, 'NE.EXP.GNFS.CD')),
    cached('trade:imp:' + iso3, TTL.trade, () => fetchJSONBoth(iso3, 'NE.IMP.GNFS.CD')),
  ]);
  return { exports: parseSeries(expP), imports: parseSeries(impP) };
}

// Thin wrapper so cached() stores the raw payload per indicator.
function fetchJSONBoth(iso3, indicator) {
  return fetchJSON(WB + encodeURIComponent(iso3) + '/indicator/' + indicator + Q);
}

// ---- init ---------------------------------------------------------------
export function initTrade() {
  const sel = $('tradeCountry');
  if (!sel) return;
  clear(sel);
  for (const c of COUNTRIES) {
    const opt = el('option', null, c.name);
    opt.value = c.iso3;
    sel.appendChild(opt);
  }
  // Ensure the saved country is valid; fall back to the first economy.
  if (!COUNTRY_BY_ISO3[settings.country]) settings.country = COUNTRIES[0].iso3;
  sel.value = settings.country;

  sel.addEventListener('change', () => {
    settings.country = sel.value;
    saveSettings();
    document.dispatchEvent(new CustomEvent('cur:country', { detail: { iso3: settings.country } }));
    runTrade().catch((e) => console.warn('trade', e));
  });
}

// ---- run ----------------------------------------------------------------
export async function runTrade() {
  const iso3 = settings.country;
  const country = COUNTRY_BY_ISO3[iso3];
  const name = country ? country.name : iso3;

  let exports = [], imports = [];
  try {
    ({ exports, imports } = await fetchTrade(iso3));
  } catch (e) {
    renderEmpty('No World Bank trade data for this economy.');
    report.trade = { iso3, name, exports: [], imports: [], balance: [], latestYear: null };
    setText('tradeMeta', 'World Bank · goods & services · current US$');
    return;
  }

  // Align by year: maps + balance where both present.
  const expMap = new Map(exports.map((d) => [d.year, d.value]));
  const impMap = new Map(imports.map((d) => [d.year, d.value]));
  const balance = [];
  for (const { year, value } of exports) {
    if (impMap.has(year)) balance.push({ year, value: value - impMap.get(year) });
  }
  const balMap = new Map(balance.map((d) => [d.year, d.value]));

  // Latest year with BOTH values present drives the tiles + meta.
  const latestYear = balance.length ? balance[balance.length - 1].year : null;

  if (latestYear == null) {
    renderEmpty('No World Bank trade data for this economy.');
    drawTradeChart($('tradeChart'), [], []);
    report.trade = { iso3, name, exports, imports, balance: [], latestYear: null };
    setText('tradeMeta', 'World Bank · goods & services · current US$');
    return;
  }

  // Stat tiles ------------------------------------------------------------
  const exp = expMap.get(latestYear), imp = impMap.get(latestYear), bal = balMap.get(latestYear);
  setText('tExportsVal', fmtMoney(exp));
  setText('tImportsVal', fmtMoney(imp));
  setText('tBalanceVal', fmtMoney(bal));
  setText('tradeYear', 'FY' + latestYear);

  setYoY('tExportsYoY', prevValue(exports, latestYear), exp);
  setYoY('tImportsYoY', prevValue(imports, latestYear), imp);

  // Chart -----------------------------------------------------------------
  drawTradeChart($('tradeChart'), exports, imports);

  // Table (last ~12 years descending) -------------------------------------
  renderTable(expMap, impMap, balMap);

  // Meta + report ---------------------------------------------------------
  setText('tradeMeta', 'World Bank · goods & services · current US$ · latest FY' + latestYear);
  report.trade = { iso3, name, exports, imports, balance, latestYear };
}

// Value of the entry immediately preceding `year` in an ascending series.
function prevValue(series, year) {
  let prev = null;
  for (const d of series) {
    if (d.year >= year) break;
    prev = d.value;
  }
  return prev;
}

// Fill a .yoy span with a signed pct and an up/down/flat color class.
function setYoY(id, prev, cur) {
  const span = $(id);
  if (!span) return;
  const pc = pctChange(prev, cur);
  span.className = 'yoy ' + trend(pc);
  span.textContent = pc == null ? '' : fmtPct(pc);
}

// ---- table --------------------------------------------------------------
function renderTable(expMap, impMap, balMap) {
  const tbody = $('tradeTable');
  if (!tbody) return;
  clear(tbody);

  // Union of all years, descending, capped to ~12 rows.
  const years = [...new Set([...expMap.keys(), ...impMap.keys()])].sort((a, b) => b - a).slice(0, 12);
  if (!years.length) { renderEmpty('No World Bank trade data for this economy.'); return; }

  for (const year of years) {
    const exp = expMap.has(year) ? expMap.get(year) : null;
    const imp = impMap.has(year) ? impMap.get(year) : null;
    const bal = balMap.has(year) ? balMap.get(year) : null;
    // Balance Δ YoY: change vs the previous year's balance (if both present).
    const prevBal = balMap.has(year - 1) ? balMap.get(year - 1) : null;
    const balDelta = bal == null ? null : pctChange(prevBal, bal);

    const tr = el('tr');
    tr.appendChild(el('td', null, String(year)));
    tr.appendChild(el('td', null, exp == null ? '—' : fmtMoney(exp)));
    tr.appendChild(el('td', null, imp == null ? '—' : fmtMoney(imp)));

    const balTd = el('td', bal == null ? null : (bal >= 0 ? 'pos' : 'neg'), bal == null ? '—' : fmtMoney(bal));
    tr.appendChild(balTd);

    const dTd = el('td', balDelta == null ? null : trend(balDelta), balDelta == null ? '—' : fmtPct(balDelta));
    tr.appendChild(dTd);

    tbody.appendChild(tr);
  }
}

// Show a single empty-note row in the table body and reset the tiles.
function renderEmpty(msg) {
  const tbody = $('tradeTable');
  if (tbody) {
    clear(tbody);
    const tr = el('tr');
    const td = el('td', 'empty-note', msg);
    td.colSpan = 5;
    td.style.textAlign = 'left';
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
  for (const id of ['tExportsVal', 'tImportsVal', 'tBalanceVal']) setText(id, '—');
  for (const id of ['tExportsYoY', 'tImportsYoY']) { const s = $(id); if (s) { s.className = 'yoy'; s.textContent = ''; } }
  setText('tradeYear', '');
}

// ---- chart (self-contained HiDPI, two line series) ----------------------
// Draws exports (green/--ok) and imports (red/--err) over the shared year axis.
// Reads theme colors from CSS custom properties, like viz.js. Empty → clear.
function drawTradeChart(canvas, exports, imports) {
  if (!canvas) return;
  const cs = getComputedStyle(document.documentElement);
  const col = (name, fb) => (cs.getPropertyValue(name).trim() || fb);
  const okC = col('--ok', '#22c55e');
  const errC = col('--err', '#ef4444');
  const accent = col('--accent', '#eab308');
  const grid = col('--border', '#262626');
  const axis = col('--text-muted', '#666');

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const W = Math.max(1, rect.width), H = Math.max(1, rect.height);
  canvas.width = W * dpr; canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  // Shared year domain across both series.
  const years = [...new Set([...exports, ...imports].map((d) => d.year))].sort((a, b) => a - b);
  const vals = [...exports, ...imports].map((d) => d.value);
  if (years.length < 2 || !vals.length) return;   // nothing to draw

  const minY = 0;                                  // trade value is >= 0; anchor at zero
  const maxY = Math.max(...vals) || 1;
  const span = maxY - minY || 1;
  const minYr = years[0], maxYr = years[years.length - 1];
  const yearSpan = (maxYr - minYr) || 1;

  const padL = 54, padR = 12, padT = 14, padB = 24;
  const X = (yr) => padL + ((yr - minYr) / yearSpan) * (W - padL - padR);
  const Y = (v) => padT + (1 - (v - minY) / span) * (H - padT - padB);

  // Horizontal gridlines + money labels.
  ctx.font = "10px 'IBM Plex Mono', monospace";
  ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  ctx.lineWidth = 1;
  const rows = 4;
  for (let r = 0; r <= rows; r++) {
    const v = minY + (span * r) / rows, yy = Y(v);
    ctx.strokeStyle = grid; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(W - padR, yy); ctx.stroke();
    ctx.globalAlpha = 1; ctx.fillStyle = axis; ctx.fillText(fmtMoney(v), padL - 6, yy);
  }

  // X-axis year labels (first + last).
  ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillStyle = axis;
  ctx.fillText(String(minYr), X(minYr), H - padB + 6);
  ctx.fillText(String(maxYr), X(maxYr), H - padB + 6);

  // Line plotter for one series.
  const plot = (series, stroke) => {
    if (series.length < 2) return;
    ctx.beginPath();
    series.forEach((d, i) => { const x = X(d.year), y = Y(d.value); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.strokeStyle = stroke; ctx.lineWidth = 1.8; ctx.stroke();
    // last-point marker
    const last = series[series.length - 1];
    ctx.fillStyle = stroke; ctx.beginPath(); ctx.arc(X(last.year), Y(last.value), 2.6, 0, Math.PI * 2); ctx.fill();
  };
  plot(exports, okC);
  plot(imports, errC);

  // Legend (top-left).
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.font = "10px 'IBM Plex Mono', monospace";
  const ly = padT + 2;
  ctx.fillStyle = okC; ctx.fillRect(padL, ly - 4, 10, 3);
  ctx.fillStyle = axis; ctx.fillText('Exports', padL + 14, ly - 2);
  ctx.fillStyle = errC; ctx.fillRect(padL + 66, ly - 4, 10, 3);
  ctx.fillStyle = axis; ctx.fillText('Imports', padL + 80, ly - 2);
  void accent;   // reserved (kept read to match theme convention)
}
