// i18n — Carino Currency (currency.carino.systems), fleet convention.
// English source strings ARE the keys, so a missing entry falls back to English.
// Locale is resolved by carino-lang.js (?lang > fleet cookie > browser > en);
// this file owns the dictionaries and re-applies on 'carino:langchange'.
//
// The three pillar modules are ES modules and this is a classic deferred script,
// so they reach it through window.CarinoI18n.t() (util.js wraps that as T()) and
// fall through to English until it exists. Currency and country NAMES are not in
// here — Intl.DisplayNames already ships CLDR's, in every locale, so util.js asks
// the browser instead of carrying 66 names x 5 languages that nobody would keep
// correct.
//
// Japanese uses the katakana loanwords a finance reader actually sees
// (インフレ, レート), never a literal calque. pt is pt-BR.

const I18N = {
    es: {
        // greeting (written by carino-navbar.js)
        'Late shift.': 'Turno nocturno.',
        'Good morning.': 'Buenos días.',
        'Good afternoon.': 'Buenas tardes.',
        'Good evening.': 'Buenas noches.',
        // control bar
        'Base': 'Base',
        'Refresh': 'Actualizar',
        'Export': 'Exportar',
        'idle': 'en espera',
        'loading…': 'cargando…',
        'updated': 'actualizado',
        '30D': '30D',
        '90D': '90D',
        '1Y': '1A',
        'news': 'noticias',
        'trade': 'comercio',
        // mobile pillar tabs
        'Trends': 'Tendencias',
        'News': 'Noticias',
        'Trade': 'Comercio',
        // panel headings
        'Currency Trends': 'Tendencias de divisas',
        'Finance News': 'Noticias financieras',
        'Exports & Imports': 'Exportaciones e importaciones',
        // FX panel
        'No currencies watched — tap a chip above to add one.': 'No hay divisas en seguimiento: toca una etiqueta de arriba para añadir una.',
        'Could not load FX rates right now. Please refresh in a moment.': 'No se pudieron cargar los tipos de cambio ahora. Actualiza en un momento.',
        'No rate data returned for this window.': 'No se devolvieron datos de tipos para este periodo.',
        'No rate data returned for the watched currencies.': 'No se devolvieron datos de tipos para las divisas en seguimiento.',
        'as of {d} · vs {b}': 'al {d} · frente a {b}',
        'Top gainer': 'Mayor alza',
        'Top weakener': 'Mayor baja',
        'As of': 'Al',
        '{w} vs {b}': '{w} frente a {b}',
        // news panel
        'Search finance news…': 'Buscar noticias financieras…',
        'Search': 'Buscar',
        'Inflation': 'Inflación',
        'Central banks': 'Bancos centrales',
        'Trade & tariffs': 'Comercio y aranceles',
        'Commodities': 'Materias primas',
        'FX & currencies': 'Divisas y cambio',
        'No headlines for this query.': 'Sin titulares para esta búsqueda.',
        '{n} headlines · {q}': '{n} titulares · {q}',
        '(untitled)': '(sin título)',
        // month abbreviations for article dates
        'Jan': 'ene',
        'Feb': 'feb',
        'Mar': 'mar',
        'Apr': 'abr',
        'May': 'may',
        'Jun': 'jun',
        'Jul': 'jul',
        'Aug': 'ago',
        'Sep': 'sep',
        'Oct': 'oct',
        'Nov': 'nov',
        'Dec': 'dic',
        // trade panel
        'Economy': 'Economía',
        'Exports': 'Exportaciones',
        'Imports': 'Importaciones',
        'Balance': 'Balanza',
        'Year': 'Año',
        'Bal. Δ YoY': 'Δ balanza interanual',
        'No World Bank trade data for this economy.': 'No hay datos de comercio del Banco Mundial para esta economía.',
        'World Bank · goods & services · current US$': 'Banco Mundial · bienes y servicios · US$ corrientes',
        'World Bank · goods & services · current US$ · latest FY{y}': 'Banco Mundial · bienes y servicios · US$ corrientes · último ej. {y}',
        'FY{y}': 'Ej. {y}',
        // panel notes
        'Daily ECB reference data via Frankfurter (open.er-api.com fallback). Gold = strengthening vs base, red = weakening. Trend tool — not intraday, not advice.': 'Datos de referencia diarios del BCE vía Frankfurter (open.er-api.com como respaldo). Dorado = se fortalece frente a la base, rojo = se debilita. Herramienta de tendencia: no es intradía ni asesoramiento.',
        'Headlines from GDELT DOC 2.0 (~15-min refresh), tinted by tone. A discovery feed — follow the link for the full story.': 'Titulares de GDELT DOC 2.0 (actualización ~15 min), teñidos según el tono. Es un canal de descubrimiento: sigue el enlace para la nota completa.',
        'Goods & services in current US$, World Bank (annual, ~1yr lag). Aggregate national trade, not per-commodity.': 'Bienes y servicios en US$ corrientes, Banco Mundial (anual, ~1 año de rezago). Comercio nacional agregado, no por producto.',
        // aria-labels + document title
        'Base currency': 'Divisa base',
        'Trend window': 'Periodo de tendencia',
        'Watched currencies': 'Divisas en seguimiento',
        'News topics': 'Temas de noticias',
        'Trade economy': 'Economía comercial',
        'Sections': 'Secciones',
        'Carino Currency — FX, News & Trade': 'Carino Currency — divisas, noticias y comercio',
    },
    'pt-BR': {
        // greeting (written by carino-navbar.js)
        'Late shift.': 'Turno da noite.',
        'Good morning.': 'Bom dia.',
        'Good afternoon.': 'Boa tarde.',
        'Good evening.': 'Boa noite.',
        // control bar
        'Base': 'Base',
        'Refresh': 'Atualizar',
        'Export': 'Exportar',
        'idle': 'ocioso',
        'loading…': 'carregando…',
        'updated': 'atualizado',
        '30D': '30D',
        '90D': '90D',
        '1Y': '1A',
        'news': 'notícias',
        'trade': 'comércio',
        // mobile pillar tabs
        'Trends': 'Tendências',
        'News': 'Notícias',
        'Trade': 'Comércio',
        // panel headings
        'Currency Trends': 'Tendências cambiais',
        'Finance News': 'Notícias financeiras',
        'Exports & Imports': 'Exportações e importações',
        // FX panel
        'No currencies watched — tap a chip above to add one.': 'Nenhuma moeda acompanhada — toque em um marcador acima para adicionar.',
        'Could not load FX rates right now. Please refresh in a moment.': 'Não foi possível carregar as taxas de câmbio agora. Atualize em instantes.',
        'No rate data returned for this window.': 'Nenhum dado de taxa retornado para este período.',
        'No rate data returned for the watched currencies.': 'Nenhum dado de taxa retornado para as moedas acompanhadas.',
        'as of {d} · vs {b}': 'em {d} · frente a {b}',
        'Top gainer': 'Maior alta',
        'Top weakener': 'Maior queda',
        'As of': 'Em',
        '{w} vs {b}': '{w} frente a {b}',
        // news panel
        'Search finance news…': 'Buscar notícias financeiras…',
        'Search': 'Buscar',
        'Inflation': 'Inflação',
        'Central banks': 'Bancos centrais',
        'Trade & tariffs': 'Comércio e tarifas',
        'Commodities': 'Commodities',
        'FX & currencies': 'Câmbio e moedas',
        'No headlines for this query.': 'Nenhuma manchete para esta busca.',
        '{n} headlines · {q}': '{n} manchetes · {q}',
        '(untitled)': '(sem título)',
        // month abbreviations for article dates
        'Jan': 'jan',
        'Feb': 'fev',
        'Mar': 'mar',
        'Apr': 'abr',
        'May': 'mai',
        'Jun': 'jun',
        'Jul': 'jul',
        'Aug': 'ago',
        'Sep': 'set',
        'Oct': 'out',
        'Nov': 'nov',
        'Dec': 'dez',
        // trade panel
        'Economy': 'Economia',
        'Exports': 'Exportações',
        'Imports': 'Importações',
        'Balance': 'Saldo',
        'Year': 'Ano',
        'Bal. Δ YoY': 'Δ saldo anual',
        'No World Bank trade data for this economy.': 'Sem dados de comércio do Banco Mundial para esta economia.',
        'World Bank · goods & services · current US$': 'Banco Mundial · bens e serviços · US$ correntes',
        'World Bank · goods & services · current US$ · latest FY{y}': 'Banco Mundial · bens e serviços · US$ correntes · último exerc. {y}',
        'FY{y}': 'Exerc. {y}',
        // panel notes
        'Daily ECB reference data via Frankfurter (open.er-api.com fallback). Gold = strengthening vs base, red = weakening. Trend tool — not intraday, not advice.': 'Dados de referência diários do BCE via Frankfurter (open.er-api.com como alternativa). Dourado = fortalecendo frente à base, vermelho = enfraquecendo. Ferramenta de tendência: não é intradiário nem recomendação.',
        'Headlines from GDELT DOC 2.0 (~15-min refresh), tinted by tone. A discovery feed — follow the link for the full story.': 'Manchetes do GDELT DOC 2.0 (atualização ~15 min), tingidas pelo tom. É um feed de descoberta: siga o link para a matéria completa.',
        'Goods & services in current US$, World Bank (annual, ~1yr lag). Aggregate national trade, not per-commodity.': 'Bens e serviços em US$ correntes, Banco Mundial (anual, ~1 ano de defasagem). Comércio nacional agregado, não por produto.',
        // aria-labels + document title
        'Base currency': 'Moeda base',
        'Trend window': 'Período da tendência',
        'Watched currencies': 'Moedas acompanhadas',
        'News topics': 'Temas de notícias',
        'Trade economy': 'Economia comercial',
        'Sections': 'Seções',
        'Carino Currency — FX, News & Trade': 'Carino Currency — câmbio, notícias e comércio',
    },
    ja: {
        // greeting (written by carino-navbar.js)
        'Late shift.': '夜勤お疲れさま。',
        'Good morning.': 'おはようございます。',
        'Good afternoon.': 'こんにちは。',
        'Good evening.': 'こんばんは。',
        // control bar
        'Base': '基準',
        'Refresh': '更新',
        'Export': 'エクスポート',
        'idle': '待機中',
        'loading…': '読み込み中…',
        'updated': '更新完了',
        '30D': '30日',
        '90D': '90日',
        '1Y': '1年',
        'news': 'ニュース',
        'trade': '貿易',
        // mobile pillar tabs
        'Trends': 'トレンド',
        'News': 'ニュース',
        'Trade': '貿易',
        // panel headings
        'Currency Trends': '為替トレンド',
        'Finance News': '金融ニュース',
        'Exports & Imports': '輸出入',
        // FX panel
        'No currencies watched — tap a chip above to add one.': '監視中の通貨がありません。上のチップをタップして追加してください。',
        'Could not load FX rates right now. Please refresh in a moment.': '現在レートを読み込めませんでした。少し待ってから更新してください。',
        'No rate data returned for this window.': 'この期間のレートデータは返されませんでした。',
        'No rate data returned for the watched currencies.': '監視中の通貨のレートデータは返されませんでした。',
        'as of {d} · vs {b}': '{d} 時点 · 対 {b}',
        'Top gainer': '上昇トップ',
        'Top weakener': '下落トップ',
        'As of': '時点',
        '{w} vs {b}': '{w} 対 {b}',
        // news panel
        'Search finance news…': '金融ニュースを検索…',
        'Search': '検索',
        'Inflation': 'インフレ',
        'Central banks': '中央銀行',
        'Trade & tariffs': '貿易・関税',
        'Commodities': 'コモディティ',
        'FX & currencies': '為替・通貨',
        'No headlines for this query.': 'この検索に該当する見出しはありません。',
        '{n} headlines · {q}': '見出し {n} 件 · {q}',
        '(untitled)': '(無題)',
        // month abbreviations for article dates
        'Jan': '1月',
        'Feb': '2月',
        'Mar': '3月',
        'Apr': '4月',
        'May': '5月',
        'Jun': '6月',
        'Jul': '7月',
        'Aug': '8月',
        'Sep': '9月',
        'Oct': '10月',
        'Nov': '11月',
        'Dec': '12月',
        // trade panel
        'Economy': '国・地域',
        'Exports': '輸出',
        'Imports': '輸入',
        'Balance': '収支',
        'Year': '年',
        'Bal. Δ YoY': '収支 前年比Δ',
        'No World Bank trade data for this economy.': 'この国・地域の世界銀行の貿易データはありません。',
        'World Bank · goods & services · current US$': '世界銀行 · 財・サービス · 名目米ドル',
        'World Bank · goods & services · current US$ · latest FY{y}': '世界銀行 · 財・サービス · 名目米ドル · 最新 {y} 年度',
        'FY{y}': '{y} 年度',
        // panel notes
        'Daily ECB reference data via Frankfurter (open.er-api.com fallback). Gold = strengthening vs base, red = weakening. Trend tool — not intraday, not advice.': 'Frankfurter 経由の ECB 日次参照レート（予備は open.er-api.com）。ゴールドは基準通貨に対する上昇、レッドは下落。トレンド確認用で、日中取引にも投資助言にも使えません。',
        'Headlines from GDELT DOC 2.0 (~15-min refresh), tinted by tone. A discovery feed — follow the link for the full story.': 'GDELT DOC 2.0 の見出し（約15分ごとに更新）。トーンに応じて色が付きます。発見用のフィードなので、全文はリンク先で。',
        'Goods & services in current US$, World Bank (annual, ~1yr lag). Aggregate national trade, not per-commodity.': '名目米ドル建ての財・サービス、世界銀行（年次、約1年遅れ）。品目別ではなく国全体の集計値です。',
        // aria-labels + document title
        'Base currency': '基準通貨',
        'Trend window': 'トレンド期間',
        'Watched currencies': '監視中の通貨',
        'News topics': 'ニューストピック',
        'Trade economy': '貿易対象の国・地域',
        'Sections': 'セクション',
        'Carino Currency — FX, News & Trade': 'Carino Currency — 為替・ニュース・貿易',
    },
    ru: {
        // greeting (written by carino-navbar.js)
        'Late shift.': 'Ночная смена.',
        'Good morning.': 'Доброе утро.',
        'Good afternoon.': 'Добрый день.',
        'Good evening.': 'Добрый вечер.',
        // control bar
        'Base': 'База',
        'Refresh': 'Обновить',
        'Export': 'Экспорт',
        'idle': 'ожидание',
        'loading…': 'загрузка…',
        'updated': 'обновлено',
        '30D': '30д',
        '90D': '90д',
        '1Y': '1г',
        'news': 'новости',
        'trade': 'торговля',
        // mobile pillar tabs
        'Trends': 'Тренды',
        'News': 'Новости',
        'Trade': 'Торговля',
        // panel headings
        'Currency Trends': 'Валютные тренды',
        'Finance News': 'Финансовые новости',
        'Exports & Imports': 'Экспорт и импорт',
        // FX panel
        'No currencies watched — tap a chip above to add one.': 'Нет отслеживаемых валют — нажмите фишку выше, чтобы добавить.',
        'Could not load FX rates right now. Please refresh in a moment.': 'Не удалось загрузить курсы. Попробуйте обновить через минуту.',
        'No rate data returned for this window.': 'За этот период данные о курсах не получены.',
        'No rate data returned for the watched currencies.': 'Данные о курсах отслеживаемых валют не получены.',
        'as of {d} · vs {b}': 'на {d} · к {b}',
        'Top gainer': 'Лидер роста',
        'Top weakener': 'Лидер снижения',
        'As of': 'На',
        '{w} vs {b}': '{w} к {b}',
        // news panel
        'Search finance news…': 'Поиск финансовых новостей…',
        'Search': 'Найти',
        'Inflation': 'Инфляция',
        'Central banks': 'Центробанки',
        'Trade & tariffs': 'Торговля и пошлины',
        'Commodities': 'Сырьевые товары',
        'FX & currencies': 'Валюты и курсы',
        'No headlines for this query.': 'По этому запросу заголовков нет.',
        '{n} headlines · {q}': 'заголовков: {n} · {q}',
        '(untitled)': '(без заголовка)',
        // month abbreviations for article dates
        'Jan': 'янв',
        'Feb': 'фев',
        'Mar': 'мар',
        'Apr': 'апр',
        'May': 'мая',
        'Jun': 'июн',
        'Jul': 'июл',
        'Aug': 'авг',
        'Sep': 'сен',
        'Oct': 'окт',
        'Nov': 'ноя',
        'Dec': 'дек',
        // trade panel
        'Economy': 'Экономика',
        'Exports': 'Экспорт',
        'Imports': 'Импорт',
        'Balance': 'Сальдо',
        'Year': 'Год',
        'Bal. Δ YoY': 'Δ сальдо г/г',
        'No World Bank trade data for this economy.': 'Нет данных Всемирного банка по торговле для этой экономики.',
        'World Bank · goods & services · current US$': 'Всемирный банк · товары и услуги · текущие US$',
        'World Bank · goods & services · current US$ · latest FY{y}': 'Всемирный банк · товары и услуги · текущие US$ · посл. {y} ф.г.',
        'FY{y}': '{y} ф.г.',
        // panel notes
        'Daily ECB reference data via Frankfurter (open.er-api.com fallback). Gold = strengthening vs base, red = weakening. Trend tool — not intraday, not advice.': 'Ежедневные справочные данные ЕЦБ через Frankfurter (резерв — open.er-api.com). Золотой — укрепление к базовой валюте, красный — ослабление. Инструмент трендов, не внутридневной и не инвестиционный совет.',
        'Headlines from GDELT DOC 2.0 (~15-min refresh), tinted by tone. A discovery feed — follow the link for the full story.': 'Заголовки из GDELT DOC 2.0 (обновление ~15 мин), подкрашены по тону. Это лента для поиска — полный текст по ссылке.',
        'Goods & services in current US$, World Bank (annual, ~1yr lag). Aggregate national trade, not per-commodity.': 'Товары и услуги в текущих US$, Всемирный банк (год, задержка ~1 год). Совокупная торговля страны, не по товарам.',
        // aria-labels + document title
        'Base currency': 'Базовая валюта',
        'Trend window': 'Период тренда',
        'Watched currencies': 'Отслеживаемые валюты',
        'News topics': 'Темы новостей',
        'Trade economy': 'Экономика для торговли',
        'Sections': 'Разделы',
        'Carino Currency — FX, News & Trade': 'Carino Currency — валюты, новости и торговля',
    },
};

let LOCALE = 'en';

function currentFleetLang() {
    return (window.CarinoLang && window.CarinoLang.current) || 'en';
}
function t(key) {
    const dict = I18N[LOCALE];
    return (dict && dict[key]) || key;
}

// Static markup: elements carrying data-i18n use their original English text as
// the key, captured on first pass so locale switches stay reversible.
function applyStaticI18n() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        if (!el.dataset.i18nKey) el.dataset.i18nKey = el.textContent.trim().replace(/\s+/g, ' ');
        el.textContent = t(el.dataset.i18nKey);
    });
}

// Attributes have no text node to read a key back from, so the English string
// is written here rather than inferred.
const I18N_ARIA = {
    baseSelect: 'Base currency',
    winTabs: 'Trend window',
    fxWatchChips: 'Watched currencies',
    newsTopics: 'News topics',
    tradeCountry: 'Trade economy',
    tabBar: 'Sections',
    runAll: 'Refresh',
    exportJson: 'Export',
};
function applyAttrI18n() {
    const q = document.getElementById('newsQuery');
    if (q) q.placeholder = t('Search finance news…');
    Object.keys(I18N_ARIA).forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.setAttribute('aria-label', t(I18N_ARIA[id]));
    });
    document.title = t('Carino Currency — FX, News & Trade');
}

function applyAll() {
    const l = currentFleetLang();
    LOCALE = (l === 'en' || I18N[l]) ? l : 'en';
    document.documentElement.lang = LOCALE;
    applyStaticI18n();
    applyAttrI18n();
    // The three pillars render from JS, so they cannot translate themselves.
    // app.js registers a repaint here; it replays from the TTL cache, so a
    // language switch costs no network.
    if (typeof window.onLanguageApplied === 'function') window.onLanguageApplied();
}

// The modules reach t() through here (util.js wraps it as T()).
window.CarinoI18n = { t: t, apply: applyAll };

// carino-lang.js is deferred and earlier in the document, so CarinoLang exists
// by DOMContentLoaded.
document.addEventListener('DOMContentLoaded', applyAll);
window.addEventListener('carino:langchange', applyAll);
