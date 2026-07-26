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
// Fetch-through-cache: return cached value if fresh, else run getter and store it.
export async function cached(key, ttlMs, getter) {
  const hit = cacheGet(key, ttlMs);
  if (hit != null) return hit;
  const v = await getter();
  if (v != null) cacheSet(key, v);
  return v;
}

// TTLs tuned to each source's real publish cadence.
export const TTL = {
  fx: 60 * 60 * 1000,          // FX: ECB publishes ~once/working-day; refetch hourly is plenty
  news: 15 * 60 * 1000,        // GDELT rolls ~every 15 min
  trade: 24 * 60 * 60 * 1000,  // World Bank trade is annual; a day is generous
};
