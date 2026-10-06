const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('is-open', !isOpen);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  });
});

// Phones: keep a small Book button in the header so booking is one tap away while scrolling
(function () {
  const shell = document.querySelector('.nav-shell');
  const book = navigation?.querySelector('.button');
  if (!shell || !book || shell.querySelector('.header-book')) return;
  const quick = book.cloneNode(false);
  quick.className = 'button button-small header-book';
  quick.textContent = 'Book';
  quick.setAttribute('aria-label', book.textContent.trim() || 'Book a consultation');
  shell.insertBefore(quick, menuButton);
})();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const whoTiles = [...document.querySelectorAll('.who-tile')];
const whoPanel = document.querySelector('.who-panel');

whoTiles.forEach((tile) => {
  tile.addEventListener('click', () => {
    whoTiles.forEach((item) => item.setAttribute('aria-selected', String(item === tile)));
    if (!whoPanel) return;
    const icon = tile.querySelector('svg');
    const panelIcon = whoPanel.querySelector('.who-panel-icon');
    if (icon && panelIcon) panelIcon.innerHTML = icon.outerHTML;
    whoPanel.querySelector('h3').textContent = tile.dataset.title;
    whoPanel.querySelector('p').textContent = tile.dataset.description;
  });
});

// Floating food imagery. To remove: delete this block and the matching block at the end of styles.css.
// Each float peeks in from the left (l) or right (r) edge of the screen; sides alternate down the page.
// [section, image, desktop side, desktop top, desktop size px, phone side, phone top, phone size px, tilt deg]
(function () {
  const FLOATS = {
    home: [['#home', 'strawberry', 'r', '1rem', 100, 'r', '8rem', 64, -14], ['#method', 'berries', 'l', 'calc(100% - 9rem)', 92, 'r', '1.4rem', 56, 0], ['#contact', 'grapes-light', 'r', '3rem', 120, 'r', '1rem', 66, 12], ['#contact', 'mint-light', 'l', '52%', 110, 'l', '88%', 52, -18]],
    'nutritional-counselling': [['.page-hero', 'cherries', 'r', '3rem', 96, 'r', '6.4rem', 58, -8], ['.expect', 'carrot', 'r', '4rem', 104, 'r', '2rem', 60, -16]],
    faq: [['#faq', 'fig', 'r', '2rem', 96, 'r', '1.6rem', 60, 10]],
    about: [['.page-hero', 'mint', 'r', '4rem', 92, 'r', '9rem', 58, -10], ['.page-hero + .section-pad', 'peas', 'l', 'calc(100% - 8rem)', 88, 'r', '2.4rem', 54, 20]],
    'midlife-nutrition': [['.page-hero', 'leaf', 'r', '4rem', 96, 'r', '30rem', 58, 22], ['.page-hero + .section-pad', 'cherries', 'l', 'calc(100% - 8rem)', 88, 'r', '2rem', 56, 0]],
    'nutrition-behaviour-change': [['.behaviour-relationship', 'leaf-light', 'r', '3rem', 100, 'r', '1rem', 58, 30], ['.behaviour-factors', 'fig', 'l', 'calc(100% - 10rem)', 100, 'r', '1.6rem', 58, -14]],
    'glp1-nutrition-support': [['.page-hero', 'sprig', 'r', '3rem', 92, 'r', '30rem', 56, -10], ['.page-hero + .section-pad', 'almond', 'l', 'calc(100% - 8rem)', 70, 'r', '2rem', 44, 24]],
    digest: [['.next-step', 'carrot', 'r', '.5rem', 80, 'r', '0rem', 50, 0]],
  };

  const script = document.currentScript;
  const assetBase = new URL('assets/', script ? script.src : location.href);
  const parts = location.pathname.split('/').filter(Boolean);
  const last = parts[parts.length - 1] || '';
  const key = /home\.html$/.test(last) || parts.length <= 1 && !document.querySelector('.page-hero') ? 'home' : last.replace(/\.html$/, '');
  const list = FLOATS[key];
  if (!list) return;
  function place() {
    list.forEach(([selector, image, side, top, size, pside, ptop, phone, tilt], n) => {
      const host = document.querySelector(selector);
      if (!host || host.querySelector('.hf[data-n="' + n + '"]')) return;
      host.classList.add('hf-host');
      const img = document.createElement('img');
      img.className = 'hf hf-' + side + ' hfm-' + pside;
      img.dataset.n = n;
      img.src = new URL('float-' + image + '.svg', assetBase).href;
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      img.decoding = 'async';
      img.style.cssText = `--t:${top};--tm:${ptop};--w:${size}px;--wm:${phone}px;--r:${tilt}deg`;
      host.appendChild(img);
    });
  }
  place();
  window.addEventListener('load', () => { setTimeout(place, 50); setTimeout(place, 1200); });
})();

// Venn diagram: play the entrance when it scrolls into view.
window.holusAnimateVenn = (root = document) => {
  const venn = root.querySelector('.venn');
  if (!venn || venn.classList.contains('venn-anim')) return;
  const view = root.defaultView || window;
  if (!('IntersectionObserver' in view)) return;
  venn.classList.add('venn-anim');
  const io = new view.IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { venn.classList.add('venn-in'); io.disconnect(); }
  }, { threshold: 0.35 });
  io.observe(venn);
};
window.holusAnimateVenn(document);
