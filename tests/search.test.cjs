'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const searchIndex = require(path.join(repoRoot, 'search-index.js'));
const search = require(path.join(repoRoot, 'site-search.js'));

function idsFor(query, limit = 20) {
  return search.searchRecords(query, { limit }).map((record) => record.id);
}

test('the public search index is intentionally small and immutable', () => {
  assert.equal(searchIndex.length, 46);
  assert.ok(Object.isFrozen(searchIndex));
  assert.ok(searchIndex.every((record) => Object.isFrozen(record)));
  assert.ok(searchIndex.every((record) => Object.isFrozen(record.keywords)));
});

test('every record has the required safe shape and a unique id', () => {
  const ids = new Set();

  searchIndex.forEach((record) => {
    assert.match(record.id, /^[a-z0-9-]+$/);
    assert.equal(ids.has(record.id), false, `duplicate id: ${record.id}`);
    ids.add(record.id);

    assert.ok(record.type.trim());
    assert.ok(record.title.trim());
    assert.ok(record.summary.trim());
    assert.ok(Array.isArray(record.keywords));
    assert.ok(record.keywords.length > 0);
    assert.match(record.url, /^\/(?!\/)/, `not a root-relative internal URL: ${record.url}`);
  });
});

test('private and internal-only material is excluded from every searchable field', () => {
  const serialized = JSON.stringify(searchIndex).toLowerCase();
  const forbidden = [
    'practice-hub',
    'brand-guide',
    'business-card',
    'logo-options',
    'site-preview',
    'localhost',
    '127.0.0.1'
  ];

  forbidden.forEach((value) => {
    assert.equal(serialized.includes(value), false, `forbidden search content: ${value}`);
  });
});

test('normalization handles the Hōlus wordmark, punctuation and compact number names', () => {
  assert.equal(search.normalizeText('Hōlus'), 'holus');
  assert.equal(search.normalizeText('GLP-1'), 'glp 1');
  assert.equal(search.normalizeText('GLP1'), 'glp 1');
  assert.equal(search.normalizeText('Omega-3s'), 'omega 3 s');
  assert.equal(search.normalizeText('Vitamin B12'), 'vitamin b 12');
});

test('empty and one-character queries do not produce noisy results', () => {
  assert.deepEqual(idsFor(''), []);
  assert.deepEqual(idsFor('   '), []);
  assert.deepEqual(idsFor('d'), []);
});

test('Hōlus is discoverable without entering the macron', () => {
  assert.equal(idsFor('holus')[0], 'page-home');
  assert.equal(idsFor('hōlus')[0], 'page-home');
});

test('exact nutrient titles rank ahead of pages that mention the nutrient', () => {
  const protein = idsFor('protein');
  assert.equal(protein[0], 'nutrient-protein');
  assert.ok(protein.includes('page-glp1'));

  assert.equal(idsFor('vitamin d')[0], 'nutrient-vitamin-d');
});

test('common punctuation variants reach the same omega-3 result', () => {
  assert.equal(idsFor('omega3')[0], 'nutrient-omega3');
  assert.equal(idsFor('omega 3')[0], 'nutrient-omega3');
  assert.equal(idsFor('omega-3')[0], 'nutrient-omega3');
});

test('GLP-1 compact and punctuated variants reach the same page', () => {
  assert.equal(idsFor('glp1')[0], 'page-glp1');
  assert.equal(idsFor('GLP-1')[0], 'page-glp1');
  assert.equal(idsFor('glp 1')[0], 'page-glp1');
});

test('practical visitor language finds the intended service or policy', () => {
  assert.equal(idsFor('insurance receipt')[0], 'faq-insurance');
  assert.equal(idsFor('cancel')[0], 'policy-cancellation');
  assert.equal(idsFor('microbiome')[0], 'testing-gi-map');
  assert.equal(idsFor('Juliana')[0], 'page-about');
  assert.ok(idsFor('first appointment').slice(0, 3).includes('service-initial-consultation'));
});

test('natural-language stop words do not block a useful match', () => {
  assert.equal(idsFor('what happens in a first session')[0], 'faq-first-session');
  assert.ok(idsFor('how do I book').includes('faq-booking'));
});

test('all meaningful query tokens must match the same record', () => {
  assert.deepEqual(idsFor('protein cancellation'), []);
  assert.deepEqual(idsFor('microbiome insurance'), []);
});

test('untrusted query strings are treated as text and cannot become markup', () => {
  assert.doesNotThrow(() => idsFor('<img src=x onerror=alert(1)>'));
  assert.deepEqual(idsFor('<img src=x onerror=alert(1)>'), []);
});

test('result limits are deterministic', () => {
  assert.equal(idsFor('nutrition', 3).length, 3);
  assert.deepEqual(idsFor('nutrition', 0), []);
});

test('browser initialization keeps access to its window object', () => {
  const originalAddEventListener = globalThis.addEventListener;
  globalThis.addEventListener = () => {};

  const documentStub = {
    documentElement: { dataset: {} },
    getElementById: (id) => (id === 'holus-site-search-styles' ? {} : null),
    querySelector: () => null
  };

  try {
    assert.doesNotThrow(() => search.init(documentStub));
    assert.equal(documentStub.documentElement.dataset.holusSearchReady, 'true');
  } finally {
    if (originalAddEventListener === undefined) delete globalThis.addEventListener;
    else globalThis.addEventListener = originalAddEventListener;
  }
});

test('generated links stay inside the GitHub Pages project path', () => {
  const originalLocation = Object.getOwnPropertyDescriptor(globalThis, 'location');
  Object.defineProperty(globalThis, 'location', {
    configurable: true,
    value: {
      hostname: 'jusandberg.github.io',
      pathname: '/holus-nutrition/search/'
    }
  });

  try {
    assert.equal(search.sitePath('/faq/'), '/holus-nutrition/faq/');
    assert.equal(search.sitePath('/holus-nutrition/faq/'), '/holus-nutrition/faq/');
    assert.equal(search.sitePath('mailto:hello@holus.ca'), 'mailto:hello@holus.ca');
  } finally {
    if (originalLocation) Object.defineProperty(globalThis, 'location', originalLocation);
    else delete globalThis.location;
  }
});
