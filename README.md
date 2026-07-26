# Carino Currency

A keyless, in-browser finance watcher — part of the [Carino](https://carino.systems) fleet.
Live at **[currency.carino.systems](https://currency.carino.systems)**.

Three pillars, all from public keyless + CORS-friendly sources, computed entirely in your browser (nothing is uploaded, no API key required):

- **Currency trends & movers** — daily FX vs a base currency over 30 / 90 / 365 days, with sparklines and top strengthener/weakener callouts. Source: [Frankfurter](https://frankfurter.dev) (ECB reference rates), with `open.er-api.com` as a wider-coverage fallback.
- **Finance news** — a headline discovery feed you can filter by topic or free-text query (currencies, inflation, central banks, commodities, trade), tinted by article tone where available. Source: [GDELT DOC 2.0](https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/).
- **Exports & imports** — a country's export/import value and trade balance in current US$, as multi-year trends with year-over-year deltas. Source: the [World Bank Indicators API](https://data.worldbank.org).

## Design notes

- Vanilla ES modules, no build step, no dependencies, no CDNs — a static site.
- FX is daily ECB data (~16:00 CET on working days) and World Bank trade is annual (≈1-year lag): this is a **trend** tool, not an intraday or trading tool, and not investment advice.
- Per-commodity / per-HS-code trade detail (UN Comtrade, IMF) is intentionally out of scope for the keyless MVP — those sources are not CORS-accessible from a static page and would need a proxy.
- Shares the fleet's self-injecting navbar + clock, fonts, and chart primitives (`viz.js`) with the other Carino projects.

## Structure

```
index.html                 shell + DOM contract
assets/css/currency.css    fleet theme
assets/js/
  app.js                   orchestrator (base/window controls, full refresh, export)
  util.js                  DOM/format helpers + TTL cache
  state.js                 settings + shared report
  viz.js                   sparkline + line chart (shared)
  fx.js                    FX trends + movers  (Frankfurter)
  news.js                  finance news        (GDELT)
  trade.js                 exports/imports     (World Bank)
  data/currencies.js       currency universe
  data/countries.js        trading economies
```
