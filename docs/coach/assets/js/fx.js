/* =========================================================
   Объёмные эффекты сайта. Без внешних библиотек.

   1. WebGL-шейдер в шапке — живой цветовой туман в тонах бренда
   2. 3D-сцена фотографии: кольцо, компас, снимок и карточка
      разнесены по глубине и наклоняются за курсором
   3. Наклон карточек с бликом, следующим за курсором
   4. Появление блоков с поворотом в пространстве

   Всё выключается при prefers-reduced-motion и на слабых
   устройствах. Контент никогда не зависит от этих эффектов.
   ========================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia('(hover: none)').matches;
  if (reduced) return;

  /* ---------------------------------------------------------
     1. WEBGL: цветовой туман в шапке
     --------------------------------------------------------- */
  var VERT = [
    'attribute vec2 a_pos;',
    'void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }'
  ].join('\n');

  var FRAG = [
    'precision mediump float;',
    'uniform vec2 u_res;',
    'uniform float u_time;',
    'uniform vec2 u_mouse;',

    'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',

    'float noise(vec2 p){',
    '  vec2 i = floor(p), f = fract(p);',
    '  f = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),',
    '             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);',
    '}',

    'float fbm(vec2 p){',
    '  float v = 0.0, a = 0.5;',
    '  for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; }',
    '  return v;',
    '}',

    'void main(){',
    '  vec2 uv = gl_FragCoord.xy / u_res.xy;',
    '  vec2 p = uv * vec2(u_res.x / u_res.y, 1.0);',
    '  float t = u_time * 0.028;',
    '  vec2 m = (u_mouse - 0.5) * 0.35;',

    /* два слоя искажения — даёт ощущение глубины и течения */
    '  vec2 q = vec2(fbm(p * 1.5 + t + m), fbm(p * 1.5 + vec2(5.2, 1.3) - t));',
    '  float n = fbm(p * 2.1 + q * 1.6 + vec2(t * 0.6, -t * 0.4));',
    '  float n2 = fbm(p * 3.4 + vec2(-t, t * 0.8));',

    '  vec3 sage = vec3(0.435, 0.561, 0.416);',
    '  vec3 gold = vec3(0.788, 0.635, 0.294);',
    '  vec3 terr = vec3(0.753, 0.478, 0.337);',

    '  vec3 col = mix(sage, gold, smoothstep(0.32, 0.78, n));',
    '  col = mix(col, terr, smoothstep(0.55, 0.95, n2) * 0.4);',

    /* Маска: густо справа, прозрачно слева, где лежит текст.
       Внимание: в smoothstep edge0 обязан быть меньше edge1 —
       иначе поведение не определено и маска обнуляется. */
    '  float mask = smoothstep(0.04, 0.58, uv.x);',
    '  mask *= smoothstep(-0.10, 0.42, uv.y);',
    '  mask *= 1.0 - 0.45 * smoothstep(0.62, 1.05, uv.y);',

    '  float alpha = (0.14 + 0.55 * pow(n, 1.4)) * mask;',
    '  gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.42));',
    '}'
  ].join('\n');

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  }

  function initFog() {
    var host = document.querySelector('.hero') || document.querySelector('.page-hero');
    if (!host) return;

    var canvas = document.createElement('canvas');
    canvas.className = 'fx-fog';
    canvas.setAttribute('aria-hidden', 'true');
    host.insertBefore(canvas, host.firstChild);

    var gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false })
          || canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) { canvas.remove(); return; }

    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { canvas.remove(); return; }

    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); return; }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uRes = gl.getUniformLocation(prog, 'u_res');
    var uTime = gl.getUniformLocation(prog, 'u_time');
    var uMouse = gl.getUniformLocation(prog, 'u_mouse');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    var mouse = [0.5, 0.5], target = [0.5, 0.5];

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var w = Math.floor(host.clientWidth * dpr);
      var h = Math.floor(host.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }

    if (!coarse) {
      host.addEventListener('mousemove', function (e) {
        var r = host.getBoundingClientRect();
        target = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
      });
    }

    var start = performance.now(), raf = 0, running = true;

    function frame(now) {
      if (!running) return;
      resize();
      mouse[0] += (target[0] - mouse[0]) * 0.04;
      mouse[1] += (target[1] - mouse[1]) * 0.04;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse[0], mouse[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    /* не жжём батарею в фоне и когда шапка уехала за экран */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!running) { running = true; start = performance.now() - 1000; raf = requestAnimationFrame(frame); }
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !running && !document.hidden) {
            running = true; raf = requestAnimationFrame(frame);
          } else if (!e.isIntersecting && running) {
            running = false; cancelAnimationFrame(raf);
          }
        });
      }, { threshold: 0 }).observe(host);
    }
  }

  /* ---------------------------------------------------------
     2. 3D-сцена фотографии в шапке
     --------------------------------------------------------- */
  function initHeroScene() {
    var photo = document.querySelector('.hero-photo');
    if (!photo) return;

    photo.classList.add('fx-scene');

    /* компас — та самая метафора, только объёмная */
    var compass = document.createElement('div');
    compass.className = 'fx-compass';
    compass.setAttribute('aria-hidden', 'true');
    compass.innerHTML =
      '<svg viewBox="0 0 120 120" width="120" height="120">' +
        '<circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".55"/>' +
        '<circle cx="60" cy="60" r="44" fill="none" stroke="currentColor" stroke-width=".7" opacity=".35"/>' +
        '<g class="fx-ticks" stroke="currentColor" stroke-width="1" opacity=".45">' +
          '<line x1="60" y1="6" x2="60" y2="16"/><line x1="60" y1="104" x2="60" y2="114"/>' +
          '<line x1="6" y1="60" x2="16" y2="60"/><line x1="104" y1="60" x2="114" y2="60"/>' +
        '</g>' +
        '<g class="fx-needle">' +
          '<path d="M60 20 L69 60 L60 100 L51 60 Z" fill="currentColor" opacity=".9"/>' +
          '<path d="M60 100 L69 60 L51 60 Z" fill="#c07a56" opacity=".85"/>' +
        '</g>' +
        '<circle cx="60" cy="60" r="4" fill="currentColor"/>' +
      '</svg>';
    photo.appendChild(compass);

    if (coarse) return; /* на тач-устройствах наклон не нужен */

    var layers = [
      { el: photo.querySelector('.hero-photo-ring'), depth: -120, move: 26 },
      { el: photo.querySelector('.hero-photo-frame'), depth: 0, move: 0 },
      { el: compass, depth: 110, move: 46 },
      { el: photo.querySelector('.hero-float-card'), depth: 155, move: 38 }
    ].filter(function (l) { return l.el; });

    layers.forEach(function (l) { l.el.style.transform = 'translateZ(' + l.depth + 'px)'; });

    var rx = 0, ry = 0, trx = 0, try_ = 0;
    var lastMove = -9999, raf = null, visible = true;
    var scroll = 0, scrollSmooth = 0;

    window.addEventListener('scroll', function () {
      scroll = window.scrollY || 0;
    }, { passive: true });

    /* Сцена дышит сама по себе, пока курсор её не трогает:
       иначе на загрузке объём просто не виден. */
    function idle(now) {
      var t = now / 1000;
      trx = Math.sin(t * 0.42) * 4.5 + Math.sin(t * 0.17) * 1.5;
      try_ = Math.cos(t * 0.33) * 6.5 + Math.sin(t * 0.23) * 2;
    }

    function render(now) {
      if (!visible) { raf = null; return; }
      if (now - lastMove > 2200) idle(now);

      rx += (trx - rx) * 0.06;
      ry += (try_ - ry) * 0.06;
      scrollSmooth += (scroll - scrollSmooth) * 0.1;

      photo.style.transform = 'rotateX(' + rx.toFixed(3) + 'deg) rotateY(' + ry.toFixed(3) + 'deg)';

      layers.forEach(function (l) {
        var dx = (ry / 15) * l.move, dy = (-rx / 15) * l.move;
        /* при прокрутке слои разъезжаются: чем ближе к зрителю,
           тем быстрее уходит вверх — обычный параллакс, только по глубине */
        dy += scrollSmooth * (l.depth / 900);
        l.el.style.transform =
          'translate3d(' + dx.toFixed(2) + 'px,' + dy.toFixed(2) + 'px,' + l.depth + 'px)';
      });
      raf = requestAnimationFrame(render);
    }
    raf = requestAnimationFrame(render);

    window.addEventListener('mousemove', function (e) {
      var r = photo.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      trx = Math.max(-15, Math.min(15, -(e.clientY - cy) / 22));
      try_ = Math.max(-15, Math.min(15, (e.clientX - cx) / 22));
      lastMove = performance.now();
    }, { passive: true });

    /* не крутим сцену, когда её не видно */
    document.addEventListener('visibilitychange', function () {
      visible = !document.hidden;
      if (visible && !raf) raf = requestAnimationFrame(render);
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          visible = e.isIntersecting && !document.hidden;
          if (visible && !raf) raf = requestAnimationFrame(render);
        });
      }, { threshold: 0 }).observe(photo);
    }
  }

  /* ---------------------------------------------------------
     3. Наклон карточек и блик за курсором
     --------------------------------------------------------- */
  function initTilt() {
    if (coarse) return;

    var cards = document.querySelectorAll(
      '.metaphor-card, .price-card, .icon-card, .step, .summary-item, .post-card,' +
      ' .contact-item, .stage-item, .t-card, .gallery figure, .step-long, .longterm-opts li'
    );

    Array.prototype.forEach.call(cards, function (card) {
      card.classList.add('fx-tilt');
      if (card.tagName === 'FIGURE') card.classList.add('fx-tilt-photo');

      var raf = null, tx = 0, ty = 0, cx = 0, cy = 0, active = false;

      function render() {
        card.style.transform =
          'perspective(760px) rotateX(' + ty.toFixed(2) + 'deg) rotateY(' + tx.toFixed(2) + 'deg) translateZ(' +
          (active ? 30 : 0) + 'px)';
        card.style.setProperty('--mx', cx + '%');
        card.style.setProperty('--my', cy + '%');

        /* Тень уезжает в сторону, противоположную наклону — как если бы
           свет падал сверху и не двигался. Именно это читается как объём,
           а не сам поворот. */
        if (active) {
          var sx = (-tx * 2.4).toFixed(1);
          var sy = (ty * 2.4 + 34).toFixed(1);
          card.style.boxShadow = sx + 'px ' + sy + 'px 70px -32px rgba(43,42,38,.62)';
        } else {
          card.style.boxShadow = '';
        }
        raf = null;
      }

      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        tx = (px - 0.5) * 14;
        ty = -(py - 0.5) * 14;
        cx = Math.round(px * 100);
        cy = Math.round(py * 100);
        active = true;
        if (!raf) raf = requestAnimationFrame(render);
      }, { passive: true });

      card.addEventListener('mouseleave', function () {
        tx = 0; ty = 0; active = false;
        if (!raf) raf = requestAnimationFrame(render);
      });
    });
  }

  /* ---------------------------------------------------------
     4. Появление блоков с поворотом в пространстве
     --------------------------------------------------------- */
  function init3DReveal() {
    if (!('IntersectionObserver' in window)) return;

    var targets = document.querySelectorAll('.steps .step, .price-card, .metaphor-card, .step-long');
    if (!targets.length) return;

    Array.prototype.forEach.call(targets, function (el, i) {
      el.classList.add('fx-rise');
      el.style.transitionDelay = (i % 4) * 90 + 'ms';
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('fx-risen');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });

    /* страховка: если наблюдатель молчит, показываем принудительно */
    setTimeout(function () {
      Array.prototype.forEach.call(targets, function (el) { el.classList.add('fx-risen'); });
    }, 3200);
  }

  function boot() {
    try { initFog(); } catch (e) {}
    try { initHeroScene(); } catch (e) {}
    try { initTilt(); } catch (e) {}
    try { init3DReveal(); } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
