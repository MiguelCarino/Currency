// Carino Currency — FINANCE NEWS pillar. Keyless GDELT DOC 2.0 discovery feed.
// Query is either the user's (settings.newsQuery) or, when empty, derived from
// the base currency + selected trade country so the feed tracks context. No key,
// no upload; fetch-through-cache with the shared news TTL. Never throws out of
// runNews — failures render a small .empty-note in the panel.

import { $, el, setText, clear, cached, fetchJSON, TTL } from './util.js';
import { settings, saveSettings, report } from './state.js';
import { BY_CODE } from './data/currencies.js';
import { COUNTRY_BY_ISO3 } from './data/countries.js';

// Preset topic chips → single-select. Each sets a ready-made finance query.
const TOPICS = [
  { label: 'Inflation',        query: 'inflation OR CPI OR "interest rates"' },
  { label: 'Central banks',    query: '"central bank" OR "Federal Reserve" OR ECB OR "monetary policy"' },
  { label: 'Trade & tariffs',  query: 'tariffs OR "trade deal" OR exports OR "trade war"' },
  { label: 'Commodities',      query: 'oil OR gold OR copper OR commodities prices' },
  { label: 'FX & currencies',  query: 'currency OR "exchange rate" OR "foreign exchange" OR forex' },
];

// GDELT seendate "YYYYMMDDTHHMMSSZ" → "Jul 26, 14:30" (UTC). Falls back to raw.
function fmtSeen(s) {
  if (!s || s.length < 15) return s || '';
  const iso = `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T${s.slice(9, 11)}:${s.slice(11, 13)}:${s.slice(13, 15)}Z`;
  const d = new Date(iso);
  if (isNaN(d)) return s;
  const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()];
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${mon} ${d.getUTCDate()}, ${hh}:${mm}`;
}

function truncate(s, n) { return s && s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : (s || ''); }

// The active query: explicit user query wins; otherwise derive from context so
// the feed reflects the current base currency + trade economy.
function activeQuery() {
  const q = (settings.newsQuery || '').trim();
  if (q) return q;
  const baseName = (BY_CODE[settings.base] && BY_CODE[settings.base].name) || settings.base;
  const cty = COUNTRY_BY_ISO3[settings.country];
  const countryName = (cty && cty.name) || '';
  const subject = countryName ? `${baseName} OR ${countryName}` : baseName;
  return `(${subject}) (currency OR inflation OR trade OR exports)`;
}

// ---- init: build chips + wire search box --------------------------------
export function initNews() {
  const chipWrap = $('newsTopics');
  const input = $('newsQuery');
  const go = $('newsGo');

  // Reflect a persisted user query into the input on load.
  if (input && settings.newsQuery) input.value = settings.newsQuery;

  // Preset topic chips (single-select: choosing one drives newsQuery).
  if (chipWrap) {
    clear(chipWrap);
    TOPICS.forEach((t) => {
      const chip = el('span', 'chip', t.label);
      chip.setAttribute('role', 'button');
      chip.tabIndex = 0;
      chip.dataset.query = t.query;
      chip.addEventListener('click', () => {
        settings.newsQuery = t.query;
        saveSettings();
        if (input) input.value = t.query;
        syncChips();
        runNews();
      });
      chip.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chip.click(); }
      });
      chipWrap.appendChild(chip);
    });
    syncChips();
  }

  // Search box: Enter or the Search button commits the input as the query.
  const commit = () => {
    if (input) { settings.newsQuery = input.value.trim(); saveSettings(); }
    syncChips();
    runNews();
  };
  if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } });
  if (go) go.addEventListener('click', commit);

  // Trade country changed: if we're on a derived query (no explicit search),
  // re-run so the context feed follows the newly selected economy.
  document.addEventListener('cur:country', () => {
    if (!(settings.newsQuery || '').trim()) runNews();
  });
}

// Highlight the chip matching the current query (only in preset mode).
function syncChips() {
  const chipWrap = $('newsTopics');
  if (!chipWrap) return;
  const q = (settings.newsQuery || '').trim();
  [...chipWrap.querySelectorAll('.chip')].forEach((c) =>
    c.classList.toggle('on', !!q && c.dataset.query === q));
}

// ---- run: fetch + render -------------------------------------------------
export async function runNews() {
  const feed = $('newsFeed');
  const query = activeQuery();

  const url = 'https://api.gdeltproject.org/api/v2/doc/doc?query=' + encodeURIComponent(query) +
    '&mode=artlist&format=json&maxrecords=48&sort=datedesc&timespan=3d';

  let articles = [];
  try {
    const data = await cached('news:' + query, TTL.news, () => fetchJSON(url));
    articles = (data && Array.isArray(data.articles)) ? data.articles : [];
  } catch (e) {
    // GDELT returns empty/non-JSON on bad queries → fetchJSON throws. Degrade.
    if (feed) { clear(feed); feed.appendChild(el('p', 'empty-note', 'No headlines for this query.')); }
    setText('newsMeta', '');
    report.news = { query, articles: [] };
    return;
  }

  if (feed) {
    clear(feed);
    if (!articles.length) {
      feed.appendChild(el('p', 'empty-note', 'No headlines for this query.'));
    } else {
      articles.slice(0, 40).forEach((a) => feed.appendChild(newsItem(a)));
    }
  }

  setText('newsMeta', `${articles.length} headline${articles.length === 1 ? '' : 's'} · ${truncate(query, 52)}`);

  // Persist for JSON export — only fields GDELT actually returns (no fabrication).
  report.news = {
    query,
    articles: articles.slice(0, 40).map((a) => {
      const row = { title: a.title || '', url: a.url || '', domain: a.domain || '', seendate: a.seendate || '' };
      const tone = Number(a.tone);
      if (a.tone != null && isFinite(tone)) row.tone = tone;   // tone absent in artlist; keep if ever present
      return row;
    }),
  };
}

// One <a class="news-item"> card: title, source domain (left), date (right).
function newsItem(a) {
  const item = el('a', 'news-item');
  item.href = a.url || '#';
  item.target = '_blank';
  item.rel = 'noopener';

  item.appendChild(el('div', 'news-title', (a.title || '').trim() || '(untitled)'));

  const src = el('div', 'news-src');
  src.appendChild(el('span', null, a.domain || a.sourcecountry || '—'));

  // Tone tint only if GDELT actually supplies a numeric tone — never invented.
  const tone = Number(a.tone);
  if (a.tone != null && isFinite(tone)) {
    if (tone > 1) item.classList.add('pos');
    else if (tone < -1) item.classList.add('neg');
    const chip = el('span', 'news-tone', (tone > 0 ? '+' : '') + tone.toFixed(1));
    src.appendChild(chip);
  }

  src.appendChild(el('span', null, fmtSeen(a.seendate)));
  item.appendChild(src);
  return item;
}
