(function (root) {
  'use strict';

  const STORAGE_KEY = 'vale-study-inventors-v1';
  const LIMIT = 1024 * 1024;
  const FOLDER = 'application/vnd.google-apps.folder';
  const TYPES = {
    'video/mp4': 'video',
    'application/pdf': 'guide',
    'image/jpeg': 'image',
    'image/svg+xml': 'template',
    'application/dxf': 'template'
  };
  const CATEGORIES = {
    1: ['Бумажные игрушки', 'Играчке од папира', 'Paper toys', '✂'],
    2: ['Творческие поделки', 'Креативне рукотворине', 'Creative crafts', '✦'],
    3: ['Научные эксперименты', 'Научни огледи', 'Science experiments', '⚗'],
    4: ['Игры из картона', 'Игре од картона', 'Cardboard games', '▦'],
    5: ['Весёлая магия', 'Забавна магија', 'Fun magic', '✧'],
    6: ['Робототехника', 'Роботика', 'Robotics', '⚙'],
    7: ['Подарок', 'Поклон', 'Gift', '◇'],
    bonus: ['Бонусные видео', 'Додатни видео-снимци', 'Bonus videos', '▶'],
    dictionary: ['Словарь изобретателя', 'Речник проналазача', 'Inventor’s glossary', '▤']
  };
  const WORDS = {
    title: ['Изобретатели', 'Проналазачи', 'Inventors'],
    intro: ['Выбери, что хочешь смастерить. Открой видео или инструкцию и собирай в своём темпе.', 'Изабери шта желиш да направиш. Отвори видео или упутство и ради својим темпом.', 'Pick something to make. Open a video or guide and build at your own pace.'],
    connect: ['Подключить каталог', 'Повежи каталог', 'Add a catalog'],
    connectHelp: ['Выбери файл Valja-Inventors.json. Он добавит список проектов на это устройство.', 'Изабери датотеку Valja-Inventors.json да додаш списак пројеката на овај уређај.', 'Choose Valja-Inventors.json to add the project list to this device.'],
    replace: ['Заменить каталог', 'Замени каталог', 'Replace catalog'],
    imported: ['Каталог готов', 'Каталог је спреман', 'Catalog is ready'],
    invalid: ['Не удалось прочитать каталог. Выбери файл Valja-Inventors.json.', 'Каталог није прочитан. Изабери датотеку Valja-Inventors.json.', 'Could not read the catalog. Choose Valja-Inventors.json.'],
    storage: ['Не удалось сохранить каталог на устройстве. Попробуй освободить место.', 'Каталог није сачуван. Покушај да ослободиш простор на уређају.', 'Could not save the catalog. Try freeing up space on this device.'],
    search: ['Найти поделку или видео', 'Пронађи пројекат или видео', 'Find a project or video'],
    empty: ['Ничего не нашлось. Попробуй другое слово.', 'Нема резултата. Покушај са другом речју.', 'No results. Try a different word.'],
    files: ['Файлов', 'Датотека', 'Files'],
    videos: ['Видео', 'Видео-снимака', 'Videos'],
    video: ['Видео', 'Видео', 'Video'],
    guide: ['PDF', 'PDF', 'PDF'],
    image: ['Рисунок', 'Слика', 'Image'],
    template: ['Шаблон', 'Шаблон', 'Template'],
    folder: ['Подборка', 'Збирка', 'Collection'],
    watch: ['Смотреть', 'Погледај', 'Watch'],
    read: ['Открыть', 'Отвори', 'Open'],
    preview: ['Открыть просмотр', 'Отвори преглед', 'Open preview'],
    online: ['Для просмотра файлов нужен интернет.', 'За преглед датотека потребан је интернет.', 'Viewing files requires internet.'],
    fallback: ['Открыть файл в браузере', 'Отвори датотеку у прегледачу', 'Open file in browser'],
    fallbackHelp: ['Если просмотр не открывается, попробуй открыть файл в браузере с доступом к папке.', 'Ако преглед не ради, отвори датотеку у прегледачу који има приступ фасцикли.', 'If the preview does not open, try a browser with access to the folder.'],
    unavailable: ['Этот материал отсутствует в подключённом каталоге.', 'Овог материјала нема у повезаном каталогу.', 'This file is missing from the connected catalog.'],
    all: ['К разделам', 'Све збирке', 'All collections']
  };

  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const isId = value => typeof value === 'string' && /^[A-Za-z0-9_-]{10,100}$/.test(value);
  const isFolder = item => item.mime === FOLDER;
  const number = title => /^\s*(\d+)\s*[.)–-]/u.exec(title)?.[1];
  const cleanTitle = title => title.replace(/^\s*\d+\s*[.)–-]\s*/u, '').replace(/\.(mp4|pdf|jpe?g|svg|dxf)$/i, '');
  const natural = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' });
  const lower = value => value.toLocaleLowerCase('ru').replaceAll('ё', 'е');
  const pathFor = item => '#inventors/' + item.id;

  function safeLink(value, id, folder) {
    const url = new URL(value);
    const expected = folder ? '/drive/folders/' + id : '/file/d/' + id + '/view';
    if (url.origin !== 'https://drive.google.com' || url.username || url.password || url.pathname !== expected) throw Error('Invalid Drive link');
    const resourceKey = url.searchParams.get('resourcekey');
    return 'https://drive.google.com' + expected + (isId(resourceKey) ? '?resourcekey=' + resourceKey : '');
  }

  function parseCatalog(text) {
    if (typeof text !== 'string' || text.length > LIMIT) throw Error('Invalid catalog size');
    const data = JSON.parse(text);
    if (data?.version !== 1 || !Array.isArray(data.items) || !data.items.length) throw Error('Invalid catalog');
    const ids = new Set();
    function parse(item, depth) {
      if (depth > 12 || ids.size >= 2000 || !isId(item?.id) || ids.has(item.id) ||
          typeof item.title !== 'string' || !item.title.trim() || item.title.length > 300) throw Error('Invalid entry');
      ids.add(item.id);
      const folder = isFolder(item);
      const entry = { id: item.id, title: item.title.trim(), mime: item.mime, url: safeLink(item.url, item.id, folder) };
      if (folder && Array.isArray(item.items)) return { ...entry, items: item.items.map(child => parse(child, depth + 1)) };
      if (!Object.prototype.hasOwnProperty.call(TYPES, item.mime) || !Number.isSafeInteger(item.size) || item.size < 0) throw Error('Invalid file');
      return { ...entry, size: item.size };
    }
    return { version: 1, items: data.items.map(item => parse(item, 0)) };
  }

  function indexCatalog(catalog) {
    const entries = new Map();
    function collect(item, parents) {
      const files = isFolder(item) ? item.items.flatMap(child => collect(child, [...parents, item])) : [item];
      entries.set(item.id, { item, parents, files, videos: files.filter(file => file.mime === 'video/mp4').length });
      return files;
    }
    const files = catalog.items.flatMap(item => collect(item, []));
    return { entries, files, videos: files.filter(file => file.mime === 'video/mp4').length };
  }

  function create({ shell, lang, storage, toast }) {
    let catalog;
    let index;
    let query = '';
    let searchScope = null;
    let routeParts = [];
    let importSequence = 0;
    const localeIndex = () => ['ru', 'sr', 'en'].indexOf(lang());
    const t = key => WORDS[key][localeIndex()] || WORDS[key][0];
    const category = item => CATEGORIES[number(item.title) || (isFolder(item) ? 'bonus' : 'dictionary')];
    const title = item => catalog.items.includes(item) ? category(item)?.[localeIndex()] || cleanTitle(item.title) : cleanTitle(item.title);
    const size = bytes => new Intl.NumberFormat(lang(), {
      style: 'unit', unit: bytes >= 1e9 ? 'gigabyte' : bytes >= 1e6 ? 'megabyte' : 'kilobyte', maximumFractionDigits: 1
    }).format(bytes / (bytes >= 1e9 ? 1e9 : bytes >= 1e6 ? 1e6 : 1e3));
    try {
      const saved = storage.getItem(STORAGE_KEY);
      if (saved) {
        catalog = parseCatalog(saved);
        index = indexCatalog(catalog);
      }
    } catch {
      catalog = null;
    }

    function importButton(replace) {
      return `<label class="${replace ? 'secondary' : 'primary'} inventor-import">${t(replace ? 'replace' : 'connect')}<input type="file" id="inventor-import" accept=".json,application/json" aria-label="${t(replace ? 'replace' : 'connect')}"></label>`;
    }

    function card(item, topLevel = false, path = '') {
      const entry = index.entries.get(item.id);
      const kind = isFolder(item) ? 'folder' : TYPES[item.mime];
      const meta = kind === 'folder' ? `${t('files')} · ${entry.files.length}${entry.videos ? ` / ${t('videos')} · ${entry.videos}` : ''}` : `${t(kind)} · ${size(item.size)}`;
      const prefix = number(item.title);
      const mark = prefix && !/^0+$/.test(prefix) ? prefix.padStart(2, '0') : topLevel ? category(item)?.[3] : kind === 'video' ? '▶' : '▤';
      return `<a class="inventor-card ${topLevel ? 'inventor-category' : ''}" href="${pathFor(item)}"><span class="inventor-mark" aria-hidden="true">${mark || '◇'}</span><span class="inventor-card-text"><strong>${escapeHTML(title(item))}</strong><small>${escapeHTML(path ? path + ' · ' + meta : meta)}</small></span><span class="inventor-arrow" aria-hidden="true">${kind === 'video' && !topLevel ? '▶' : '→'}</span></a>`;
    }

    function results() {
      const scope = searchScope ? index.entries.get(searchScope) : null;
      const list = scope ? scope.item.items : catalog.items;
      const terms = lower(query).trim().split(/\s+/u).filter(Boolean);
      if (!terms.length) {
        const sorted = scope ? [...list].sort((a, b) => {
          const priority = item => /^\s*0\s*[.)–-]/u.test(item.title) && !isFolder(item) ? 1 : 0;
          return priority(a) - priority(b) || natural.compare(a.title, b.title);
        }) : list;
        return sorted.map(item => card(item, !scope)).join('');
      }
      const files = scope ? scope.files : index.files;
      const matches = files.filter(file => {
        const entry = index.entries.get(file.id);
        const parents = scope ? entry.parents.slice(scope.parents.length + 1) : entry.parents;
        const haystack = lower([...parents.map(parent => parent.title + ' ' + title(parent)), file.title].join(' '));
        return terms.every(term => haystack.includes(term));
      }).sort((a, b) => natural.compare(a.title, b.title));
      return matches.map(file => card(file, false, index.entries.get(file.id).parents.map(title).join(' / '))).join('') ||
        `<p class="inventor-empty" role="status">${t('empty')}</p>`;
    }

    function crumbs(items = []) {
      return `<nav class="breadcrumb" aria-label="${t('all')}"><a href="#inventors">${t('title')}</a>${items.map(item => `<span aria-hidden="true">›</span><a href="${pathFor(item)}">${escapeHTML(title(item))}</a>`).join('')}</nav>`;
    }

    function render(parts = []) {
      routeParts = parts;
      if (!catalog) {
        shell(`<section class="inventor-hero"><div><h1>${t('title')}</h1><p>${t('intro')}</p></div><span class="inventor-hero-icon" aria-hidden="true">⚙</span></section><section class="panel inventor-setup"><h2>${t('connect')}</h2><p>${t('connectHelp')}</p>${importButton(false)}</section>`, 'inventors');
        return;
      }
      const entry = parts[0] ? index.entries.get(parts[0]) : null;
      if (parts[0] && !entry) {
        shell(`${crumbs()}<p>${t('unavailable')}</p>`, 'inventors');
        return;
      }
      if (entry && !isFolder(entry.item)) {
        const item = entry.item;
        const kind = TYPES[item.mime];
        const previewable = kind !== 'template';
        shell(`${crumbs(entry.parents)}<section class="panel inventor-view"><p class="eyebrow">${t(kind)} · ${escapeHTML(size(item.size))}</p><h1>${escapeHTML(title(item))}</h1><div class="inventor-view-actions">${previewable ? `<button class="primary" data-action="inventor-preview">${kind === 'video' ? '▶ ' + t('watch') : t('preview')}</button>` : ''}<a class="secondary" href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">${t('fallback')} ↗</a></div><div id="inventor-viewer"></div><p class="small-note">${previewable ? t('fallbackHelp') : t('online')}</p></section>`, 'inventors');
        return;
      }
      const nextScope = entry?.item.id || null;
      if (nextScope !== searchScope) query = '';
      searchScope = nextScope;
      const heading = entry ? escapeHTML(title(entry.item)) : t('title');
      const stats = entry ? entry.files : index.files;
      const count = entry ? entry.videos : index.videos;
      shell(`${entry ? crumbs(entry.parents) : ''}<section class="inventor-hero"><div><h1>${heading}</h1><p>${entry ? `${t('files')} · ${stats.length}${count ? ` / ${t('videos')} · ${count}` : ''}` : t('intro')}</p></div><span class="inventor-hero-icon" aria-hidden="true">${entry ? '✦' : '⚙'}</span></section><div class="inventor-toolbar"><input id="inventor-search" type="search" maxlength="120" value="${escapeHTML(query)}" placeholder="${t('search')}" aria-label="${t('search')}"><p class="small-note">${t('online')}</p></div><div id="inventor-results" class="inventor-grid">${results()}</div>${entry ? '' : `<div class="inventor-settings">${importButton(true)}</div>`}`, 'inventors');
    }

    function search(value) {
      const el = document.querySelector('#inventor-results');
      if (!el || !index) return;
      query = value;
      el.innerHTML = results();
    }

    async function importFile(file) {
      if (!file) return;
      const request = ++importSequence;
      let parsed;
      try {
        if (file.size > LIMIT) throw Error('Invalid catalog size');
        parsed = parseCatalog(await file.text());
      } catch {
        if (request === importSequence) toast(t('invalid'));
        return;
      }
      if (request !== importSequence) return;
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      } catch {
        toast(t('storage'));
        return;
      }
      catalog = parsed;
      index = indexCatalog(catalog);
      query = '';
      if (location.hash === '#inventors' || location.hash.startsWith('#inventors/')) render();
      toast(t('imported'));
    }

    function showPreview(button) {
      const host = document.querySelector('#inventor-viewer');
      const item = index?.entries.get(routeParts[0])?.item;
      if (!host || !item || !['video', 'guide', 'image'].includes(TYPES[item.mime])) return;
      const url = new URL(item.url);
      url.pathname = '/file/d/' + item.id + '/preview';
      host.innerHTML = `<iframe class="inventor-player ${item.mime === 'video/mp4' ? '' : 'inventor-document'}" src="${escapeHTML(url.href)}" title="${escapeHTML(title(item))}" allow="fullscreen; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="no-referrer"></iframe>`;
      host.querySelector('iframe').focus();
      button.hidden = true;
    }
    return { render, search, importFile, showPreview };
  }

  const api = { create, parseCatalog, indexCatalog };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ValeInventors = api;
})(typeof window === 'undefined' ? globalThis : window);
