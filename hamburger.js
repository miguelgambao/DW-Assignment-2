(function () {
  const hamburger = document.querySelector(".hamburger-btn");
  const sidebar = document.getElementById("sidebar");
  if (!hamburger || !sidebar) return;

  function setOpen(isOpen) {
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    sidebar.classList.toggle("open", isOpen);
    sidebar.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("no-scroll", isOpen);
  }

  // initial state
  setOpen(false);

  hamburger.addEventListener("click", function (e) {
    e.preventDefault();
    setOpen(!hamburger.classList.contains("open"));
  });

  // close when clicking outside sidebar
  document.addEventListener("click", function (e) {
    if (!sidebar.classList.contains("open")) return;
    const target = e.target;
    if (hamburger.contains(target)) return; // allow toggle
    if (sidebar.contains(target)) return; // interaction inside
    setOpen(false);
  });

  // close when clicking any nav link inside the sidebar
  // (keeps default navigation behavior but closes the menu)
  const sidebarLinks = sidebar.querySelectorAll("a[href]");
  if (sidebarLinks && sidebarLinks.length) {
    sidebarLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });
  }
})();
