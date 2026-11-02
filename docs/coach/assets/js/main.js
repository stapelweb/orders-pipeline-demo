/* Сайт Евгения Веселова — минимальный скрипт.
   Всё содержимое страниц доступно и без JS: здесь только удобства. */
(function () {
  'use strict';

  /* --- Подключаем объёмные эффекты рядом лежащим файлом --- */
  var self = document.currentScript;
  if (self && self.src) {
    var fx = document.createElement('script');
    fx.src = self.src.replace(/main\.js(\?.*)?$/, 'fx.js');
    fx.defer = true;
    document.head.appendChild(fx);
  }

  /* --- Мобильное меню --- */
  var burger = document.querySelector('.burger');
  var links = document.querySelector('.nav-links');

  if (burger && links) {
    burger.setAttribute('aria-expanded', 'false');
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && links.classList.contains('open')) {
        links.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        burger.click();
      }
    });
  }

  /* --- Тень у шапки при прокрутке --- */
  var header = document.querySelector('header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Плавное появление блоков --- */
  var reveals = document.querySelectorAll('.reveal');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reveals.length) return;

  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  /* Страховка: если наблюдатель почему-то не сработал (вкладка была
     в фоне, ошибка браузера), через 3 секунды показываем всё принудительно.
     Контент никогда не должен остаться невидимым. */
  var safety = setTimeout(function () {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }, 3000);

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        clearTimeout(safety);
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(function (el) { io.observe(el); });
})();
