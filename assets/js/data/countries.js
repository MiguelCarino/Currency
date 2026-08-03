// Carino Currency — trading economies for the export/import panel.
// Each maps to a World Bank code (ISO3, keyless + CORS-friendly Indicators API)
// and its home currency, so a country's trade profile cross-links to FX. iso2 is
// the alpha-2 the browser's Intl.DisplayNames needs to localise the name — the
// English `name` below stays as the fallback. Curated
// to the major traders plus every currency's home country (one-to-one coverage).
export const COUNTRIES = [
  { iso3: 'USA', iso2: 'US', name: 'United States',  currency: 'USD', region: 'Americas' },
  { iso3: 'CHN', iso2: 'CN', name: 'China',          currency: 'CNY', region: 'Asia' },
  { iso3: 'JPN', iso2: 'JP', name: 'Japan',          currency: 'JPY', region: 'Asia' },
  { iso3: 'DEU', iso2: 'DE', name: 'Germany',        currency: 'EUR', region: 'Europe' },
  { iso3: 'IND', iso2: 'IN', name: 'India',          currency: 'INR', region: 'Asia' },
  { iso3: 'GBR', iso2: 'GB', name: 'United Kingdom', currency: 'GBP', region: 'Europe' },
  { iso3: 'FRA', iso2: 'FR', name: 'France',         currency: 'EUR', region: 'Europe' },
  { iso3: 'BRA', iso2: 'BR', name: 'Brazil',         currency: 'BRL', region: 'Americas' },
  { iso3: 'ITA', iso2: 'IT', name: 'Italy',          currency: 'EUR', region: 'Europe' },
  { iso3: 'CAN', iso2: 'CA', name: 'Canada',         currency: 'CAD', region: 'Americas' },
  { iso3: 'KOR', iso2: 'KR', name: 'South Korea',    currency: 'KRW', region: 'Asia' },
  { iso3: 'MEX', iso2: 'MX', name: 'Mexico',         currency: 'MXN', region: 'Americas' },
  { iso3: 'AUS', iso2: 'AU', name: 'Australia',      currency: 'AUD', region: 'Oceania' },
  { iso3: 'ESP', iso2: 'ES', name: 'Spain',          currency: 'EUR', region: 'Europe' },
  { iso3: 'IDN', iso2: 'ID', name: 'Indonesia',      currency: 'IDR', region: 'Asia' },
  { iso3: 'NLD', iso2: 'NL', name: 'Netherlands',    currency: 'EUR', region: 'Europe' },
  { iso3: 'TUR', iso2: 'TR', name: 'Türkiye',        currency: 'TRY', region: 'Middle East' },
  { iso3: 'CHE', iso2: 'CH', name: 'Switzerland',    currency: 'CHF', region: 'Europe' },
  { iso3: 'POL', iso2: 'PL', name: 'Poland',         currency: 'PLN', region: 'Europe' },
  { iso3: 'SWE', iso2: 'SE', name: 'Sweden',         currency: 'SEK', region: 'Europe' },
  { iso3: 'NOR', iso2: 'NO', name: 'Norway',         currency: 'NOK', region: 'Europe' },
  { iso3: 'SGP', iso2: 'SG', name: 'Singapore',      currency: 'SGD', region: 'Asia' },
  { iso3: 'ZAF', iso2: 'ZA', name: 'South Africa',   currency: 'ZAR', region: 'Africa' },
  { iso3: 'THA', iso2: 'TH', name: 'Thailand',       currency: 'THB', region: 'Asia' },
  { iso3: 'MYS', iso2: 'MY', name: 'Malaysia',       currency: 'MYR', region: 'Asia' },
  { iso3: 'PHL', iso2: 'PH', name: 'Philippines',    currency: 'PHP', region: 'Asia' },
  { iso3: 'DNK', iso2: 'DK', name: 'Denmark',        currency: 'DKK', region: 'Europe' },
  { iso3: 'CZE', iso2: 'CZ', name: 'Czechia',        currency: 'CZK', region: 'Europe' },
  { iso3: 'HUN', iso2: 'HU', name: 'Hungary',        currency: 'HUF', region: 'Europe' },
  { iso3: 'ISR', iso2: 'IL', name: 'Israel',         currency: 'ILS', region: 'Middle East' },
  { iso3: 'NZL', iso2: 'NZ', name: 'New Zealand',    currency: 'NZD', region: 'Oceania' },
  { iso3: 'ROU', iso2: 'RO', name: 'Romania',        currency: 'RON', region: 'Europe' },
  { iso3: 'BGR', iso2: 'BG', name: 'Bulgaria',       currency: 'BGN', region: 'Europe' },
  { iso3: 'ISL', iso2: 'IS', name: 'Iceland',        currency: 'ISK', region: 'Europe' },
  { iso3: 'HKG', iso2: 'HK', name: 'Hong Kong SAR',  currency: 'HKD', region: 'Asia' },
];

export const COUNTRY_BY_ISO3 = Object.fromEntries(COUNTRIES.map((c) => [c.iso3, c]));
export const DEFAULT_COUNTRY = 'BRA';   // a clear exporter with an interesting currency story
