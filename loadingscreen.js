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
