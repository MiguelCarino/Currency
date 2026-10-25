// Carino Currency — orchestrator. Owns the base/window controls and the full
// refresh; each pillar module owns its own data source, its own local controls,
// and rendering. ES module, no build step.
//
// PILLAR CONTRACT (fx.js / news.js / trade.js each export exactly this):
//   initFx()   — populate #baseSelect + #fxWatchChips, wire base/chip changes → runFx()
//   runFx()    — fetch FX vs settings.base over settings.windowDays; render #fxGrid,
//                #fxMovers, #fxAsOf; write report.fx. Returns when done.
//   initNews() — build #newsTopics chips, wire #newsQuery + #newsGo → runNews()
//   runNews()  — fetch GDELT for settings.newsQuery (or a query derived from
//                settings.base + settings.country); render #newsFeed, #newsMeta; write report.news.
//   initTrade()— populate #tradeCountry, wire change → runTrade() (+ dispatch 'cur:country')
//   runTrade() — fetch World Bank trade for settings.country; render trade panel; write report.trade.
// Cross-context: trade.js dispatches document 'cur:country' on change; news.js MAY
// listen to refresh a derived query. All coordination is via shared state.js.

import { $, setText, T, Tf } from './util.js';
import { report, settings, saveSettings, sources } from './state.js';
import { initFx, runFx } from './fx.js';
import { initNews, runNews } from './news.js';
import { initTrade, runTrade } from './trade.js';

let running = false;

function setProgress(frac, label) {
  const bar = $('overallProgress');
  if (bar) bar.style.width = Math.max(0, Math.min(1, frac)) * 100 + '%';
  if (label != null) setText('overallStatus', label);
}

// Refresh all three pillars concurrently — they hit independent sources.
async function runAll() {
  if (running) return;
  running = true;
  const btn = $('runAll');
  if (btn) btn.disabled = true;
  setProgress(0.06, T('loading…'));

  const tasks = [['FX', runFx], ['news', runNews], ['trade', runTrade]];
  let done = 0;
  await Promise.all(tasks.map(([name, fn]) =>
    Promise.resolve().then(fn).catch((e) => console.warn(name, e)).finally(() => {
      done++;
      setProgress(0.06 + 0.94 * (done / tasks.length), `${T(name)} ✓`);
    })
  ));

  report.finishedAt = new Date().toISOString();
  setProgress(1, T('updated'));
  if (btn) btn.disabled = false;
  running = false;
  renderBadge();
}

// ---- source badge + Updated stamp (navbar) --------------------------------
// One badge for the page, from what each panel reported (state.sources): an
// error beats a stale copy, which beats the normal DAILY badge, so the worst
// panel always shows. "Updated" is the OLDEST copy on screen, not the newest,
// so a cached panel cannot hide behind a fresh one.
const NAMES = { fx: 'Frankfurter', news: 'GDELT', trade: 'the World Bank' };
function fmtAge(ms) {
  const m = Math.round(ms / 60000);
  if (m < 60) return m + 'm';
  const h = Math.round(m / 60);
  return h < 48 ? h + 'h' : Math.round(h / 24) + 'd';
}
function renderBadge() {
  const chip = $('srcChip');
  const fresh = $('freshStamp');
  if (!chip) return;
  const list = Object.values(sources);
  const errs = Object.keys(sources).filter((k) => sources[k].err);
  const stale = list.filter((x) => x.stale);
  const times = list.filter((x) => x.t).map((x) => x.t);
  const oldest = times.length ? Math.min(...times) : 0;
  let text, kind = '', title = T('Data source'), suffix = '';
  if (running && !times.length) text = T('LOADING');
  else if (errs.length) {
    text = T('ERROR'); kind = 'err';
    title = errs.map((k) => Tf('Could not reach {source}.', { source: T(NAMES[k]) })).join(' ');
  } else if (stale.length) {
    text = T('STALE'); suffix = ' · ' + fmtAge(Date.now() - Math.min(...stale.map((x) => x.t))); kind = 'stale';
  } else { text = T('DAILY'); suffix = ' · ECB'; kind = 'delayed'; title = T('Daily ECB reference rates, not intraday'); }
  chip.textContent = text;
  // The provider or the age gives way first on a phone (.chip-src hides there).
  if (suffix) { const sp = document.createElement('span'); sp.className = 'chip-src'; sp.textContent = suffix; chip.appendChild(sp); }
  chip.className = 'live-chip' + (kind ? ' ' + kind : '');
  chip.title = title;
  if (fresh) {
    fresh.hidden = !oldest;
    if (oldest) fresh.textContent = T('Updated') + ' ' + new Date(oldest).toLocaleTimeString('en-GB', { hour12: false });
    fresh.className = 'fresh' + (kind === 'err' ? ' err' : kind === 'stale' ? ' stale' : '');
  }
}
document.addEventListener('cur:source', renderBadge);

// The trend-window segmented control only affects FX.
function initWinTabs() {
  const wrap = $('winTabs');
  if (!wrap) return;
  const sync = () => [...wrap.querySelectorAll('.toggle-btn')].forEach((b) => {
    const on = +b.dataset.win === settings.windowDays;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  wrap.addEventListener('click', (e) => {
    const b = e.target.closest('.toggle-btn');
    if (!b) return;
    settings.windowDays = +b.dataset.win;
    saveSettings();
    sync();
    runFx().catch((err) => console.warn('fx', err));
  });
  sync();
}

function exportJSON() {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'carino-currency-' + Math.floor(Date.now() / 1000) + '.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}

// On narrow screens all three panels can't share the viewport, so a tab bar
// shows one pillar at a time (grid[data-active] drives which). On wide screens
// CSS hides the tab bar and shows every panel, so this is a harmless no-op there.
function initTabs() {
  const bar = $('tabBar');
  const grid = $('appGrid');
  if (!bar || !grid) return;
  const set = (t) => {
    grid.dataset.active = t;
    [...bar.querySelectorAll('.tabbtn')].forEach((b) => {
      b.classList.toggle('active', b.dataset.tab === t);
      b.setAttribute('aria-pressed', b.dataset.tab === t ? 'true' : 'false');
    });
  };
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('.tabbtn');
    if (b) set(b.dataset.tab);
  });
  set(grid.dataset.active || 'fx');
}

// ---- boot ---------------------------------------------------------------
initFx();
initNews();
initTrade();
initWinTabs();
initTabs();

const runBtn = $('runAll');
if (runBtn) runBtn.addEventListener('click', runAll);
const jsonBtn = $('exportJson');
if (jsonBtn) jsonBtn.addEventListener('click', () => { try { exportJSON(); } catch (e) { console.warn('exportJSON', e); } });

// i18n.js calls this after it has swapped every [data-i18n] node. The pillars
// render from JS, so nothing above would follow a language switch on its own —
// re-running them repaints from the localStorage TTL cache, which means a switch
// costs no network. initFx/initNews/initTrade are re-run too, because the base
// <select>, the watch chips and the economy list carry names and labels of their
// own; they preserve the current selection, so this is a repaint, not a reset.
window.onLanguageApplied = () => {
  try {
    renderBadge();
    initFx();
    initNews();
    initTrade();
    runFx().catch(() => {});
    runNews().catch(() => {});
    runTrade().catch(() => {});
  } catch (e) { console.warn('relocalise', e); }
};

runAll();   // autorun on load
