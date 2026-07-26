// Carino Currency — trading economies for the export/import panel.
// Each maps to a World Bank code (ISO3, keyless + CORS-friendly Indicators API)
// and its home currency, so a country's trade profile cross-links to FX. Curated
// to the major traders plus every currency's home country (one-to-one coverage).
export const COUNTRIES = [
  { iso3: 'USA', name: 'United States',  currency: 'USD', region: 'Americas' },
  { iso3: 'CHN', name: 'China',          currency: 'CNY', region: 'Asia' },
  { iso3: 'JPN', name: 'Japan',          currency: 'JPY', region: 'Asia' },
  { iso3: 'DEU', name: 'Germany',        currency: 'EUR', region: 'Europe' },
  { iso3: 'IND', name: 'India',          currency: 'INR', region: 'Asia' },
  { iso3: 'GBR', name: 'United Kingdom', currency: 'GBP', region: 'Europe' },
  { iso3: 'FRA', name: 'France',         currency: 'EUR', region: 'Europe' },
  { iso3: 'BRA', name: 'Brazil',         currency: 'BRL', region: 'Americas' },
  { iso3: 'ITA', name: 'Italy',          currency: 'EUR', region: 'Europe' },
  { iso3: 'CAN', name: 'Canada',         currency: 'CAD', region: 'Americas' },
  { iso3: 'KOR', name: 'South Korea',    currency: 'KRW', region: 'Asia' },
  { iso3: 'MEX', name: 'Mexico',         currency: 'MXN', region: 'Americas' },
  { iso3: 'AUS', name: 'Australia',      currency: 'AUD', region: 'Oceania' },
  { iso3: 'ESP', name: 'Spain',          currency: 'EUR', region: 'Europe' },
  { iso3: 'IDN', name: 'Indonesia',      currency: 'IDR', region: 'Asia' },
  { iso3: 'NLD', name: 'Netherlands',    currency: 'EUR', region: 'Europe' },
  { iso3: 'TUR', name: 'Türkiye',        currency: 'TRY', region: 'Middle East' },
  { iso3: 'CHE', name: 'Switzerland',    currency: 'CHF', region: 'Europe' },
  { iso3: 'POL', name: 'Poland',         currency: 'PLN', region: 'Europe' },
  { iso3: 'SWE', name: 'Sweden',         currency: 'SEK', region: 'Europe' },
  { iso3: 'NOR', name: 'Norway',         currency: 'NOK', region: 'Europe' },
  { iso3: 'SGP', name: 'Singapore',      currency: 'SGD', region: 'Asia' },
  { iso3: 'ZAF', name: 'South Africa',   currency: 'ZAR', region: 'Africa' },
  { iso3: 'THA', name: 'Thailand',       currency: 'THB', region: 'Asia' },
  { iso3: 'MYS', name: 'Malaysia',       currency: 'MYR', region: 'Asia' },
  { iso3: 'PHL', name: 'Philippines',    currency: 'PHP', region: 'Asia' },
  { iso3: 'DNK', name: 'Denmark',        currency: 'DKK', region: 'Europe' },
  { iso3: 'CZE', name: 'Czechia',        currency: 'CZK', region: 'Europe' },
  { iso3: 'HUN', name: 'Hungary',        currency: 'HUF', region: 'Europe' },
  { iso3: 'ISR', name: 'Israel',         currency: 'ILS', region: 'Middle East' },
  { iso3: 'NZL', name: 'New Zealand',    currency: 'NZD', region: 'Oceania' },
  { iso3: 'ROU', name: 'Romania',        currency: 'RON', region: 'Europe' },
  { iso3: 'BGR', name: 'Bulgaria',       currency: 'BGN', region: 'Europe' },
  { iso3: 'ISL', name: 'Iceland',        currency: 'ISK', region: 'Europe' },
  { iso3: 'HKG', name: 'Hong Kong SAR',  currency: 'HKD', region: 'Asia' },
];

export const COUNTRY_BY_ISO3 = Object.fromEntries(COUNTRIES.map((c) => [c.iso3, c]));
export const DEFAULT_COUNTRY = 'BRA';   // a clear exporter with an interesting currency story
