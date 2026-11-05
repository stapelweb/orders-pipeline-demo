/*
 * Блок отзывов для карточек «Бердь Таёжная».
 *
 * Показывает в карточке объекта оценку и количество отзывов с тех площадок,
 * где объект есть, и ссылку «читать отзывы» на источник.
 *
 * Два правила, из которых всё устроено:
 *   1. Если объекта нет в данных — блок не рисуется вовсе. Поэтому скрипт
 *      можно подключить ко всем 42 карточкам: у 24 точек, которых нет в
 *      справочниках, он просто промолчит.
 *   2. Показываем только то, что площадки отдают открыто: оценку, число
 *      отзывов и ссылку. Тексты отзывов сюда не тянем — для них нужен
 *      платный сервис, и это отдельное решение заказчика.
 */
(function () {
  'use strict';

  /* Свой адрес запоминаем сразу: document.currentScript обнуляется, как
     только файл отработал, а он нужен, чтобы дотянуться до соседнего
     «data.js» на нашем же хостинге. */
  var СВОЙ_АДРЕС = (document.currentScript && document.currentScript.src) || '';

  /* Флаг в подписи карты. Его рисует сама библиотека Leaflet, начиная с 2022
     года, — в нашем коде его нет. Заказчик попросил убрать: проект идёт на
     частично государственном финансировании, и лишних вопросов ему не нужно.
     Убираем только флажок. Подпись «Leaflet | © OpenStreetMap» остаётся на
     месте: это требование лицензии карты, снимать его нельзя. */
  (function убратьФлагКарты() {
    var метка = 'berd-no-flag';
    if (document.getElementById(метка)) return;
    var стиль = document.createElement('style');
    стиль.id = метка;
    /* Селектор нарочно тяжёлый. У самого Leaflet на этот флажок стоит
       display:inline !important, и его файл подключается позже нашего —
       при равном весе каскад выбирает последнего. Проверено 14.10.2026
       на gid.na-berdi.ru/karta: одиночный .leaflet-attribution-flag
       давал display:inline, связка «предок + тег + класс» даёт none. */
    стиль.textContent =
      '.leaflet-control-attribution svg.leaflet-attribution-flag{display:none!important}' +
      '.leaflet-container .leaflet-attribution-flag{display:none!important}';
    (document.head || document.documentElement).appendChild(стиль);
  })();

  /* Данные лежат прямо здесь, а не отдельным файлом: страница Андрея
     и наш хостинг — разные домены, и браузер запрещает такой запрос
     (CORS). Встроенные данные убирают эту зависимость совсем. */
  var ДАННЫЕ = {
    "обновлено": "2026-10-13",
    "примечание": "Оценка и количество отзывов берутся с площадок. Тексты отзывов площадки открыто не отдают — для них нужен платный сервис-агрегатор. Объект в карточке опознаётся по артикулу (P-xx), как и кнопка «На карте».",
    "объекты": [
      {
        "ключ": "berezovskie-skaly",
        "название": "Берёзовские скалы",
        "площадки": [
          {
            "имя": "2ГИС",
            "оценка": 4.4,
            "оценок": 8,
            "отзывов": 6,
            "ссылка": "https://2gis.ru/novosibirsk/geo/70030076190660288/tab/reviews",
            "проверено": "2026-10-13"
          },
          {
            "имя": "Яндекс Карты",
            "оценка": 4.3,
            "оценок": 6,
            "отзывов": 6,
            "ссылка": "https://yandex.ru/maps/org/beryozovskiye_skaly/230278221917/reviews/",
            "проверено": "2026-10-13"
          },
          {
            "имя": "Google Карты",
            "оценка": 4.8,
            "оценок": 26,
            "отзывов": 26,
            "ссылка": "https://www.google.com/maps/place/%D0%91%D0%B5%D1%80%D0%B5%D0%B7%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B5+%D0%A1%D0%BA%D0%B0%D0%BB%D1%8B/@54.5525325,84.0388887,16z",
            "проверено": "2026-10-12"
          }
        ],
        "артикулы": [
          "P-28"
        ]
      },
      {
        "ключ": "sokolinyy-kamen",
        "название": "Соколиный камень",
        "площадки": [
          {
            "имя": "2ГИС",
            "оценка": 5.0,
            "оценок": 5,
            "отзывов": 3,
            "ссылка": "https://2gis.ru/novosibirsk/geo/70030076190660262/tab/reviews",
            "проверено": "2026-10-13"
          },
          {
            "имя": "Яндекс Карты",
            "оценка": 4.9,
            "оценок": null,
            "отзывов": 0,
            "ссылка": "https://yandex.ru/maps/?mode=poi&poi%5Bpoint%5D=84.030876%2C54.522725&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D14731112325&tab=reviews",
            "проверено": "2026-10-13",
            "пометка": "оценка есть, текстов отзывов пока нет"
          },
          {
            "имя": "Google Карты",
            "оценка": 4.9,
            "оценок": 11,
            "отзывов": 11,
            "ссылка": "https://www.google.com/maps/place/%D0%A1%D0%BE%D0%BA%D0%BE%D0%BB%D0%B8%D0%BD%D0%B0%D1%8F+%D0%B3%D0%BE%D1%80%D0%B0/@54.522803,84.030598,16z",
            "проверено": "2026-10-12"
          }
        ],
        "артикулы": [
          "P-01"
        ]
      },
      {
        "ключ": "uzkaya-luka",
        "название": "Узкая Лука",
        "площадки": [
          {
            "имя": "2ГИС",
            "оценка": 5.0,
            "оценок": 1,
            "отзывов": 1,
            "ссылка": "https://2gis.ru/novosibirsk/geo/70030076698859888/tab/reviews",
            "проверено": "2026-10-13"
          }
        ],
        "артикулы": [
          "P-02"
        ]
      },
      {
        "ключ": "zveroboy",
        "название": "Зверобой",
        "площадки": [
          {
            "имя": "2ГИС",
            "оценка": 4.8,
            "оценок": 277,
            "отзывов": null,
            "ссылка": "https://2gis.ru/novosibirsk/search/%D0%A1%D0%BA%D0%B0%D0%BB%D1%8B%20%D0%97%D0%B2%D0%B5%D1%80%D0%BE%D0%B1%D0%BE%D0%B9",
            "проверено": "2026-10-13",
            "пометка": "карточка «Скалы Зверобой»"
          },
          {
            "имя": "2ГИС, вторая карточка",
            "оценка": 4.6,
            "оценок": 43,
            "отзывов": null,
            "ссылка": "https://2gis.ru/novosibirsk/search/%D0%AD%D0%BA%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D1%82%D1%80%D0%BE%D0%BF%D0%B0%20%D0%97%D0%B2%D0%B5%D1%80%D0%BE%D0%B1%D0%BE%D0%B9",
            "проверено": "2026-10-13",
            "пометка": "дубль: «Экологическая тропа Зверобой»"
          },
          {
            "имя": "Google Карты",
            "оценка": 4.9,
            "оценок": 482,
            "отзывов": 482,
            "ссылка": "https://www.google.com/maps/search/%D0%91%D0%B5%D1%80%D0%B4%D1%81%D0%BA%D0%B8%D0%B5+%D0%A1%D0%BA%D0%B0%D0%BB%D1%8B",
            "проверено": "2026-10-12"
          }
        ],
        "артикулы": [
          "P-07",
          "P-09"
        ]
      },
      {
        "ключ": "sobachiy-kamen",
        "название": "Собачий камень",
        "площадки": [
          {
            "имя": "Google Карты",
            "оценка": 4.7,
            "оценок": 21,
            "отзывов": 21,
            "ссылка": "https://www.google.com/maps/search/%D0%A1%D0%BE%D0%B1%D0%B0%D1%87%D0%B8%D0%B9+%D0%BA%D0%B0%D0%BC%D0%B5%D0%BD%D1%8C",
            "проверено": "2026-10-12"
          }
        ],
        "артикулы": [
          "P-15"
        ]
      },
      {
        "ключ": "kemping",
        "название": "Кемпинг «Бердь Таёжная»",
        "площадки": [
          {
            "имя": "Google Карты",
            "оценка": 4.5,
            "оценок": 13,
            "отзывов": 13,
            "ссылка": "https://www.google.com/maps/search/%D0%91%D0%B5%D1%80%D0%B4%D1%8C+%D0%A2%D0%B0%D1%91%D0%B6%D0%BD%D0%B0%D1%8F",
            "проверено": "2026-10-12"
          }
        ],
        "артикулы": []
      }
    ]
  };

  function чисто(s) {
    return (s || '')
      .toLowerCase()
      .replace(/[ёе]/g, 'е')
      .replace(/[^a-zа-я0-9]+/gi, ' ')
      .trim();
  }

  /* Объект опознаём по артикулу карточки (P-xx) — тем же способом, что и
     кнопка «На карте». Это надёжнее заголовка: названия на сайте и в
     справочниках не совпадают, а артикул один и тот же. */
  function артикул_карточки(узел) {
    var поле = узел.querySelector('.js-product-sku, .js-catalog-prod-sku');
    if (!поле) return null;
    var sku = (поле.textContent || '').trim().toUpperCase();
    return /^[PR]-\d+$/.test(sku) ? sku : null;
  }

  function объект_по_артикулу(объекты, sku) {
    for (var i = 0; i < объекты.length; i++) {
      var список = объекты[i].артикулы || [];
      for (var j = 0; j < список.length; j++) {
        if (String(список[j]).toUpperCase() === sku) return объекты[i];
      }
    }
    return null;
  }

  function склонение(n, формы) {
    var o = Math.abs(n) % 100, e = o % 10;
    if (o > 10 && o < 20) return формы[2];
    if (e > 1 && e < 5) return формы[1];
    if (e === 1) return формы[0];
    return формы[2];
  }

  function звёзды(оценка) {
    var полных = Math.round(оценка);
    var s = '';
    for (var i = 1; i <= 5; i++) s += (i <= полных ? '★' : '☆');
    return s;
  }

  /* Из ссылки на карточку организации достаём её номер: именно он нужен
     официальному виджету отзывов Яндекса. Подходит только адрес вида
     /maps/org/<имя>/<номер>/ — у точки на карте (?mode=poi&poi[uri]=...)
     номера организации нет, и виджета для неё не существует. Проверено
     22.10.2026 на двух наших ссылках: «Берёзовские скалы» дают виджет,
     «Соколиный камень» — нет. */
  function ид_яндекса(ссылка) {
    var m = /(?:yandex\.[a-z.]+)\/maps\/org\/[^\/]+\/(\d+)/i.exec(ссылка || '');
    return m ? m[1] : null;
  }

  function виджет_яндекса(ид) {
    var рамка = document.createElement('div');
    рамка.className = 'berd-reviews__widget';

    var кнопка = document.createElement('button');
    кнопка.type = 'button';
    кнопка.className = 'berd-reviews__more';
    кнопка.textContent = 'Показать отзывы';

    var место = document.createElement('div');
    место.className = 'berd-reviews__frame';

    /* Виджет грузится по нажатию, а не сразу: это чужой iframe на 560
       пикселей, и в карточке он потянул бы за собой загрузку, которой
       читатель не просил. */
    кнопка.addEventListener('click', function () {
      if (место.firstChild) {
        var открыт = место.style.display !== 'none';
        место.style.display = открыт ? 'none' : 'block';
        кнопка.textContent = открыт ? 'Показать отзывы' : 'Скрыть отзывы';
        return;
      }
      var рама = document.createElement('iframe');
      рама.src = 'https://yandex.ru/maps-reviews-widget/' + ид + '?comments';
      рама.loading = 'lazy';
      рама.setAttribute('frameborder', '0');
      место.appendChild(рама);
      кнопка.textContent = 'Скрыть отзывы';
    });

    рамка.appendChild(кнопка);
    рамка.appendChild(место);
    return рамка;
  }

  function собрать(объект) {
    var корень = document.createElement('div');
    корень.className = 'berd-reviews';

    var шапка = document.createElement('div');
    шапка.className = 'berd-reviews__title';
    шапка.textContent = 'Что о месте говорят на картах';
    корень.appendChild(шапка);

    объект.площадки.forEach(function (п) {
      var строка = document.createElement('a');
      строка.className = 'berd-reviews__row';
      строка.href = п.ссылка;
      строка.target = '_blank';
      строка.rel = 'noopener';

      var слева = document.createElement('span');
      слева.className = 'berd-reviews__place';
      слева.textContent = п.имя;

      var оценка = document.createElement('span');
      оценка.className = 'berd-reviews__rating';
      оценка.innerHTML = '<b>' + String(п.оценка).replace('.', ',') + '</b> '
        + '<span class="berd-reviews__stars">' + звёзды(п.оценка) + '</span>';

      var сколько = document.createElement('span');
      сколько.className = 'berd-reviews__count';
      if (п.отзывов) {
        сколько.textContent = п.отзывов + ' ' + склонение(п.отзывов, ['отзыв', 'отзыва', 'отзывов']);
      } else if (п.оценок) {
        сколько.textContent = п.оценок + ' ' + склонение(п.оценок, ['оценка', 'оценки', 'оценок']);
      } else {
        сколько.textContent = 'оценка без отзывов';
      }
      if (п.пометка) сколько.title = п.пометка;

      var читать = document.createElement('span');
      читать.className = 'berd-reviews__link';
      читать.textContent = 'читать →';

      строка.appendChild(слева);
      строка.appendChild(оценка);
      строка.appendChild(сколько);
      строка.appendChild(читать);
      корень.appendChild(строка);
    });

    /* Тексты отзывов Яндекс отдаёт своим виджетом — значит по этой площадке
       ничего снимать руками не нужно, оценка в виджете всегда сегодняшняя. */
    var ид = null;
    объект.площадки.forEach(function (п) {
      if (!ид && /яндекс|yandex/i.test(п.имя)) ид = ид_яндекса(п.ссылка);
    });
    if (ид) корень.appendChild(виджет_яндекса(ид));

    var низ = document.createElement('div');
    низ.className = 'berd-reviews__note';
    var снято = (объект.площадки[0] && объект.площадки[0].проверено)
      ? объект.площадки[0].проверено.split('-').reverse().join('.') : '';
    низ.textContent = (снято ? 'Оценки 2ГИС и Google сняты ' + снято + '. ' : '')
      + (ид ? 'Отзывы Яндекс Карт показываются виджетом самой площадки и обновляются там же.'
            : 'Отзывы открываются на самой площадке.');
    корень.appendChild(низ);

    return корень;
  }

  function стили() {
    if (document.getElementById('berd-reviews-css')) return;
    var s = document.createElement('style');
    s.id = 'berd-reviews-css';
    s.textContent = [
      '.berd-reviews{margin:28px 0;padding:18px 20px;border:1px solid #e3e6e8;border-radius:14px;',
      'font-family:inherit;background:#fff;max-width:620px}',
      '.berd-reviews__title{font-size:15px;font-weight:600;margin-bottom:12px;color:#1b1f23}',
      '.berd-reviews__row{display:flex;align-items:center;gap:12px;padding:10px 0;',
      'border-top:1px solid #f0f2f4;text-decoration:none;color:inherit}',
      '.berd-reviews__row:first-of-type{border-top:0}',
      '.berd-reviews__place{flex:1 1 auto;font-size:14px;color:#1b1f23}',
      '.berd-reviews__rating{font-size:14px;white-space:nowrap;color:#1b1f23}',
      '.berd-reviews__stars{color:#f5a623;letter-spacing:1px}',
      '.berd-reviews__count{font-size:13px;color:#6b7378;white-space:nowrap;min-width:92px;text-align:right}',
      '.berd-reviews__link{font-size:13px;color:#2a7de1;white-space:nowrap}',
      '.berd-reviews__row:hover .berd-reviews__link{text-decoration:underline}',
      '.berd-reviews__note{margin-top:12px;font-size:12px;color:#8a9298;line-height:1.45}',
      '.berd-reviews__widget{margin-top:14px}',
      '.berd-reviews__more{appearance:none;border:1px solid #d7dbde;background:#f7f8f9;color:#1b1f23;',
      'font:inherit;font-size:13px;padding:8px 14px;border-radius:9px;cursor:pointer}',
      '.berd-reviews__more:hover{background:#eef0f2}',
      '.berd-reviews__frame{margin-top:12px}',
      '.berd-reviews__frame iframe{width:100%;max-width:560px;height:560px;border:1px solid #e3e6e8;',
      'border-radius:12px;background:#fff;display:block}',
      '@media (max-width:520px){',
      '.berd-reviews__row{flex-wrap:wrap;gap:6px 10px}',
      '.berd-reviews__place{flex:1 1 100%;font-weight:600}',
      '.berd-reviews__count{min-width:0;text-align:left}}'
    ].join('');
    document.head.appendChild(s);
  }

  function поставить(данные) {
    var объекты = данные.объекты || [];

    function обойти() {
      document.querySelectorAll('.js-product-sku, .js-catalog-prod-sku').forEach(function (поле) {
        // Только внутри открытой карточки. В плитках каталога блок не рисуем:
        // там он превращается в мусор на всей сетке из 29 плиток.
        var попап = поле.closest('.t-popup');
        if (!попап) return;

        var коробка = поле.closest('.t-store__prod-popup__text, .t-catalog__prod-popup__text,'
          + ' .js-store-prod-text, .t-store__prod-popup__info, .t-popup__container')
          || поле.parentElement;
        if (!коробка || коробка.querySelector('.berd-reviews')) return;

        var sku = (поле.textContent || '').trim().toUpperCase();
        if (!/^[PR]-\d+$/.test(sku)) return;

        var объект = объект_по_артикулу(объекты, sku);
        if (!объект) return;          // у объекта нет отзывов — молчим

        стили();
        коробка.appendChild(собрать(объект));
      });
    }

    обойти();
    // Карточки открываются всплывающим окном уже после загрузки страницы,
    // поэтому следим за изменениями — иначе блок появится только на той
    // карточке, что была открыта в момент загрузки.
    new MutationObserver(обойти).observe(document.body, { childList: true, subtree: true });
  }

  /* Нужно демо-странице, где несколько объектов сразу и узнавать по
     заголовку нечего: ставим блок по явному ключу. */
  window.__berdРисовать = function (объект, место) {
    стили();
    место.appendChild(собрать(объект));
  };

  /* Каталог берём из соседнего «data.js» — его переписывает админка
     оператора (admin.html), и значит новый объект появляется в карточках
     без нашего участия. Файл отдаётся тегом <script>, а не запросом:
     сайт заказчика и наш хостинг — разные домены, и запрос упёрся бы в
     CORS. Не отдался — работаем на встроенном списке, блок не пропадает. */
  function каталог(дальше) {
    var адрес = СВОЙ_АДРЕС ? СВОЙ_АДРЕС.replace(/[^\/]+$/, 'data.js') : '';
    if (!адрес) return дальше(ДАННЫЕ);

    var тег = document.createElement('script');
    тег.src = адрес + '?v=' + Math.floor(Date.now() / 300000);  // кэш на 5 минут
    тег.onload = function () {
      var свежие = window.__berdДанные;
      дальше(свежие && свежие.объекты && свежие.объекты.length ? свежие : ДАННЫЕ);
    };
    тег.onerror = function () { дальше(ДАННЫЕ); };
    (document.head || document.documentElement).appendChild(тег);
  }

  function старт() {
    if (document.querySelector('[data-berd-demo]')) return;  // на демо рисует страница
    каталог(поставить);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', старт);
  } else {
    старт();
  }
})();
