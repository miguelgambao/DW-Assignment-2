(function () {
  function setVh() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
  }
  setVh();
  window.addEventListener('resize', setVh);
  window.addEventListener('orientationchange', setVh);

  const hamburger = document.querySelector(".hamburger-btn");
  const sidebar = document.getElementById("sidebar");
  if (!hamburger || !sidebar) return;
  let overlay = null;

  function createOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    overlay.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
    overlay.addEventListener('wheel', function (e) { e.preventDefault(); }, { passive: false });
    overlay.addEventListener('click', function () { setOpen(false); });
    return overlay;
  }

  function removeOverlay() {
    if (!overlay) return;
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    overlay = null;
  }

  function setOpen(isOpen) {
    hamburger.classList.toggle("open", isOpen);
    sidebar.classList.toggle("open", isOpen);
  document.body.classList.toggle('menu-open', isOpen);
    if (isOpen) {
      const ov = createOverlay();
      document.body.appendChild(ov);
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overscrollBehavior = 'none';
      document.body.style.overscrollBehavior = 'none';
    } else {
      removeOverlay();
      // restore scrolling
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.style.overscrollBehavior = '';
      document.body.style.overscrollBehavior = '';
    }
  }

  setOpen(false);

  hamburger.addEventListener("click", function (e) {
    e.preventDefault();
    setOpen(!hamburger.classList.contains("open"));
  });

  document.addEventListener("click", function (e) {
    if (!sidebar.classList.contains("open")) return;
    const target = e.target;
    if (hamburger.contains(target)) return;
    if (sidebar.contains(target)) return;
    setOpen(false);
  });

  const sidebarLinks = sidebar.querySelectorAll("a[href]");
  if (sidebarLinks && sidebarLinks.length) {
    sidebarLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });
  }
})();
