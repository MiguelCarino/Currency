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

import { $, setText } from './util.js';
import { report, settings, saveSettings } from './state.js';
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
  setProgress(0.06, 'loading…');

  const tasks = [['FX', runFx], ['news', runNews], ['trade', runTrade]];
  let done = 0;
  await Promise.all(tasks.map(([name, fn]) =>
    Promise.resolve().then(fn).catch((e) => console.warn(name, e)).finally(() => {
      done++;
      setProgress(0.06 + 0.94 * (done / tasks.length), `${name} ✓`);
    })
  ));

  report.finishedAt = new Date().toISOString();
  setProgress(1, 'updated');
  if (btn) btn.disabled = false;
  running = false;
}

// The trend-window segmented control only affects FX.
function initWinTabs() {
  const wrap = $('winTabs');
  if (!wrap) return;
  const sync = () => [...wrap.querySelectorAll('.seg-b')].forEach((b) =>
    b.classList.toggle('active', +b.dataset.win === settings.windowDays));
  wrap.addEventListener('click', (e) => {
    const b = e.target.closest('.seg-b');
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
    [...bar.querySelectorAll('.tab-b')].forEach((b) => b.classList.toggle('active', b.dataset.tab === t));
  };
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('.tab-b');
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

runAll();   // autorun on load
