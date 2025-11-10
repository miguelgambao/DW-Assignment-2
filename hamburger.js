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

  let _scrollY = 0;

  function lockScroll() {
    _scrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${_scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  function unlockScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, _scrollY);
  }

  function setOpen(isOpen) {
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    sidebar.classList.toggle("open", isOpen);
    sidebar.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle('menu-open', isOpen);
    // legacy fallback style
    document.body.classList.toggle("no-scroll", isOpen);
    if (isOpen) lockScroll();
    else unlockScroll();
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
