(function () {
  var loader = document.getElementById("loading-screen");
  if (!loader) return;

  var prevHtmlOverflow = document.documentElement.style.overflow || "";
  var prevBodyOverflow = document.body.style.overflow || "";
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";

  function removeLoader() {
    if (!loader) return;
    loader.classList.add("hidden");

    if (typeof cancelAnimationFrame === "function" && rafId)
      cancelAnimationFrame(rafId);

    var onTransitionEnd = function () {
      if (loader.parentNode) loader.parentNode.removeChild(loader);
      document.documentElement.style.overflow = prevHtmlOverflow || "";
      document.body.style.overflow = prevBodyOverflow || "";
      loader.removeEventListener("transitionend", onTransitionEnd);
    };
    loader.addEventListener("transitionend", onTransitionEnd);

    // If there's no transition (or duration is 0), transitionend will
    // never fire — fall back to removing the loader after a tiny delay.
    try {
      var cs = window.getComputedStyle(loader);
      var dur = cs ? cs.transitionDuration || cs.getPropertyValue('transition-duration') : null;
      // transitionDuration may be in seconds (e.g. "0s") or ms (e.g. "200ms")
      var durationMs = 0;
      if (dur) {
        if (dur.indexOf('ms') !== -1) durationMs = parseFloat(dur);
        else if (dur.indexOf('s') !== -1) durationMs = parseFloat(dur) * 1000;
      }
      // if duration is effectively zero, call the handler shortly after
      if (!durationMs || durationMs <= 20) {
        setTimeout(onTransitionEnd, 30);
      }
    } catch (e) {
      // If anything goes wrong reading styles, still ensure loader is removed
      setTimeout(onTransitionEnd, 30);
    }
  }

  window.addEventListener("load", function () {
    setTimeout(removeLoader, 120);
  });

  setTimeout(function () {
    if (document.getElementById("loading-screen")) removeLoader();
  }, 4000);

  var loaderSquare = loader.querySelector(".loader-square");
  var rafId = null;

  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (loaderSquare && !prefersReduced) {
    var angle = 0;
    var last = null;

    var baseSpeed = 240;
    var amplitude = 0.7;
    var period = 1400;

    function step(ts) {
      if (last === null) last = ts;
      var dt = ts - last;
      last = ts;

      var t = ts % period;
      var mod = 1 + amplitude * Math.sin((2 * Math.PI * t) / period);
      var omega = baseSpeed * mod;

      angle += omega * (dt / 1000);
      if (angle > 36000) angle = angle % 360;

      loaderSquare.style.transform = "rotate(" + angle.toFixed(2) + "deg)";

      rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);
  }
})();
