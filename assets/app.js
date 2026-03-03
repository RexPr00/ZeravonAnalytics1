(() => {
  const body = document.body;
  const focusableSel = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

  function setLock(lock) { body.style.overflow = lock ? 'hidden' : ''; }
  function trapFocus(container, e) {
    if (e.key !== 'Tab') return;
    const nodes = [...container.querySelectorAll(focusableSel)];
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  document.querySelectorAll('[data-lang-switch]').forEach((wrap) => {
    const btn = wrap.querySelector('.lang-pill');
    btn?.addEventListener('click', () => wrap.classList.toggle('open'));
    document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) wrap.classList.remove('open'); });
  });

  const drawer = document.querySelector('[data-drawer]');
  const openBtn = document.querySelector('[data-open-drawer]');
  const closeBtns = document.querySelectorAll('[data-close-drawer]');
  let drawerOpen = false;

  function closeDrawer() {
    if (!drawerOpen || !drawer) return;
    drawerOpen = false; drawer.classList.remove('open'); setLock(false); openBtn?.focus();
  }
  function openDrawer() {
    if (!drawer) return;
    drawerOpen = true; drawer.classList.add('open'); setLock(true);
    drawer.querySelector('button, a, input')?.focus();
  }
  openBtn?.addEventListener('click', openDrawer);
  closeBtns.forEach((b) => b.addEventListener('click', closeDrawer));
  drawer?.addEventListener('click', (e) => { if (e.target.matches('.drawer-backdrop')) closeDrawer(); });

  const modal = document.querySelector('[data-modal]');
  const openModal = document.querySelectorAll('[data-open-modal]');
  const closeModalBtns = document.querySelectorAll('[data-close-modal]');
  let modalOpen = false;

  function closeModal() {
    if (!modalOpen || !modal) return;
    modalOpen = false; modal.classList.remove('open'); setLock(false);
  }
  function showModal() {
    if (!modal) return;
    modalOpen = true; modal.classList.add('open'); setLock(true);
    modal.querySelector('button, a')?.focus();
  }
  openModal.forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); showModal(); }));
  closeModalBtns.forEach((b) => b.addEventListener('click', closeModal));
  modal?.addEventListener('click', (e) => { if (e.target.matches('.modal-backdrop')) closeModal(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeDrawer(); closeModal(); }
    if (drawerOpen && drawer) trapFocus(drawer.querySelector('.drawer-panel'), e);
    if (modalOpen && modal) trapFocus(modal.querySelector('.modal-panel'), e);
  });

  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-q');
    btn?.addEventListener('click', () => {
      document.querySelectorAll('.faq-item').forEach((el) => {
        if (el !== item) el.classList.remove('open');
      });
      item.classList.toggle('open');
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();
