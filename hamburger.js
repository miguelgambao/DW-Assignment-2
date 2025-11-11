(function () {
  

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
      link.addEventListener("click", function (e) {
        // Close the menu first so the UI can restore scrolling/overscroll behavior.
        setOpen(false);

        // Some mobile browsers (especially when overflow/overscroll has been
        // manipulated) do not reliably perform the default navigation to a
        // hash on another page. Force navigation shortly after closing the
        // menu to ensure the page and anchor are reached.
        try {
          const href = link.getAttribute('href');
          if (!href) return;

          // Ignore special protocols like mailto: or tel:
          if (href.startsWith('mailto:') || href.startsWith('tel:')) return;

          // Small delay to allow menu close animations / DOM changes
          setTimeout(() => {
            // If it's a same-page hash ("#id"), set location.hash
            if (href.startsWith('#')) {
              location.hash = href;
            } else {
              // Otherwise navigate to the target URL (works for index.html#about)
              window.location.href = href;
            }
          }, 120);
        } catch (err) {
          // Fallback: do nothing and allow default navigation
          console.warn('Navigation helper failed', err);
        }
      });
    });
  }
})();
