/* =========================================================
   Агния Шварц — стихи. Логика сайта.
   Данные — в poems.js (константа POEMS).
   ========================================================= */

/* ---------- НАСТРОЙКИ ----------
   Впишите ссылки на свои соцсети — пустые не показываются. */
const CONFIG = {
  socials: [
    { id: 'telegram', label: 'Telegram · фото',  url: 'https://t.me/photo_life_like' },
    { id: 'stihi',    label: 'Стихи.ру',          url: 'https://stihi.ru/avtor/veselova69' },
    { id: 'vk',       label: 'ВКонтакте',         url: 'https://vk.com/agnia_schwarz' },
    { id: 'youtube',  label: 'YouTube',           url: 'https://www.youtube.com/@agnia_schwarz' },
    { id: 'tiktok',   label: 'TikTok',            url: '' }
  ],
  authorName: 'Агния Шварц'
};

const ICONS = {
  telegram: '<svg viewBox="0 0 24 24"><path d="M21.9 4.3 18.9 19c-.2 1-.8 1.3-1.7.8l-4.6-3.4-2.2 2.1c-.3.3-.5.5-1 .5l.4-4.9 8.9-8c.4-.3-.1-.5-.6-.2L7.2 13 2.7 11.6c-1-.3-1-1 .2-1.4l17.6-6.8c.8-.3 1.5.2 1.4 1.4Z"/></svg>',
  stihi:    '<svg viewBox="0 0 24 24"><path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm8 1.8V9h4.2L14 4.8ZM8 12h8v1.6H8V12Zm0 3.4h8V17H8v-1.6Z"/></svg>',
  vk:       '<svg viewBox="0 0 24 24"><path d="M12.8 16.9c-5 0-8.2-3.5-8.3-9.3h2.6c.1 4.3 2.1 6.1 3.6 6.5V7.6h2.5v3.8c1.5-.2 3-1.9 3.6-3.8h2.4c-.4 2.3-2 4-3.2 4.7 1.2.6 3 2.1 3.7 4.6h-2.7c-.5-1.7-1.9-3-3.8-3.2v3.2h-.4Z"/></svg>',
  youtube:  '<svg viewBox="0 0 24 24"><path d="M22 12s0-3.3-.4-4.8a2.5 2.5 0 0 0-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.7 2 12 2 12s0 3.3.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8C22 15.3 22 12 22 12ZM10 15V9l5.2 3L10 15Z"/></svg>',
  tiktok:   '<svg viewBox="0 0 24 24"><path d="M16.5 3c.3 2.2 1.6 3.6 3.8 3.8v2.5c-1.3.1-2.5-.2-3.8-1v5.9c0 4.6-4.4 6.9-8 4.7-2.4-1.4-3-4.7-1.5-7 1.3-2 3.6-2.7 5.6-2.2v2.7c-.4-.1-.8-.2-1.2-.2-1.4 0-2.5 1.1-2.5 2.4 0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5V3h2.6Z"/></svg>'
};

const GENRE_ORDER = [
  'философская лирика', 'любовная лирика', 'стихи для детей', 'пейзажная лирика',
  'гражданская лирика', 'шуточные стихи', 'акростихи', 'мистика и эзотерика'
];

/* ---------- helpers ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const toDate = d => { const [dd, mm, yy] = (d || '01.01.2000').split('.'); return new Date(+yy, +mm - 1, +dd); };
const plural = (n, f) => { const m = n % 10, h = n % 100; return f[(m === 1 && h !== 11) ? 0 : (m >= 2 && m <= 4 && (h < 12 || h > 14)) ? 1 : 2]; };
const flatText = p => p.stanzas.flat().join('\n');
const prettyDate = d => { const t = toDate(d); return t.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }); };

/* ---------- состояние ---------- */
const store = {
  fav: new Set(JSON.parse(localStorage.getItem('ash:fav') || '[]')),
  save() { localStorage.setItem('ash:fav', JSON.stringify([...this.fav])); }
};
let state = { q: '', filter: 'all', sort: 'new' };
let visible = [];        // текущий отфильтрованный список в каталоге
let navList = [];        // список, по которому листаем в читалке
let navName = 'grid';    // какой именно это список
let current = -1;        // индекс открытого стихотворения в navList

/* откуда листать: из каталога, из цикла «О войне» или по всем стихам */
const byDate = arr => arr.slice().sort((a, b) => toDate(b.date) - toDate(a.date));
const LISTS = {
  grid: () => visible,
  war:  () => byDate(POEMS.filter(p => p.war)),
  all:  () => byDate(POEMS)
};

/* =========================================================
   ТЕМА (начальное значение выставляется inline-скриптом в <head>)
   ========================================================= */
$('#themeBtn').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('ash:theme', next);
  $('meta[name="theme-color"]').setAttribute('content', next === 'dark' ? '#12100e' : '#fbf7f1');
});

/* =========================================================
   ШАПКА / МЕНЮ
   ========================================================= */
const header = $('.header');
addEventListener('scroll', () => header.classList.toggle('is-stuck', scrollY > 8), { passive: true });

const burger = $('#burger'), nav = $('#nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
$$('#nav a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}));

/* =========================================================
   HERO: бегущая строка из стихов
   ========================================================= */
(function rotateLines() {
  const el = $('#rotatingLine');
  const lines = POEMS
    .flatMap(p => p.stanzas[0].map(l => ({ l: l.replace(/[,;:—-]\s*$/, ''), t: p.title })))
    .filter(o => o.l.length > 26 && o.l.length < 62);
  const picked = [];
  const seen = new Set();
  for (const o of lines) { if (!seen.has(o.t)) { seen.add(o.t); picked.push(o); } }
  picked.sort(() => Math.random() - 0.5);
  let i = 0;
  const show = () => { el.textContent = picked[i % picked.length].l; };
  show();
  setInterval(() => {
    el.classList.add('fade');
    setTimeout(() => { i++; show(); el.classList.remove('fade'); }, 400);
  }, 5200);
})();

/* =========================================================
   СТИХОТВОРЕНИЕ ДНЯ
   ========================================================= */
(function daily() {
  const day = Math.floor(Date.now() / 864e5);
  const p = POEMS[day % POEMS.length];
  const lines = p.stanzas[0].slice(0, 4);
  $('#dailyCard').innerHTML = `
    <div>
      <p class="eyebrow">${esc(p.genre)}</p>
      <h3>${esc(p.title)}</h3>
      <p class="daily-excerpt">${lines.map(esc).join('<br>')}…</p>
      <p style="margin:1.6rem 0 0">
        <a class="btn btn-primary" href="#poem/${p.slug}" data-open="${p.slug}" data-list="all">Читать целиком</a>
      </p>
    </div>
    <div class="daily-side">
      <p class="daily-excerpt" style="opacity:.55">${(p.stanzas[1] || p.stanzas[0]).map(esc).join('<br>')}</p>
    </div>`;
})();

/* =========================================================
   ФИЛЬТРЫ
   ========================================================= */
(function buildChips() {
  const counts = {};
  POEMS.forEach(p => counts[p.genre] = (counts[p.genre] || 0) + 1);
  const genres = GENRE_ORDER.filter(g => counts[g]);
  const chips = [
    { id: 'all', label: 'Все', n: POEMS.length },
    { id: 'fav', label: '♥ Избранное', n: null },
    { id: 'war', label: 'О войне', n: POEMS.filter(p => p.war).length },
    ...genres.map(g => ({ id: 'g:' + g, label: g[0].toUpperCase() + g.slice(1), n: counts[g] }))
  ];
  $('#chips').innerHTML = chips.map(c =>
    `<button class="chip" data-filter="${esc(c.id)}" aria-pressed="${c.id === 'all'}">${esc(c.label)}${c.n ? `<b>${c.n}</b>` : ''}</button>`
  ).join('');
})();

$('#chips').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  state.filter = chip.dataset.filter;
  $$('#chips .chip').forEach(c => c.setAttribute('aria-pressed', c === chip));
  render();
});

$('#search').addEventListener('input', e => {
  state.q = e.target.value.trim();
  $('#searchClear').hidden = !state.q;
  render();
});
$('#searchClear').addEventListener('click', () => {
  $('#search').value = ''; state.q = ''; $('#searchClear').hidden = true; render(); $('#search').focus();
});
$('#sort').addEventListener('change', e => { state.sort = e.target.value; render(); });
$('#resetBtn').addEventListener('click', () => {
  $('#search').value = ''; state.q = ''; state.filter = 'all'; $('#searchClear').hidden = true;
  $$('#chips .chip').forEach(c => c.setAttribute('aria-pressed', c.dataset.filter === 'all'));
  render();
});
$('#searchBtn').addEventListener('click', () => {
  $('#poems').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => $('#search').focus(), 500);
});

/* =========================================================
   РЕНДЕР СПИСКА
   ========================================================= */
/* «ё» и «е» считаем одной буквой — иначе поиск «звезда» не найдёт «звёзды» */
const norm = s => s.toLowerCase().replace(/ё/g, 'е');

function match(p, q) {
  if (!q) return true;
  return norm(p.title + ' ' + p.genre + ' ' + flatText(p)).includes(norm(q));
}

/* регулярка, где каждая «е» матчит и «ё» */
function queryRx(q) {
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[её]/gi, '[еЕёЁ]');
  return new RegExp('(' + safe + ')', 'gi');
}

function highlight(text, q) {
  const out = esc(text);
  if (!q || q.length < 2) return out;
  return out.replace(queryRx(q), '<mark>$1</mark>');
}

function excerptLines(p) {
  if (state.q && state.q.length > 1) {
    const all = p.stanzas.flat();
    const nq = norm(state.q);
    const hit = all.findIndex(l => norm(l).includes(nq));
    if (hit > -1) return all.slice(Math.max(0, hit - 1), Math.max(0, hit - 1) + 4);
  }
  return p.stanzas[0].slice(0, 4);
}

function render() {
  let list = POEMS.filter(p => match(p, state.q));
  if (state.filter === 'fav') list = list.filter(p => store.fav.has(p.slug));
  else if (state.filter === 'war') list = list.filter(p => p.war);
  else if (state.filter.startsWith('g:')) list = list.filter(p => p.genre === state.filter.slice(2));

  const sorters = {
    new:   (a, b) => toDate(b.date) - toDate(a.date),
    old:   (a, b) => toDate(a.date) - toDate(b.date),
    az:    (a, b) => a.title.localeCompare(b.title, 'ru'),
    short: (a, b) => a.lines - b.lines
  };
  list.sort(sorters[state.sort]);
  visible = list;

  const grid = $('#grid');
  grid.innerHTML = list.map((p, i) => `
    <article class="card" style="animation-delay:${Math.min(i, 12) * 35}ms">
      <div class="card-top">
        <span class="tag">${esc(p.war ? 'о войне' : p.genre)}</span>
        <button class="card-fav ${store.fav.has(p.slug) ? 'is-on' : ''}" data-fav="${p.slug}"
                aria-pressed="${store.fav.has(p.slug)}" aria-label="В избранное: ${esc(p.title)}" title="В избранное">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-9.3A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.7C19 15.6 12 20 12 20Z"/></svg>
        </button>
      </div>
      <h3><a class="card-link" href="#poem/${p.slug}" data-open="${p.slug}">${highlight(p.title, state.q)}</a></h3>
      <p class="card-excerpt">${excerptLines(p).map(l => highlight(l, state.q)).join('<br>')}</p>
      <div class="card-foot">
        <span>${esc(p.date)}</span><span class="dot"></span>
        <span>${p.lines} ${plural(p.lines, ['строка', 'строки', 'строк'])}</span>
      </div>
    </article>`).join('');

  $('#empty').hidden = list.length > 0;
  $('#resultCount').textContent = list.length
    ? `${list.length} ${plural(list.length, ['стихотворение', 'стихотворения', 'стихотворений'])}`
    : '';
}

/* делегирование кликов по карточкам */
document.addEventListener('click', e => {
  const fav = e.target.closest('[data-fav]');
  if (fav) {
    e.preventDefault();
    toggleFav(fav.dataset.fav);
    const on = store.fav.has(fav.dataset.fav);
    fav.classList.toggle('is-on', on);
    fav.setAttribute('aria-pressed', on);
    if (state.filter === 'fav') render();
    return;
  }
  const open = e.target.closest('[data-open]');
  if (open) {
    e.preventDefault();   // хэш ставит сам openPoem, чтобы не плодить записи в истории
    openPoem(open.dataset.open, true, open.dataset.list || 'grid');
  }
});

function toggleFav(slug) {
  store.fav.has(slug) ? store.fav.delete(slug) : store.fav.add(slug);
  store.save();
  toast(store.fav.has(slug) ? 'Добавлено в избранное' : 'Убрано из избранного');
  syncFavBtn();
}

/* =========================================================
   РАЗДЕЛ «О ВОЙНЕ»
   ========================================================= */
$('#warList').innerHTML = POEMS.filter(p => p.war)
  .sort((a, b) => toDate(b.date) - toDate(a.date))
  .map(p => `<a class="war-item" href="#poem/${p.slug}" data-open="${p.slug}" data-list="war">
      <b>${esc(p.title)}</b><span>${p.lines} ${plural(p.lines, ['строка', 'строки', 'строк'])}</span>
    </a>`).join('');

/* =========================================================
   СОЦСЕТИ
   ========================================================= */
$('#socials').innerHTML = CONFIG.socials.filter(s => s.url).map(s =>
  `<a class="social" href="${esc(s.url)}" target="_blank" rel="noopener">${ICONS[s.id] || ''}${esc(s.label)}</a>`
).join('');

/* =========================================================
   ЧИТАЛКА
   ========================================================= */
const reader = $('#reader');
const readerBody = $('#readerBody');
let lastFocused = null;

function openPoem(slug, push = true, listName = navName) {
  navName = LISTS[listName] ? listName : 'grid';
  navList = LISTS[navName]();
  let idx = navList.findIndex(p => p.slug === slug);
  if (idx === -1) { navList = LISTS.all(); navName = 'all'; idx = navList.findIndex(p => p.slug === slug); }
  const p = navList[idx];
  if (!p) return;
  current = idx;
  if (reader.hidden) lastFocused = document.activeElement;

  $('#readerGenre').textContent = p.war ? 'Цикл «О войне» · ' + p.genre : p.genre;
  $('#readerTitle').textContent = p.title;
  $('#readerText').innerHTML = p.stanzas
    .map(st => `<p class="stanza">${st.map(esc).join('<br>')}</p>`).join('');
  $('#readerMeta').textContent =
    `Опубликовано ${prettyDate(p.date)}${p.written && p.written !== p.date ? ' · написано ' + prettyDate(p.written) : ''} · ${p.lines} ${plural(p.lines, ['строка', 'строки', 'строк'])}`;
  $('#readerSource').href = p.url;

  reader.hidden = false;
  document.body.classList.add('reader-open');
  readerBody.scrollTop = 0;
  $('#readerProgress').style.width = '0%';
  readerBody.focus();

  $('#prevBtn').disabled = current <= 0;
  $('#nextBtn').disabled = current < 0 || current >= navList.length - 1;
  syncFavBtn();

  if (push && location.hash !== '#poem/' + slug) history.pushState({ slug }, '', '#poem/' + slug);
  document.title = `${p.title} — ${CONFIG.authorName}`;
}

function closeReader(push = true) {
  reader.hidden = true;
  document.body.classList.remove('reader-open');
  document.title = 'Агния Шварц — стихи. Философская лирика, любовь, война';
  if (push && location.hash.startsWith('#poem/')) history.pushState({}, '', location.pathname);
  if (lastFocused) lastFocused.focus();
}

function currentPoem() {
  return current > -1 ? navList[current] : null;
}

function syncFavBtn() {
  const p = currentPoem();
  $('#favBtn').classList.toggle('is-on', !!p && store.fav.has(p.slug));
}

$$('[data-close]').forEach(el => el.addEventListener('click', () => closeReader()));
$('#prevBtn').addEventListener('click', () => { if (current > 0) openPoem(navList[current - 1].slug); });
$('#nextBtn').addEventListener('click', () => { if (current > -1 && current < navList.length - 1) openPoem(navList[current + 1].slug); });

$('#favBtn').addEventListener('click', () => {
  const p = currentPoem(); if (!p) return;
  toggleFav(p.slug);
  const card = $(`[data-fav="${p.slug}"]`);
  if (card) card.classList.toggle('is-on', store.fav.has(p.slug));
});

$('#copyBtn').addEventListener('click', async () => {
  const p = currentPoem(); if (!p) return;
  const text = `${p.title}\n\n${p.stanzas.map(s => s.join('\n')).join('\n\n')}\n\n© ${CONFIG.authorName}`;
  try { await navigator.clipboard.writeText(text); toast('Текст скопирован'); }
  catch { toast('Не удалось скопировать'); }
});

$('#shareBtn').addEventListener('click', async () => {
  const p = currentPoem(); if (!p) return;
  const url = location.origin + location.pathname + '#poem/' + p.slug;
  const data = { title: p.title, text: `«${p.title}» — ${CONFIG.authorName}`, url };
  if (navigator.share) { try { await navigator.share(data); return; } catch { /* отменено */ } }
  try { await navigator.clipboard.writeText(url); toast('Ссылка скопирована'); }
  catch { toast(url); }
});

/* размер шрифта в читалке */
let poemSize = +(localStorage.getItem('ash:size') || 1.08);
const applySize = () => { document.documentElement.style.setProperty('--poem-size', poemSize.toFixed(2) + 'rem'); localStorage.setItem('ash:size', poemSize); };
applySize();
$('#fontUp').addEventListener('click', () => { poemSize = Math.min(1.7, poemSize + .1); applySize(); });
$('#fontDown').addEventListener('click', () => { poemSize = Math.max(.9, poemSize - .1); applySize(); });

/* прогресс чтения */
readerBody.addEventListener('scroll', () => {
  const max = readerBody.scrollHeight - readerBody.clientHeight;
  $('#readerProgress').style.width = (max > 10 ? (readerBody.scrollTop / max) * 100 : 0) + '%';
}, { passive: true });

/* случайное стихотворение */
$('#randomBtn').addEventListener('click', () => {
  const p = POEMS[Math.floor(Math.random() * POEMS.length)];
  openPoem(p.slug, true, 'all');
});

/* =========================================================
   КЛАВИАТУРА
   ========================================================= */
addEventListener('keydown', e => {
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
  if (!reader.hidden) {
    if (e.key === 'Escape') closeReader();
    if (e.key === 'ArrowRight') $('#nextBtn').click();
    if (e.key === 'ArrowLeft') $('#prevBtn').click();
    return;
  }
  if (e.key === '/' && !typing) { e.preventDefault(); $('#searchBtn').click(); }
});

/* фокус-ловушка в читалке */
reader.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const f = $$('button, a[href], input, select', reader).filter(el => !el.disabled && el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

/* =========================================================
   РОУТИНГ ПО ХЭШУ (ссылки на конкретное стихотворение)
   ========================================================= */
function routeFromHash() {
  const h = location.hash;
  if (h.startsWith('#poem/')) openPoem(decodeURIComponent(h.slice(6)), false, 'all');
  else if (!reader.hidden) closeReader(false);
}
addEventListener('popstate', routeFromHash);

/* =========================================================
   ТОСТ
   ========================================================= */
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* =========================================================
   ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ
   ========================================================= */
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: .12 });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = Math.min(i, 6) * 70 + 'ms'; io.observe(el); });
  /* страховка: если наблюдатель почему-то не сработал — показываем всё */
  setTimeout(() => $$('.reveal:not(.in)').forEach(el => {
    if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in');
  }), 2000);
} else {
  $$('.reveal').forEach(el => el.classList.add('in'));
}

/* =========================================================
   СТАРТ
   ========================================================= */
$('#year').textContent = new Date().getFullYear();
render();
routeFromHash();
