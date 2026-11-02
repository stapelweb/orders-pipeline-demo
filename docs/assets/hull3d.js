/* ============================================================
   Корпус судна на стапеле — каркасный 3D-рендерер.

   Без библиотек: своя матрица поворота, своя перспектива, canvas 2D.
   Модель — теоретический чертёж корпуса: одиннадцать шпангоутов
   поперёк и продольные линии киля, скулы и палубы. Так корпус
   и размечают на стапеле, поэтому каркас здесь не стилизация.

   Весь файл ~4 КБ. Если он не загрузится, в шапке останется
   плоская дорожка — она нарисована отдельно и ни от чего не зависит.
   ============================================================ */

(function (global) {
  "use strict";

  /* ---------- Геометрия корпуса ----------
     t — доля длины от кормы (0) к носу (1)
     u — от левого борта (−1) через киль (0) к правому (+1) */

  const FRAMES = 11;  /* шпангоутов */
  const ARC = 13;     /* точек в обводе шпангоута */
  const LEN = 3.4;    /* длина корпуса в условных единицах */
  const BEAM = 0.62;  /* полуширина на миделе */
  const DEPTH = 0.46; /* высота борта */

  /* Полуширина: к носу сходит на нет, корма полная */
  function halfBeam(t) {
    return BEAM * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.62)), 0.75);
  }

  /* Глубина: нос приподнят, отсюда развал носовой части */
  function depthAt(t) {
    return DEPTH * (1 - 0.35 * Math.pow(t, 3));
  }

  /* Полнота обвода: у кормы U-образный, у носа острый V */
  function fullness(t) {
    return 1.35 + 1.9 * Math.pow(t, 1.6);
  }

  /* Точка обвода шпангоута */
  function framePoint(t, u) {
    const w = halfBeam(t);
    const d = depthAt(t);
    const n = fullness(t);
    return {
      x: w * u,
      y: -d * (1 - Math.pow(Math.abs(u), n)),
      z: (t - 0.5) * LEN,
    };
  }

  /* Собираем рёбра один раз: перерисовка только пересчитывает проекцию */
  function buildEdges() {
    const edges = [];
    const rings = [];

    for (let i = 0; i < FRAMES; i++) {
      const t = i / (FRAMES - 1);
      const ring = [];
      for (let j = 0; j < ARC; j++) {
        const u = -1 + (2 * j) / (ARC - 1);
        ring.push(framePoint(t, u));
      }
      rings.push(ring);
      /* Шпангоут: поперечное сечение */
      for (let j = 0; j < ARC - 1; j++) {
        edges.push({ a: ring[j], b: ring[j + 1], w: 1, dim: 0.55 });
      }
    }

    /* Продольные: киль, скулы, палубная линия */
    const longitudinals = [0, 3, 6, 9, 12];
    longitudinals.forEach((j) => {
      const keel = j === 6;
      const sheer = j === 0 || j === ARC - 1;
      for (let i = 0; i < FRAMES - 1; i++) {
        edges.push({
          a: rings[i][j],
          b: rings[i + 1][j],
          w: keel || sheer ? 1.5 : 1,
          dim: keel || sheer ? 1 : 0.4,
        });
      }
    });

    /* Палубная линия замыкает борта на носу и корме */
    [0, FRAMES - 1].forEach((i) => {
      edges.push({ a: rings[i][0], b: rings[i][ARC - 1], w: 1.2, dim: 0.8 });
    });

    return edges;
  }

  /* ---------- Проекция ---------- */

  function project(p, rotY, rotX, scale, cx, cy, dist) {
    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

    const x1 = p.x * cosY + p.z * sinY;
    const z1 = -p.x * sinY + p.z * cosY;
    const y1 = p.y * cosX - z1 * sinX;
    const z2 = p.y * sinX + z1 * cosX;

    const f = dist / (dist + z2);
    return { x: cx + x1 * scale * f, y: cy + y1 * scale * f, f: f, z: z2 };
  }

  /* ---------- Публичный конструктор ---------- */

  function Hull(canvas, opts) {
    const o = opts || {};
    const ctx = canvas.getContext("2d");
    const edges = buildEdges();

    const state = {
      rotY: -0.62,
      rotX: 0.30,
      pointer: 0,     /* смещение от мыши, −1…1 */
      launch: 0,      /* прогресс спуска, 0…1 */
      launched: false, /* спуск уже отыгран: второй раз не повторяем */
      running: false,
      raf: 0,
      w: 0,
      h: 0,
      dpr: 1,
    };

    const color = o.color || "#93a8b4";
    const accent = o.accent || "#e2552b";

    function resize() {
      const r = canvas.getBoundingClientRect();
      state.dpr = Math.min(global.devicePixelRatio || 1, 2);
      state.w = r.width;
      state.h = r.height;
      canvas.width = Math.round(r.width * state.dpr);
      canvas.height = Math.round(r.height * state.dpr);
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    }

    function draw(time) {
      const w = state.w, h = state.h;
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);

      const e = state.launch;
      /* Спуск: корпус едет по дорожке слева-сверху и садится на воду.
         Конечная точка совпадает с ватерлинией, нарисованной в SVG. */
      const cx = w * (0.26 + 0.42 * e);
      /* Считаем от киля, а не от центра: судно должно сесть на ватерлинию,
         а не провалиться под неё. Ватерлиния в SVG стоит на 168 из 190. */
      const cy = h * (0.07 + 0.57 * e);
      const scale = Math.min(w, h * 2.4) * 0.22;
      /* Покачивание на воде начинается, только когда корпус спущен */
      const drift = time ? Math.sin(time / 4200) * 0.05 * e : 0;
      const rotY = state.rotY + drift + state.pointer * 0.28;
      /* На воде корпус выпрямляется: наклон уходит вместе со спуском */
      const rotX = state.rotX * (1 - 0.45 * e) + state.pointer * 0.05;

      /* Пока идёт спуск, корпус лежит под углом дорожки (около 8,5°) */
      const tilt = 0.148 * (1 - e);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tilt);
      ctx.translate(-cx, -cy);

      ctx.globalAlpha = Math.min(1, e * 2.2);

      edges.forEach((ed) => {
        const a = project(ed.a, rotY, rotX, scale, cx, cy, 6);
        const b = project(ed.b, rotY, rotX, scale, cx, cy, 6);
        /* Дальние рёбра бледнее — глубина без заливки */
        const depth = (a.f + b.f) / 2;
        ctx.globalAlpha = Math.min(1, e * 2.2) * ed.dim * (depth - 0.55) * 2.6;
        ctx.strokeStyle = ed.w > 1.2 ? accent : color;
        ctx.lineWidth = ed.w * (depth * 0.9);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });

      ctx.restore();
      ctx.globalAlpha = 1;
    }

    let start = 0;
    function loop(time) {
      if (!state.running) return;
      if (!state.launched) {
        if (!start) start = time;
        const t = Math.min(1, (time - start) / 2600);
        /* Разгон и мягкое торможение у воды */
        state.launch = 1 - Math.pow(1 - t, 3);
        if (t >= 1) state.launched = true;
      }
      draw(time);
      state.raf = global.requestAnimationFrame(loop);
    }

    return {
      resize: function () {
        resize();
        draw(state.launched ? performance.now() : 0);
      },
      /* Идемпотентно: если спуск уже прошёл, просто возобновляем кадры */
      start: function () {
        if (state.running) return;
        state.running = true;
        if (!state.launched) start = 0;
        state.raf = global.requestAnimationFrame(loop);
      },
      stop: function () {
        state.running = false;
        if (state.raf) global.cancelAnimationFrame(state.raf);
      },
      /* Мгновенный кадр без анимации: для reduced-motion */
      still: function () {
        resize();
        state.launch = 1;
        state.launched = true;
        draw(0);
      },
      setPointer: function (v) {
        state.pointer = Math.max(-1, Math.min(1, v));
      },
    };
  }

  global.Hull3D = Hull;
})(window);
