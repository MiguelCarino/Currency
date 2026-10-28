// Carino Currency — persistent settings + in-memory data. Settings live in
// localStorage under cur_ keys; nothing is ever sent anywhere but the public
// keyless data sources (Frankfurter/ECB, GDELT, World Bank).

import { DEFAULT_BASE, DEFAULT_WATCH, CURRENCIES } from './data/currencies.js';
import { DEFAULT_COUNTRY } from './data/countries.js';

const K = 'cur_settings';

const DEFAULTS = {
  base: DEFAULT_BASE,             // FX base currency
  watch: [...DEFAULT_WATCH],      // watched target currencies
  windowDays: 90,                 // FX trend window: 30 | 90 | 365
  country: DEFAULT_COUNTRY,       // selected trade economy (ISO3)
  newsQuery: '',                  // '' → derive a query from base + country
};

function load() {
  try {
    const raw = localStorage.getItem(K);
    const saved = raw ? JSON.parse(raw) : {};
    return { ...DEFAULTS, ...saved, watch: Array.isArray(saved.watch) ? saved.watch : [...DEFAULT_WATCH] };
  } catch (e) { return { ...DEFAULTS, watch: [...DEFAULT_WATCH] }; }
}

export const settings = load();

// ?base=MXN (the link Quote shows next to its exchange rate) opens on that base for this visit; it is saved only
// if the visitor then changes something. Unknown codes are ignored.
try {
  const qb = new URLSearchParams(location.search).get('base');
  if (qb && CURRENCIES.some((c) => c.code === qb.toUpperCase())) settings.base = qb.toUpperCase();
} catch (e) { /* no URL API */ }

export function saveSettings() {
  try { localStorage.setItem(K, JSON.stringify(settings)); } catch (e) { /* quota */ }
}

// Toggle a currency in the watchlist (never lets the list go empty).
export function toggleWatch(code) {
  const i = settings.watch.indexOf(code);
  if (i >= 0) { if (settings.watch.length > 1) settings.watch.splice(i, 1); }
  else settings.watch.push(code);
  saveSettings();
}

// Live results the pillars write to and the export reads from. Not persisted.
export const report = {
  fx: { base: null, window: null, asOf: null, rows: [], movers: [] },
  news: { query: null, articles: [] },
  trade: { iso3: null, name: null, exports: [], imports: [], balance: [], latestYear: null },
  finishedAt: null,
};

export function resetReport() {
  report.fx = { base: null, window: null, asOf: null, rows: [], movers: [] };
  report.news = { query: null, articles: [] };
  report.trade = { iso3: null, name: null, exports: [], imports: [], balance: [], latestYear: null };
  report.finishedAt = null;
}

// Where each panel's data stands, for the navbar badge: { src, t, stale, err,
// loading }. t is when the shown copy was fetched. Pillars report through
// noteSource(); app.js repaints the badge on 'cur:source'.
export const sources = {};
export function noteSource(name, info) {
  sources[name] = info;
  document.dispatchEvent(new CustomEvent('cur:source', { detail: { name } }));
}
