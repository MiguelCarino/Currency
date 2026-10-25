// Carino Currency — shared utilities for every module. Vanilla ES module, no
// build step, browser-only. Keyless data sources with daily/annual cadence, so
// a small TTL cache keeps us well under any soft rate limits.

// ---- DOM helpers ---------------------------------------------------------
export const $ = (id) => document.getElementById(id);

export function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = String(text);
  return n;
}
export function setText(id, text) {
  const e = $(id);
  if (e) e.textContent = text == null ? '' : String(text);
}
export function clear(node) { if (node) node.textContent = ''; }

// ---- number / format helpers --------------------------------------------
// Signed percent with a fixed 2 decimals: +1.24% / −0.30%.
export function fmtPct(v, dp = 2) {
  if (v == null || !isFinite(v)) return '—';
  const s = v >= 0 ? '+' : '−';
  return s + Math.abs(v).toFixed(dp) + '%';
}
// Plain number with thousands separators.
export function fmtNum(v, dp = 4) {
  if (v == null || !isFinite(v)) return '—';
  return Number(v).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: dp });
}
// Compact money for trade values: $1.24T / $980.0B / $12.3M.
export function fmtMoney(v) {
  if (v == null || !isFinite(v)) return '—';
  const a = Math.abs(v), sign = v < 0 ? '−' : '';
  if (a >= 1e12) return sign + '$' + (a / 1e12).toFixed(2) + 'T';
  if (a >= 1e9) return sign + '$' + (a / 1e9).toFixed(1) + 'B';
  if (a >= 1e6) return sign + '$' + (a / 1e6).toFixed(1) + 'M';
  if (a >= 1e3) return sign + '$' + (a / 1e3).toFixed(1) + 'K';
  return sign + '$' + a.toFixed(0);
}
// Percentage change from a → b.
export function pctChange(a, b) {
  if (a == null || b == null || !isFinite(a) || !isFinite(b) || a === 0) return null;
  return ((b - a) / a) * 100;
}
// Sign bucket for coloring: 'up' | 'down' | 'flat'.
export function trend(v) { return v == null ? 'flat' : v > 0 ? 'up' : v < 0 ? 'down' : 'flat'; }

// ISO date (YYYY-MM-DD) helpers built off a supplied Date so callers stay pure.
export function isoDate(d) { return d.toISOString().slice(0, 10); }
export function daysAgo(days, from = new Date()) {
  const d = new Date(from.getTime());
  d.setUTCDate(d.getUTCDate() - days);
  return d;
}

// ---- network -------------------------------------------------------------
// JSON fetch with timeout. Throws on non-2xx or timeout. All our sources are
// CORS-enabled and keyless, so no headers/keys are attached.
export async function fetchJSON(url, { timeoutMs = 8000, headers } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { mode: 'cors', cache: 'no-store', signal: ctrl.signal, headers });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } finally { clearTimeout(t); }
}

// Try each async getter in order; return the first that resolves, else throw the
// joined errors. Used to fall a source back to its alternate (e.g. ECB → er-api).
export async function tryAll(getters) {
  const errs = [];
  for (const g of getters) {
    try { return await g(); } catch (e) { errs.push((e && e.message) || String(e)); }
  }
  throw new Error(errs.join(' | '));
}

// ---- TTL cache (localStorage, cur_ prefix) -------------------------------
// Sources refresh slowly (FX once/working-day, trade yearly), so we cache their
// payloads and only refetch after `ttlMs`. Quota/JSON errors degrade to a miss.
const CACHE_PREFIX = 'cur_cache_';
export function cacheGet(key, ttlMs) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { t, v } = JSON.parse(raw);
    if (ttlMs != null && Date.now() - t > ttlMs) return null;
    return v;
  } catch (e) { return null; }
}
export function cacheSet(key, value) {
  try { localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ t: Date.now(), v: value })); }
  catch (e) { /* quota / private mode — run without cache */ }
}
// Fetch-through-cache. Resolves to { v, t, stale }: the payload, when it was
// fetched (ms), and whether it is an expired copy shown because the refetch
// failed. A panel always gets the age to show next to the numbers; an old copy
// is never passed off as a fresh one. With no copy at all the error is thrown.
export async function cached(key, ttlMs, getter) {
  const rec = cacheRec(key);
  if (rec && (ttlMs == null || Date.now() - rec.t <= ttlMs)) return { v: rec.v, t: rec.t, stale: false };
  try {
    const v = await getter();
    if (v != null) cacheSet(key, v);
    return { v, t: Date.now(), stale: false };
  } catch (e) {
    if (rec) return { v: rec.v, t: rec.t, stale: true, err: e };
    throw e;
  }
}
function cacheRec(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    const r = raw ? JSON.parse(raw) : null;
    return r && r.v != null && isFinite(r.t) ? r : null;
  } catch (e) { return null; }
}

// TTLs tuned to each source's real publish cadence.
export const TTL = {
  fx: 60 * 60 * 1000,          // FX: ECB publishes ~once/working-day; refetch hourly is plenty
  news: 15 * 60 * 1000,        // GDELT rolls ~every 15 min
  trade: 24 * 60 * 60 * 1000,  // World Bank trade is annual; a day is generous
};

// ---- i18n bridge ---------------------------------------------------------
// i18n.js is a classic deferred script and these are modules, so `t` may not
// exist for the first paint — fall through to the English key, which is what
// t() itself does for a missing entry. Every user-facing string a module
// writes goes through T(); placeholders are filled after translation so a
// locale is free to move them.
export const T = (s) => (window.CarinoI18n ? window.CarinoI18n.t(s) : s);
export function Tf(s, vars) {
  let out = T(s);
  for (const k of Object.keys(vars || {})) out = out.split('{' + k + '}').join(vars[k]);
  return out;
}
export const locale = () => (window.CarinoLang && window.CarinoLang.current) || 'en';

/* Currency and country names are data, not copy — 66 names across five locales
   is a translation table nobody would keep correct. The browser already ships
   them: Intl.DisplayNames is the same CLDR data every OS uses. The English name
   in data/ stays as the fallback for engines without it (and for EMU, which is
   a currency zone, not a region). */
function displayName(type, code, fallback) {
  if (!code) return fallback;
  try {
    const dn = new Intl.DisplayNames([locale()], { type, fallback: 'none' });
    const out = dn.of(code);
    if (out && out !== code) return out;
  } catch (e) { /* unsupported engine or bad code — English it is */ }
  return fallback;
}
export const currencyName = (code, fallback) => displayName('currency', code, fallback);
export const countryName = (iso2, fallback) => displayName('region', iso2, fallback);

// ---- freshness UI (Branding: .is-stale, .stale-note, .alert.err) ------------
// A clock time in the reader's locale: "14:05".
export function fmtClock(t) {
  try { return new Date(t).toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }); }
  catch (e) { return new Date(t).toISOString().slice(11, 16); }
}
// Mark a panel stale (dimmed numbers + the last-good-copy note) or clear it.
export function markStale(panelId, t) {
  const panel = $(panelId);
  if (!panel) return;
  panel.classList.toggle('is-stale', !!t);
  const body = panel.querySelector('.panel-body');
  let note = panel.querySelector('.stale-note');
  if (!t) { if (note) note.remove(); return; }
  if (!note) { note = el('p', 'stale-note'); body.insertBefore(note, body.firstChild); }
  note.textContent = Tf('Showing the last good copy from {time}.', { time: fmtClock(t) });
}
// A fetch that failed with nothing to fall back on: an error, never "no results".
export function errorBox(node, source, retry) {
  clear(node);
  if (!node) return;
  const box = el('div', 'alert err');
  box.appendChild(el('span', null, Tf('Could not reach {source}.', { source }) + ' '));
  const b = el('button', 'cs-btn', T('Retry'));
  b.type = 'button';
  b.addEventListener('click', () => { Promise.resolve().then(retry).catch(() => {}); });
  box.appendChild(b);
  node.appendChild(box);
}
// First load of a panel: a dark spinner in place, never a blank area.
export function loadingBox(node) {
  clear(node);
  if (!node) return;
  const w = el('div', 'loading-box');
  w.appendChild(el('div', 'spinner'));
  w.appendChild(el('span', null, T('Loading…')));
  node.appendChild(w);
}
