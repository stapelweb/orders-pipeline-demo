/* ============================================================
   СТАПЕЛЬ — сборка страниц из data.js.
   Тексты здесь не живут. Всё содержание — в assets/data.js.
   ============================================================ */

(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const SVG_NS = "http://www.w3.org/2000/svg";

  /* Одна проверка на весь файл: если человек просил меньше движения,
     всё анимированное показывается сразу в конечном состоянии. */
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Превью грузим только для лёгких файлов: тяжёлые не должны
     тормозить страницу ради картинки. */
  const PREVIEW_LIMIT_KB = 400;

  /* Экранирование: тексты приходят из data.js, но подставляем их безопасно. */
  function esc(s) {
    return String(s == null ? "" : s).replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  function byId(id) {
    return STAPEL.works.find((w) => w.id === id);
  }

  /* «344 КБ» → 344, «1,5 МБ» → 1500. Для высоты засечки на стапеле. */
  function sizeInKb(str) {
    if (!str) return 0;
    const n = parseFloat(str.replace(",", "."));
    if (isNaN(n)) return 0;
    return /МБ/i.test(str) ? n * 1024 : n;
  }

  function tagsHtml(work) {
    return (work.tags || [])
      .map((t) => {
        const m = STAPEL.tagMeta[t];
        if (!m) return "";
        return `<span class="tag ${m.cls}" title="${esc(m.title)}">${esc(m.label)}</span>`;
      })
      .join("");
  }

  /* ---------- Шапка и подвал ---------- */

  /* Версия для бирж: страница не должна давать прямых контактов, иначе
     переход заказчика в личку читается площадкой как увод сделки.

     РАСШИРЕНО 24.10.2026. Раньше условие было одно — data-page="work", и это
     ловушка: ЛЮБАЯ новая страница витрины молча получала подвал с почтой и
     телеграмом. Заметил при заведении страницы примера аудита: её собирались
     давать с биржи, а она притащила бы контакты. Теперь страницу помечают
     явно — data-boards="1", и это работает для любого имени. */
  const forBoards = () =>
    document.body.dataset.page === "work" || document.body.dataset.boards === "1";

  /* Сама work.html — единственная, где разделы лежат на той же странице.
     У остальных биржевых страниц якоря ведут на work.html, иначе ссылки в
     шапке мертвы, а уводить их на portfolio.html нельзя: там контакты. */
  const главнаяБиржевая = () => document.body.dataset.page === "work";
  const якорь = (a) => (главнаяБиржевая() ? a : "work.html" + a);

  function head() {
    const page = document.body.dataset.page || "";
    const links = forBoards()
      ? [
          { href: якорь("#works"), label: "Работы", key: "" },
          { href: якорь("#about"), label: "Кто делает", key: "" },
          { href: якорь("#rules"), label: "Как работаю", key: "" },
        ]
      : [
          { href: "portfolio.html", label: "Работы", key: "portfolio" },
          { href: "index.html#services", label: "Услуги", key: "" },
          { href: "index.html#about", label: "Обо мне", key: "" },
          { href: "index.html#process", label: "Порядок работы", key: "" },
          { href: "index.html#contact", label: "Контакты", key: "" },
        ];
    return `
      <a class="skip" href="#main">К содержанию</a>
      <header class="site-head">
        <div class="wrap site-head__inner">
          <a class="brand" href="${forBoards() ? (главнаяБиржевая() ? "#main" : "work.html") : "index.html"}">
            <svg class="brand__mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M3 7.5 L29 20.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"/>
              <path d="M9.5 10.75 V16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>
              <path d="M16 14 V19.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>
              <path d="M22.5 17.25 V22.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>
              <path d="M2 26.5 H30" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.55"/>
            </svg>
            <span>
              <span class="brand__name">${esc(STAPEL.brand.name)}</span>
              <span class="brand__tag">${esc(STAPEL.brand.slogan)}</span>
            </span>
          </a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="sitenav">Меню</button>
          <nav class="site-nav" id="sitenav" aria-label="Основная навигация">
            ${links
              .map(
                (l) =>
                  `<a href="${l.href}"${l.key && l.key === page ? ' aria-current="page"' : ""}>${esc(
                    l.label
                  )}</a>`
              )
              .join("")}
          </nav>
        </div>
      </header>`;
  }

  function foot() {
    const c = STAPEL.contacts;
    const a = STAPEL.author;
    /* ИНН нужен заказчикам из B2B, чтобы завести договор.
       Пока не вписан — строку не показываем, а не пишем заглушку. */
    const inn = c.inn && c.inn !== "ВСТАВЬ_ИНН" ? ` · ИНН ${esc(c.inn)}` : "";

    /* На бирже связь идёт только через площадку: ни почты, ни мессенджера */
    const nav = forBoards()
      ? `<p class="site-foot__note">Пишите в чат площадки, где вы читаете отклик —
         так у нас обоих остаётся гарант и возможность оставить отзыв.</p>`
      : `<nav aria-label="Дополнительная навигация">
           <a href="portfolio.html">Работы</a>
           <a href="mailto:${esc(c.email)}">${esc(c.email)}</a>
           <a href="https://t.me/${esc(c.telegram)}">@${esc(c.telegram)}</a>
         </nav>`;

    return `
      <footer class="site-foot">
        <div class="wrap site-foot__inner">
          <p>
            ${esc(STAPEL.brand.name)} — ${esc(a.name)}<br>
            <span class="num">${esc(c.city)} · ${esc(c.status)}${inn}</span>
          </p>
          ${nav}
        </div>
      </footer>`;
  }

  function mountNavToggle() {
    const btn = $(".nav-toggle");
    const nav = $(".site-nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", () => {
      const open = nav.dataset.open === "true";
      nav.dataset.open = String(!open);
      btn.setAttribute("aria-expanded", String(!open));
      btn.textContent = open ? "Меню" : "Закрыть";
    });
  }

  /* ---------- Сигнатура: стапель со спусковыми засечками ----------
     Каждая засечка — работа. Высота штриха — вес файла по логарифму:
     размер здесь не украшение, а данные, которые всё равно надо показать. */

  function buildSlipway() {
    const track = $("#slipway-track");
    const list = $("#slipway-list");
    if (!track) return;

    const items = STAPEL.works.filter((w) => w.slip);
    const W = 1000;
    const H = 190;
    const x0 = 34;
    const x1 = 966;
    const yTop = 34;   /* верх дорожки слева */
    const yBot = 138;  /* низ дорожки справа */
    const water = 168;

    const kbs = items.map((w) => sizeInKb(w.size)).filter((n) => n > 0);
    const lo = Math.log(Math.min.apply(null, kbs));
    const hi = Math.log(Math.max.apply(null, kbs));

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "slipway__svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("role", "list");
    svg.setAttribute("aria-label", `Работы на стапеле: ${items.length}`);

    const line = (x1_, y1_, x2_, y2_, cls) => {
      const el = document.createElementNS(SVG_NS, "line");
      el.setAttribute("x1", x1_);
      el.setAttribute("y1", y1_);
      el.setAttribute("x2", x2_);
      el.setAttribute("y2", y2_);
      el.setAttribute("class", cls);
      return el;
    };

    /* Кильблоки — подпорки под дорожкой */
    [0.18, 0.45, 0.72].forEach((t) => {
      const bx = x0 + (x1 - x0) * t;
      const by = yTop + (yBot - yTop) * t;
      svg.appendChild(line(bx, by, bx, water, "slipway__block"));
    });

    svg.appendChild(line(x0, yTop, x1, yBot, "slipway__rail"));
    svg.appendChild(line(0, water, W, water, "slipway__water"));

    const readout = $("#slipway-readout");
    const say = (txt, active) => {
      if (!readout) return;
      readout.textContent = txt;
      readout.dataset.active = active ? "true" : "false";
    };
    const idle = `${items.length} работ · наведите на засечку`;
    say(idle, false);

    items.forEach((w, i) => {
      const t = items.length === 1 ? 0.5 : i / (items.length - 1);
      const x = x0 + (x1 - x0) * t;
      const yRail = yTop + (yBot - yTop) * t;

      const kb = sizeInKb(w.size);
      const norm = hi > lo && kb > 0 ? (Math.log(kb) - lo) / (hi - lo) : 0.4;
      const stem = 16 + norm * 40;
      const yCap = yRail - stem;

      const a = document.createElementNS(SVG_NS, "a");
      a.setAttribute("class", "notch");
      a.setAttribute("href", w.href);
      a.setAttribute("role", "listitem");
      if (w.external) a.setAttribute("target", "_blank");

      const label = `${w.title}${w.size ? ", " + w.size : ""}`;
      const title = document.createElementNS(SVG_NS, "title");
      title.textContent = label;
      a.appendChild(title);

      const hit = document.createElementNS(SVG_NS, "rect");
      hit.setAttribute("class", "notch__hit");
      hit.setAttribute("x", x - 22);
      hit.setAttribute("y", yCap - 16);
      hit.setAttribute("width", 44);
      hit.setAttribute("height", yRail - yCap + 32);
      a.appendChild(hit);

      a.appendChild(line(x, yRail, x, yCap, "notch__stem"));

      const cap = document.createElementNS(SVG_NS, "circle");
      cap.setAttribute("class", "notch__cap");
      cap.setAttribute("cx", x);
      cap.setAttribute("cy", yCap);
      cap.setAttribute("r", 4.5);
      a.appendChild(cap);

      const show = () => say(label, true);
      const hide = () => say(idle, false);
      a.addEventListener("mouseenter", show);
      a.addEventListener("mouseleave", hide);
      a.addEventListener("focus", show);
      a.addEventListener("blur", hide);

      svg.appendChild(a);
    });

    track.appendChild(svg);

    /* Тот же набор списком: мобильная версия и запасной путь */
    if (list) {
      list.innerHTML = items
        .map(
          (w, i) =>
            `<li><a href="${esc(w.href)}"${w.external ? ' target="_blank"' : ""}>
               <span class="num">${String(i + 1).padStart(2, "0")}</span>
               <span>${esc(w.title)}</span>
               <span class="num muted" style="margin-left:auto">${esc(w.size || "")}</span>
             </a></li>`
        )
        .join("");
    }
  }

  /* ---------- Секции главной ---------- */

  function renderServices() {
    const box = $("#services-grid");
    if (!box) return;
    box.innerHTML = STAPEL.services
      .map(
        (s) => `
        <article class="svc">
          <h3 class="svc__title">${esc(s.title)}</h3>
          <p class="svc__body">${esc(s.body)}</p>
          <p class="svc__price">${esc(s.price)}</p>
        </article>`
      )
      .join("");
  }

  /* ---------- Живое превью работы ----------
     В карточку встраивается сама работа, а не её скриншот: файлы лежат
     рядом, значит превью не устареет и не разойдётся с тем, что откроется
     по ссылке. Грузится лениво и только когда карточка появилась на экране. */

  function shotHtml(w) {
    /* Снимок экрана вместо рамки. Нужен там, где живое превью показать
       нечем: чужой сайт не даёт открыть себя в iframe, а свой файл
       слишком тяжёл, чтобы грузить его ради картинки. Раньше на этом
       месте стояла строка текста с объяснением — посетителю была видна
       дыра, а не причина (находка 01.10.2026). Снимок снят с живого
       адреса работы, дата съёмки стоит в data.js рядом с полем. */
    if (w.shot) {
      return `
        <div class="work__shot work__shot--still">
          <img src="${esc(w.shot)}" alt="Снимок экрана работы: ${esc(w.title)}"
               loading="lazy" width="960" height="645">
        </div>`;
    }
    if (!w.href) return "";
    /* Остаётся запасным путём: если снимка ещё нет, честная строка
       лучше пустого прямоугольника с иконкой ошибки. */
    if (w.noshot) {
      return `
        <div class="work__shot work__shot--heavy">
          <p>${esc(w.noshot)}</p>
        </div>`;
    }
    /* Размер знаем только у своих файлов; внешний сайт грузим как есть */
    if (!w.external && sizeInKb(w.size) > PREVIEW_LIMIT_KB) {
      return `
        <div class="work__shot work__shot--heavy">
          <p>Превью не грузим: файл ${esc(w.size)}.<br>Работа откроется по ссылке.</p>
        </div>`;
    }
    return `
      <div class="work__shot" data-shot="${esc(w.href)}" data-title="${esc(w.title)}">
        <span class="work__shot-hint">${w.external ? "Внешний сайт" : "Живое превью"}</span>
      </div>`;
  }

  function mountPreviews() {
    const shots = $$(".work__shot[data-shot]");
    if (!shots.length) return;

    /* Масштаб подгоняем под ширину карточки, иначе на телефоне
       в превью попадает только левая треть экрана приложения. */
    const FRAME_W = 1280;
    const fit = (box) => {
      const k = box.clientWidth / FRAME_W;
      box.style.setProperty("--shot-scale", k.toFixed(4));
    };

    const load = (box) => {
      if (box.dataset.loaded) return;
      box.dataset.loaded = "1";
      fit(box);
      const frame = document.createElement("iframe");
      frame.src = box.dataset.shot;
      frame.title = "Превью работы: " + box.dataset.title;
      frame.loading = "lazy";
      /* Превью показывает, а не работает: клики и фокус идут мимо него */
      frame.setAttribute("tabindex", "-1");
      frame.setAttribute("aria-hidden", "true");
      frame.setAttribute("scrolling", "no");
      frame.addEventListener("load", () => box.classList.add("is-ready"));
      box.appendChild(frame);
    };

    let fitTimer;
    window.addEventListener("resize", () => {
      clearTimeout(fitTimer);
      fitTimer = setTimeout(() => shots.forEach(fit), 150);
    });

    if (!("IntersectionObserver" in window)) {
      shots.forEach(load);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            load(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "300px" }
    );
    shots.forEach((s) => io.observe(s));
  }

  function workCard(w) {
    /* На бирже заголовок ведёт сразу на работу: страницы разбора содержат
       подвал с контактами, а туда заказчику с площадки ходить незачем. */
    const link = forBoards() ? w.href : w.case || w.href;
    const target = w.external && (forBoards() || !w.case) ? ' target="_blank" rel="noopener"' : "";
    const heading = link
      ? `<a href="${esc(link)}"${target}>${esc(w.title)}</a>`
      : esc(w.title);

    /* Заголовок ведёт на разбор, если он есть. Ссылка в подвале — всегда на саму работу. */
    const foot = [
      tagsHtml(w),
      w.size ? `<span>${esc(w.size)}</span>` : "",
      w.href
        ? `<a href="${esc(w.href)}"${w.external ? ' target="_blank" rel="noopener"' : ""} style="margin-left:auto">Открыть работу</a>`
        : "",
    ]
      .filter(Boolean)
      .join("");

    return `
      <article class="work" data-cat="${esc(w.cat)}">
        ${shotHtml(w)}
        <h3 class="work__title">${heading}</h3>
        <p class="work__body">${esc(w.body)}</p>
        ${w.note ? `<p class="notice notice--warn" style="margin:0;font-size:12.5px">${esc(w.note)}</p>` : ""}
        <div class="work__foot">${foot}</div>
      </article>`;
  }

  function renderFeatured() {
    const box = $("#featured-works");
    if (!box) return;
    box.innerHTML = STAPEL.featured
      .map(byId)
      .filter(Boolean)
      .map(workCard)
      .join("");
  }

  /* ---------- Кто делает ----------
     Закрывает первое возражение: «кто ты вообще». Сайт написан
     от первого лица, значит у этого лица должно быть имя. */

  function renderAuthor() {
    const box = $("#author");
    if (!box) return;
    const a = STAPEL.author;
    const c = STAPEL.contacts;
    box.innerHTML = `
      <figure class="who">
        <div class="who__photo${a.photo ? "" : " who__photo--empty"}">
          ${
            a.photo
              ? `<img src="${esc(a.photo)}" alt="${esc(a.name)}"
                   onerror="this.style.display='none'">`
              : ""
          }
          <span aria-hidden="true">${esc(a.initials)}</span>
        </div>
        <figcaption>
          <p class="who__name">${esc(a.name)}</p>
          <p class="who__role">${esc(a.role)}</p>
          <p class="who__meta num">${esc(c.city)} · ${esc(c.status)}</p>
        </figcaption>
      </figure>
      <div class="who__text">
        <p>${esc(a.bio)}</p>
        <p class="who__strength">${esc(a.strength)}</p>
      </div>`;
  }

  /* ---------- Как проходит работа ---------- */

  function renderProcess() {
    const box = $("#process-steps");
    if (!box) return;
    box.innerHTML = STAPEL.process
      .map(
        (p, i) => `
        <li class="pstep">
          <span class="pstep__n num">${String(i + 1).padStart(2, "0")}</span>
          <div>
            <p class="pstep__title">${esc(p.step)} <span class="pstep__time num">${esc(p.time)}</span></p>
            <p class="pstep__body">${esc(p.body)}</p>
          </div>
        </li>`
      )
      .join("");
  }

  function renderRules() {
    const box = $("#rules-grid");
    if (!box) return;
    const l = STAPEL.limits;
    box.innerHTML =
      STAPEL.rules
        .map(
          (r) => `
        <div class="rule">
          <h3 class="rule__title">${esc(r.title)}</h3>
          <p class="rule__body">${esc(r.body)}</p>
        </div>`
        )
        .join("") +
      `<div class="rule rule--limits">
         <h3 class="rule__title">${esc(l.title)}</h3>
         <p class="rule__body">${esc(l.body)}</p>
         <ul>${l.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
       </div>`;
  }

  /* ---------- Портфолио с фильтрами ---------- */

  /* Инструменты без разбора — второй эшелон: их двенадцать, и они
     однотипные. Наверху должны стоять работы, которые продают. */
  const isSecondary = (w) => w.cat === "app" && !w.case;

  function renderPortfolio() {
    const box = $("#all-works");
    const bar = $("#filters");
    const count = $("#filter-count");
    if (!box) return;

    const main = STAPEL.works.filter((w) => !isSecondary(w));
    const rest = STAPEL.works.filter(isSecondary);

    box.innerHTML = main.map(workCard).join("");

    const restBox = $("#more-works");
    const restBtn = $("#more-toggle");
    if (restBox && rest.length) {
      restBox.innerHTML = rest.map(workCard).join("");
      restBtn.textContent = `Показать ещё ${rest.length} интерактивных инструментов`;
      restBtn.hidden = false;
      restBtn.addEventListener("click", () => {
        const open = restBox.hidden === false;
        restBox.hidden = open;
        restBtn.setAttribute("aria-expanded", String(!open));
        restBtn.textContent = open
          ? `Показать ещё ${rest.length} интерактивных инструментов`
          : "Свернуть инструменты";
        if (!open) mountPreviews();
      });
    }

    if (!bar) return;
    bar.innerHTML = STAPEL.categories
      .map((c) => {
        const n =
          c.id === "all"
            ? STAPEL.works.length
            : STAPEL.works.filter((w) => w.cat === c.id).length;
        if (!n) return "";
        return `<button class="filter" type="button" data-cat="${c.id}" aria-pressed="${
          c.id === "all"
        }">${esc(c.label)}<span class="filter__n">${n}</span></button>`;
      })
      .join("");

    const restBoxEl = $("#more-works");
    const restBtnEl = $("#more-toggle");

    const apply = (cat) => {
      let shown = 0;
      const filter = (root) =>
        $$(".work", root).forEach((el) => {
          const on = cat === "all" || el.dataset.cat === cat;
          el.hidden = !on;
          if (on) shown++;
        });

      filter(box);
      if (restBoxEl) filter(restBoxEl);

      /* Выбрали категорию — прячем кнопку «показать ещё» и раскрываем
         второй эшелон: иначе часть отфильтрованного осталась бы за катом. */
      if (restBoxEl && restBtnEl) {
        const all = cat === "all";
        restBtnEl.hidden = !all;
        restBoxEl.hidden = all;
        if (all) {
          restBtnEl.setAttribute("aria-expanded", "false");
          restBtnEl.textContent = `Показать ещё ${
            STAPEL.works.filter(isSecondary).length
          } интерактивных инструментов`;
        } else {
          mountPreviews();
        }
      }

      if (count) {
        count.textContent =
          cat === "all"
            ? `Всего работ: ${STAPEL.works.length}. Ниже — кейсы с разбором`
            : `Показано работ: ${shown} из ${STAPEL.works.length}`;
      }
    };

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter");
      if (!btn) return;
      $$(".filter", bar).forEach((b) =>
        b.setAttribute("aria-pressed", String(b === btn))
      );
      apply(btn.dataset.cat);
    });

    apply("all");
  }

  /* ---------- Контакты и форма ---------- */

  function renderContacts() {
    const box = $("#contacts-list");
    if (!box) return;
    const c = STAPEL.contacts;
    box.innerHTML = `
      <li><span class="eyebrow">Почта</span><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>
      <li><span class="eyebrow">Telegram</span><a href="https://t.me/${esc(c.telegram)}">@${esc(c.telegram)}</a></li>
      <li><span class="eyebrow">Город</span><span>${esc(c.city)}, удалённо</span></li>
      <li><span class="eyebrow">На связи</span><span>${esc(c.hours)}</span></li>`;
  }

  /* ---------- Форма заявки ----------
     Работает без сервера и без стороннего сервиса: два живых пути —
     Telegram и почта. Formspree подключается опционально; пока его нет,
     форма всё равно отправляет, а не показывает «сервис не настроен». */

  function mountForm() {
    const form = $("#lead-form");
    if (!form) return;

    const id = STAPEL.formspreeId;
    const connected = id && id !== "ВСТАВЬ_ID";
    const slot = $("#form-notice");
    const actions = $("#form-actions");
    const c = STAPEL.contacts;

    const letter = () => {
      const d = new FormData(form);
      return [
        "Заявка с сайта СТАПЕЛЬ",
        "",
        "Имя: " + (d.get("name") || ""),
        "Связь: " + (d.get("contact") || ""),
        "",
        "Задача:",
        d.get("task") || "",
      ].join("\n");
    };

    const say = (html, kind) => {
      if (!slot) return;
      slot.className = "notice notice--" + (kind || "info");
      slot.innerHTML = html;
      slot.hidden = false;
    };

    /* Нативная проверка полей: без неё уйдёт пустая заявка */
    const ready = () => {
      if (form.checkValidity()) return true;
      form.reportValidity();
      return false;
    };

    if (connected) {
      form.action = "https://formspree.io/f/" + id;
      form.method = "post";
      actions.innerHTML =
        '<button class="btn btn--primary" type="submit">Отправить заявку</button>';
      form.addEventListener("submit", (e) => {
        if (!form.checkValidity()) e.preventDefault();
      });
      return;
    }

    /* Без Formspree: две кнопки, обе доводят заявку до адресата */
    actions.innerHTML =
      '<button class="btn btn--primary" type="button" data-send="tg">Отправить в Telegram</button>' +
      '<button class="btn btn--ghost" type="button" data-send="mail">Отправить почтой</button>';

    actions.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-send]");
      if (!btn || !ready()) return;
      const text = letter();

      if (btn.dataset.send === "mail") {
        window.location.href =
          "mailto:" +
          c.email +
          "?subject=" +
          encodeURIComponent("Заявка с сайта СТАПЕЛЬ") +
          "&body=" +
          encodeURIComponent(text);
        say(
          "Заявка собрана в письмо и открыта в вашей почте — осталось нажать «Отправить». Если почтовая программа не открылась, адрес есть в подвале страницы.",
          "info"
        );
        return;
      }

      /* Telegram не умеет подставлять текст в личный чат,
         поэтому кладём заявку в буфер и открываем диалог. */
      let copied = false;
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch (err) {
        copied = false;
      }

      window.open("https://t.me/" + c.telegram, "_blank", "noopener");

      if (copied) {
        say(
          "Заявка скопирована, чат открыт — вставьте её в сообщение и отправьте.",
          "info"
        );
      } else {
        say(
          "Чат открыт. Скопируйте текст заявки и вставьте в сообщение:" +
            '<textarea class="notice__copy" readonly rows="7"></textarea>',
          "info"
        );
        const ta = $(".notice__copy", slot);
        if (ta) {
          ta.value = text;
          ta.focus();
          ta.select();
        }
      }
    });
  }

  /* ---------- Корпус на стапеле ----------
     3D поверх плоской дорожки. Если canvas или рендерер недоступны,
     дорожка с засечками остаётся на месте и работает как прежде. */

  function mountHull() {
    const box = $("#hull");
    if (!box || !window.Hull3D) return;

    const canvas = document.createElement("canvas");
    canvas.className = "hull__canvas";
    canvas.setAttribute("aria-hidden", "true");
    box.appendChild(canvas);

    const cs = getComputedStyle(document.documentElement);
    const hull = window.Hull3D(canvas, {
      color: cs.getPropertyValue("--chalk-dim").trim() || "#93a8b4",
      accent: cs.getPropertyValue("--minium").trim() || "#e2552b",
    });

    if (calm) {
      hull.still();
      window.addEventListener("resize", () => hull.still());
      return;
    }

    hull.resize();
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => hull.resize(), 150);
    });

    /* Корпус реагирует на мышь только на устройствах с курсором */
    if (window.matchMedia("(hover: hover)").matches) {
      box.addEventListener("mousemove", (e) => {
        const r = box.getBoundingClientRect();
        hull.setPointer(((e.clientX - r.left) / r.width - 0.5) * 2);
      });
      box.addEventListener("mouseleave", () => hull.setPointer(0));
    }

    /* Спуск начинается, как только блок подходит к экрану, и замирает,
       когда уходит: за кадром крутить анимацию незачем. Порог низкий —
       на невысоком окне стапель попадает во вьюпорт лишь краем. */
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => (e.isIntersecting ? hull.start() : hull.stop()));
        },
        { threshold: 0.01, rootMargin: "200px 0px" }
      );
      io.observe(box);
    } else {
      hull.start();
    }
  }

  /* ---------- Каскад засечек ----------
     Спуск по очереди слева направо: порядок здесь значит порядок,
     в котором работы вставали на стапель. */

  function runNotchCascade() {
    const notches = $$(".notch");
    if (!notches.length) return;
    if (calm) {
      notches.forEach((n) => n.classList.add("is-in"));
      return;
    }
    notches.forEach((n, i) => {
      n.style.setProperty("--delay", 900 + i * 70 + "ms");
      n.classList.add("is-in");
    });
  }

  /* ---------- Появление блоков при прокрутке ---------- */

  function mountReveal() {
    const items = $$("[data-reveal]");
    if (!items.length) return;
    if (calm || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -80px 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------- Отсчёт цифр ----------
     Считаем только целые: «14 КБ» и «375 px» дописываются как есть,
     чтобы единицы не прыгали вместе с числом. */

  function mountCounters() {
    const cells = $$(".figure__v");
    if (!cells.length) return;

    const run = (el) => {
      const raw = el.textContent.trim();
      const m = raw.match(/^(\d[\d\s]*)(.*)$/);
      if (!m) return;
      const target = parseInt(m[1].replace(/\s/g, ""), 10);
      const tail = m[2];
      if (!target || target < 10) return;
      if (calm) return;

      const dur = 1100;
      let t0 = 0;
      const step = (now) => {
        if (!t0) t0 = now;
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        /* Без разделителей разрядов: итог написан так же, и формат не прыгает */
        el.textContent = Math.round(target * eased) + tail;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = raw;
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          run(e.target);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.6 }
    );
    cells.forEach((c) => io.observe(c));
  }

  /* ---------- Параллакс дока ----------
     Слои уходят с разной скоростью: глубина без 3D-сцены.
     Обновление привязано к кадру, а не к каждому событию прокрутки. */

  function mountParallax() {
    const layers = $$("[data-depth]");
    if (!layers.length || calm) return;

    let ticking = false;
    const apply = () => {
      const y = window.scrollY;
      layers.forEach((el) => {
        const d = parseFloat(el.dataset.depth) || 0;
        el.style.transform = "translate3d(0," + (-y * d).toFixed(1) + "px,0)";
      });
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(apply);
      },
      { passive: true }
    );
    apply();
  }

  /* ---------- Запуск ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    const h = $("#site-head-slot");
    const f = $("#site-foot-slot");
    if (h) h.outerHTML = head();
    if (f) f.outerHTML = foot();

    mountNavToggle();
    buildSlipway();
    renderServices();
    renderFeatured();
    renderAuthor();
    renderProcess();
    renderRules();
    renderPortfolio();
    renderContacts();
    mountForm();

    /* Движение — последним: сначала страница должна быть собрана и читаема */
    mountHull();
    runNotchCascade();
    mountPreviews();
    mountReveal();
    mountCounters();
    mountParallax();
  });
})();
