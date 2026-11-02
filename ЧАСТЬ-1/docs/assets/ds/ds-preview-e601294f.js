/* Превью карточек дизайн-системы, режим «собрано заранее».

   Прежняя версия держала в браузере Babel standalone (2,87 МБ) и
   переводила исходники .jsx на каждом заходе посетителя. Теперь перевод
   сделан при сборке, здесь остаётся только вызов готовых функций.

   Порядок важен и повторяет прежний: все компоненты собираются в ОДИН
   общий объект, потому что внутри они видят друг друга через него;
   демо получает копию этого объекта. */
(function () {
  function запустить(путь, ns) {
    var готовое = window.__dsCompiled && window.__dsCompiled[путь];
    if (!готовое) throw new Error("не собран " + путь);
    return готовое(window.React, ns);
  }

  window.dsCard = function (opts) {
    var root = document.getElementById("root");
    try {
      var ns = {};
      (opts.sources || []).forEach(function (п) { Object.assign(ns, запустить(п, ns)); });
      (opts.always || []).forEach(function (п) { Object.assign(ns, запустить(п, ns)); });
      var built = запустить(opts.demo, Object.assign({}, ns));
      root.innerHTML = "";
      ReactDOM.createRoot(root).render(React.createElement(built.Demo));
    } catch (e) {
      root.innerHTML =
        '<div style="padding:14px;border:1px solid var(--border-default);border-radius:var(--radius-md);' +
        'background:var(--surface-1);font:var(--type-body-sm);color:var(--text-muted)">Библиотека ещё не собрана: ' +
        String(e.message || e) + "</div>";
    }
  };
})();
