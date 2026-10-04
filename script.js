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
(function () {
  const FLOATS = {
    home: [['#home', 'lemon', 'home-lemon'], ['#home', 'leaf', 'home-leaf'], ['#who', 'sprig', 'who-sprig'], ['#method', 'berries', 'method-berries'], ['#contact', 'leaf-light', 'contact-leaf1'], ['#contact', 'leaf-light', 'contact-leaf2']],
    'nutritional-counselling': [['.page-hero', 'peas', 'svc-peas'], ['.page-hero', 'almond', 'svc-almond'], ['.expect', 'sprig', 'expect-sprig'], ['#faq', 'lemon', 'faq-lemon']],
    about: [['.page-hero', 'berries', 'about-berries'], ['.page-hero + .section-pad', 'leaf', 'about-leaf']],
    'midlife-nutrition': [['.page-hero', 'sprig', 'mid-sprig'], ['.page-hero + .section-pad', 'lemon', 'mid-lemon']],
    'nutrition-behaviour-change': [['.behaviour-relationship', 'leaf-light', 'nbc-leaf'], ['.behaviour-factors', 'sprig', 'nbc-sprig'], ['.behaviour-factors', 'berries', 'nbc-berries']],
    'glp1-nutrition-support': [['.page-hero', 'peas', 'glp-peas'], ['.page-hero + .section-pad', 'almond', 'glp-almond']],
    digest: [['.next-step', 'berries', 'dig-berries']],
  };
  const script = document.currentScript;
  const assetBase = new URL('assets/', script ? script.src : location.href);
  const parts = location.pathname.split('/').filter(Boolean);
  const last = parts[parts.length - 1] || '';
  const key = /home\.html$/.test(last) || parts.length <= 1 && !document.querySelector('.page-hero') ? 'home' : last.replace(/\.html$/, '');
  const list = FLOATS[key];
  if (!list) return;
  function place() {
    list.forEach(([selector, image, id]) => {
      const host = document.querySelector(selector);
      if (!host || host.querySelector('.hf-' + id)) return;
      host.classList.add('hf-host');
      const img = document.createElement('img');
      img.className = 'hf hf-' + id;
      img.src = new URL('float-' + image + '.svg', assetBase).href;
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      img.decoding = 'async';
      host.appendChild(img);
    });
  }
  place();
  window.addEventListener('load', () => { setTimeout(place, 50); setTimeout(place, 1200); });
})();
