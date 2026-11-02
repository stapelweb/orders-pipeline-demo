/* =========================================================
   Агния Шварц — визитка. Немного оживляем статичную страницу.
   Данные о публикациях берём из poems.js (константа POEMS).
   ========================================================= */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* =========================================================
   ПОСЛЕДНИЕ ПУБЛИКАЦИИ
   ========================================================= */
(function publications() {
  const rows = $('#rows');
  if (!rows || typeof POEMS === 'undefined') return;

  const toDate = d => { const [dd, mm, yy] = d.split('.'); return new Date(+yy, +mm - 1, +dd); };
  const plural = (n, f) => { const m = n % 10, h = n % 100;
    return f[(m === 1 && h !== 11) ? 0 : (m >= 2 && m <= 4 && (h < 12 || h > 14)) ? 1 : 2]; };
  const day = d => toDate(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

  rows.innerHTML = POEMS
    .slice()
    .sort((a, b) => toDate(b.date) - toDate(a.date))
    .slice(0, 5)
    .map(p => `
      <a class="row" href="stihi.html#poem/${p.slug}">
        <span class="row-date">${esc(day(p.date))}</span>
        <span class="row-title">${esc(p.title)}</span>
        <span class="row-meta">${esc(p.war ? 'о войне' : p.genre)} · ${p.lines} ${plural(p.lines, ['строка', 'строки', 'строк'])}</span>
      </a>`).join('');
})();

/* =========================================================
   ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ
   ========================================================= */
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(en => {
    en.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .08 });
  $$('.reveal').forEach(el => io.observe(el));
  /* страховка: если наблюдатель не сработал, показываем видимое */
  setTimeout(() => $$('.reveal:not(.in)').forEach(el => {
    if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in');
  }), 2000);
} else {
  $$('.reveal').forEach(el => el.classList.add('in'));
}

/* =========================================================
   МЕЛОЧИ
   ========================================================= */
$('#year').textContent = new Date().getFullYear();

/* портрет: если файла нет — оставляем мягкую подложку вместо битой картинки */
const portrait = $('.portrait img');
if (portrait) portrait.addEventListener('error', () => portrait.remove());
