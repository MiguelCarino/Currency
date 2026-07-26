// Carino Currency — the currency universe.
// Exactly the set Frankfurter/ECB publishes daily reference rates for (keyless,
// CORS-friendly). Each: ISO 4217 code, display name, flag emoji, home country
// ISO3 (used to cross-link a currency to its trade profile), and a broad region.
export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar',          flag: '🇺🇸', iso3: 'USA', region: 'Americas' },
  { code: 'EUR', name: 'Euro',               flag: '🇪🇺', iso3: 'EMU', region: 'Europe' },
  { code: 'GBP', name: 'British Pound',       flag: '🇬🇧', iso3: 'GBR', region: 'Europe' },
  { code: 'JPY', name: 'Japanese Yen',        flag: '🇯🇵', iso3: 'JPN', region: 'Asia' },
  { code: 'CNY', name: 'Chinese Yuan',        flag: '🇨🇳', iso3: 'CHN', region: 'Asia' },
  { code: 'CHF', name: 'Swiss Franc',         flag: '🇨🇭', iso3: 'CHE', region: 'Europe' },
  { code: 'CAD', name: 'Canadian Dollar',     flag: '🇨🇦', iso3: 'CAN', region: 'Americas' },
  { code: 'AUD', name: 'Australian Dollar',   flag: '🇦🇺', iso3: 'AUS', region: 'Oceania' },
  { code: 'NZD', name: 'New Zealand Dollar',  flag: '🇳🇿', iso3: 'NZL', region: 'Oceania' },
  { code: 'BRL', name: 'Brazilian Real',      flag: '🇧🇷', iso3: 'BRA', region: 'Americas' },
  { code: 'MXN', name: 'Mexican Peso',        flag: '🇲🇽', iso3: 'MEX', region: 'Americas' },
  { code: 'INR', name: 'Indian Rupee',        flag: '🇮🇳', iso3: 'IND', region: 'Asia' },
  { code: 'KRW', name: 'South Korean Won',    flag: '🇰🇷', iso3: 'KOR', region: 'Asia' },
  { code: 'SGD', name: 'Singapore Dollar',    flag: '🇸🇬', iso3: 'SGP', region: 'Asia' },
  { code: 'HKD', name: 'Hong Kong Dollar',    flag: '🇭🇰', iso3: 'HKG', region: 'Asia' },
  { code: 'IDR', name: 'Indonesian Rupiah',   flag: '🇮🇩', iso3: 'IDN', region: 'Asia' },
  { code: 'MYR', name: 'Malaysian Ringgit',   flag: '🇲🇾', iso3: 'MYS', region: 'Asia' },
  { code: 'PHP', name: 'Philippine Peso',     flag: '🇵🇭', iso3: 'PHL', region: 'Asia' },
  { code: 'THB', name: 'Thai Baht',           flag: '🇹🇭', iso3: 'THA', region: 'Asia' },
  { code: 'ILS', name: 'Israeli Shekel',      flag: '🇮🇱', iso3: 'ISR', region: 'Middle East' },
  { code: 'TRY', name: 'Turkish Lira',        flag: '🇹🇷', iso3: 'TUR', region: 'Middle East' },
  { code: 'ZAR', name: 'South African Rand',  flag: '🇿🇦', iso3: 'ZAF', region: 'Africa' },
  { code: 'SEK', name: 'Swedish Krona',       flag: '🇸🇪', iso3: 'SWE', region: 'Europe' },
  { code: 'NOK', name: 'Norwegian Krone',     flag: '🇳🇴', iso3: 'NOR', region: 'Europe' },
  { code: 'DKK', name: 'Danish Krone',        flag: '🇩🇰', iso3: 'DNK', region: 'Europe' },
  { code: 'PLN', name: 'Polish Zloty',        flag: '🇵🇱', iso3: 'POL', region: 'Europe' },
  { code: 'CZK', name: 'Czech Koruna',        flag: '🇨🇿', iso3: 'CZE', region: 'Europe' },
  { code: 'HUF', name: 'Hungarian Forint',    flag: '🇭🇺', iso3: 'HUN', region: 'Europe' },
  { code: 'RON', name: 'Romanian Leu',        flag: '🇷🇴', iso3: 'ROU', region: 'Europe' },
  { code: 'BGN', name: 'Bulgarian Lev',       flag: '🇧🇬', iso3: 'BGR', region: 'Europe' },
  { code: 'ISK', name: 'Icelandic Króna',     flag: '🇮🇸', iso3: 'ISL', region: 'Europe' },
];

// Fast lookups by code.
export const BY_CODE = Object.fromEntries(CURRENCIES.map((c) => [c.code, c]));
export const CODES = CURRENCIES.map((c) => c.code);

// A sensible default watchlist (majors + a couple of regionals for signal spread).
export const DEFAULT_BASE = 'USD';
export const DEFAULT_WATCH = ['EUR', 'GBP', 'JPY', 'CNY', 'BRL', 'MXN', 'INR', 'TRY'];
