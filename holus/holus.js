const BRAND_NAME = 'hōlus.';
const FORMAL_NAME = 'Hōlus Nutrition Counselling';
const BRAND_DESCRIPTOR = 'Nutrition Counselling';
const shellFrame = document.querySelector('#holus-site') || document.querySelector('#brand-site');

function wordmarkMarkup(includeDescriptor = true) {
  return `
    <span class="brand-lockup">
      <span class="brand-wordmark" aria-label="${BRAND_NAME}">${BRAND_NAME}</span>
      ${includeDescriptor ? `<span class="brand-descriptor">${BRAND_DESCRIPTOR}</span>` : ''}
    </span>`;
}

function replaceBrandText(doc) {
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((node) => {
    if (node.parentElement?.closest('script, style')) return;
    node.nodeValue = node.nodeValue.replaceAll('Hōlus Nutrition Counselling', FORMAL_NAME);
  });
}

function rewriteHolusPolicies(doc) {
  if (!doc.body.classList.contains('policy-page')) return;
  const main = doc.querySelector('#main');
  if (!main || main.dataset.holusPolicies === 'true') return;

  main.dataset.holusPolicies = 'true';
  main.innerHTML = `
    <header class="policy-hero">
      <p class="eyebrow">Website policies</p>
      <h1>${FORMAL_NAME}</h1>
      <p>Operated by Juliana dos Santos in Ontario, Canada.</p>
    </header>
    <div class="policy-stack">
      <section id="privacy" class="policy-card">
        <h2>1. Privacy Policy</h2>
        <p>At ${FORMAL_NAME}, your privacy matters. We collect personal information necessary to provide nutrition counselling and related services.</p>
        <h3>Information we collect</h3>
        <p>Depending on your interactions with us, this may include:</p>
        <ul>
          <li>Your name, email address, telephone number and appointment information.</li>
          <li>Relevant health, nutrition, dietary and lifestyle information that you voluntarily provide.</li>
          <li>Your goals, preferences and information shared during consultations.</li>
          <li>Payment and transaction information processed through our payment providers.</li>
        </ul>
        <h3>How we use your information</h3>
        <p>We use your information to deliver our services, communicate with you, manage appointments, maintain client records, process payments and meet applicable legal and administrative obligations.</p>
        <h3>Confidentiality and information sharing</h3>
        <p>We take reasonable measures to safeguard personal information. We do not sell your personal information.</p>
        <p>Information may be shared with service providers when necessary to operate our practice, with your consent or when required or permitted by law. Service providers are expected to maintain appropriate privacy and security protections.</p>
        <h3>Retention and your rights</h3>
        <p>Personal information is retained for as long as necessary to provide services and meet applicable legal and professional requirements.</p>
        <p>You may request access to your personal information or ask us to correct inaccurate information, subject to applicable legal exceptions.</p>
        <p>For privacy questions or requests, contact:<br>Juliana dos Santos<br>${FORMAL_NAME}<br><a href="mailto:hello@holus.ca">hello@holus.ca</a></p>
      </section>

      <section id="scope" class="policy-card">
        <h2>2. Scope of Practice</h2>
        <p>${FORMAL_NAME} provides individualized, evidence-informed nutrition education, counselling and behaviour-change support.</p>
        <p>Depending on your needs and the practitioner's qualifications, services may include nutritional assessments, dietary reviews, personalized nutrition recommendations, meal planning, supplement education, practical lifestyle strategies and follow-up support.</p>
        <p>Our approach considers your biology, preferences, goals, behaviours and everyday circumstances.</p>
        <h3>Professional boundaries</h3>
        <p>Nutrition counselling is not a substitute for medical assessment, diagnosis or treatment.</p>
        <p>Services do not include diagnosing medical conditions, prescribing medication, changing prescribed treatments or independently interpreting medical tests for diagnostic purposes.</p>
        <p>Where appropriate, clients may be referred to or encouraged to collaborate with qualified healthcare professionals.</p>
        <p>Recommendations are provided within the practitioner's training, qualifications and applicable professional scope.</p>
      </section>

      <section id="terms" class="policy-card">
        <h2>3. Terms and Conditions</h2>
        <p>By booking or using ${FORMAL_NAME} services, you acknowledge the following terms.</p>
        <h3>Services</h3>
        <p>Our services provide individualized nutrition education and counselling. Recommendations are based on information you share, relevant evidence and the practitioner's professional scope.</p>
        <p>Individual results vary, and specific outcomes cannot be guaranteed.</p>
        <h3>Client responsibilities</h3>
        <p>Clients are responsible for providing accurate and relevant information, communicating changes that may affect their nutrition needs, attending scheduled appointments and consulting appropriate medical professionals when necessary.</p>
        <h3>Appointments and payments</h3>
        <p>Appointment durations, fees and available services are displayed during booking. Applicable fees and payment requirements will be communicated before your appointment.</p>
        <div id="cancellation">
          <h3>Cancellations and rescheduling</h3>
          <p>Appointments may be cancelled or rescheduled with at least 24 hours' notice.</p>
          <p>Cancellations made with less than 24 hours' notice and missed appointments may be subject to the applicable cancellation fee disclosed during booking. Exceptions may be considered for emergencies at the practitioner's discretion.</p>
        </div>
        <h3>Educational resources</h3>
        <p>Website articles, downloadable materials and other educational content are provided for general information. They are not individualized medical advice.</p>
        <h3>Intellectual property</h3>
        <p>Unless otherwise stated, original website content and educational materials belong to ${FORMAL_NAME}. They may not be reproduced or distributed commercially without permission.</p>
        <h3>Applicable law</h3>
        <p>These terms are governed by the applicable laws of Ontario and Canada.</p>
        <h3>Contact</h3>
        <p>${FORMAL_NAME}<br>Juliana dos Santos<br><a href="mailto:hello@holus.ca">hello@holus.ca</a></p>
      </section>

      <section id="contact-policy" class="policy-card">
        <p><strong>Last updated:</strong> October 3, 2026</p>
        <p><small>These policies should be reviewed before publication to ensure they accurately reflect the practice's booking system, payment processing, privacy procedures, professional credentials and applicable legal requirements.</small></p>
      </section>
    </div>`;
}

function applyConnectedWho(doc) {
  const who = doc.querySelector('#who');
  if (!who || who.dataset.holusConnected === 'true') return;

  if (!doc.querySelector('#holus-who-connected-styles')) {
    const styles = doc.createElement('style');
    styles.id = 'holus-who-connected-styles';
    styles.textContent = `
      .holus-who-connected { overflow: hidden; background: var(--white); }
      .holus-who-connected .holus-who-heading { margin-bottom: clamp(2.5rem, 5vw, 4.5rem); }
      .holus-who-connected .holus-who-heading h2 { max-width: 13ch; }
      .holus-who-path { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: clamp(1rem, 2vw, 2rem); margin: 0; padding: 0; list-style: none; }
      .holus-who-item { position: relative; min-width: 0; }
      .holus-who-item::after { content: ""; position: absolute; z-index: 0; top: 1.2rem; left: 2.75rem; width: calc(100% + clamp(1rem, 2vw, 2rem) - 2.75rem); height: 1px; background: var(--sage-light); }
      .holus-who-item:last-child::after { display: none; }
      .holus-who-icon { position: relative; z-index: 1; display: block; width: 2.45rem; height: 2.45rem; margin-bottom: 1.65rem; padding-right: .35rem; color: var(--ink); background: var(--white); }
      .holus-who-icon svg { display: block; width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 1.45; stroke-linecap: round; stroke-linejoin: round; }
      .holus-who-icon .accent { stroke: var(--sage); }
      .holus-who-item p { max-width: 15rem; margin: 0; color: var(--muted); font-size: .82rem; line-height: 1.55; }
      .holus-who-item strong { color: var(--ink); font-weight: 750; }
      .holus-who-swipe { display: none; }
      @media (max-width: 900px) {
        .holus-who-path { grid-template-columns: repeat(3, 1fr); gap: 2.75rem 1.5rem; }
        .holus-who-item:nth-child(3)::after { display: none; }
        .holus-who-item:nth-child(4)::before { content: ""; position: absolute; top: -1.4rem; left: 1.2rem; width: 1px; height: 1.35rem; background: var(--sage-light); }
      }
      @media (max-width: 600px) {
        .holus-who-connected .section-shell { padding-right: 0; }
        .holus-who-connected .holus-who-heading { padding-right: var(--gutter); margin-bottom: 1.25rem; }
        .holus-who-connected .holus-who-heading h2 { max-width: 11ch; }
        .holus-who-swipe { display: flex; align-items: center; gap: .45rem; margin: 0 0 1.4rem; color: var(--sage-deep); font: 700 .72rem/1.2 Manrope, sans-serif; letter-spacing: .09em; text-transform: uppercase; }
        .holus-who-swipe::after { content: "\u2192"; font-size: 1rem; }
        .holus-who-path { display: flex; gap: 0; overflow-x: auto; overscroll-behavior-inline: contain; scroll-snap-type: x mandatory; scrollbar-width: none; padding: .2rem var(--gutter) .8rem 0; }
        .holus-who-path::-webkit-scrollbar { display: none; }
        .holus-who-item { flex: 0 0 72vw; max-width: 18rem; min-height: 11.5rem; padding-right: 2rem; scroll-snap-align: start; }
        .holus-who-item::after { display: block; left: 2.8rem; width: calc(100% - 2.8rem); }
        .holus-who-item:last-child::after { display: none; }
        .holus-who-item:nth-child(4)::before { display: none; }
        .holus-who-icon { width: 2.55rem; height: 2.55rem; margin-bottom: 1.5rem; }
        .holus-who-item p { max-width: 14rem; font-size: .94rem; }
      }
    `;
    doc.head.append(styles);
  }

  who.dataset.holusConnected = 'true';
  who.className = 'holus-who-connected section-pad';
  who.innerHTML = `
    <div class="section-shell">
      <header class="holus-who-heading">
        <h2 id="who-title">Who I help.</h2>
      </header>
      <div class="holus-who-swipe" aria-hidden="true">Swipe to explore</div>
      <ul class="holus-who-path" aria-label="Nutrition support areas">
        <li class="holus-who-item"><span class="holus-who-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="m9 23 11-11m-7-4 11 11M16 5l11 11-5 5L11 10l5-5ZM6 26l5-2-3-3-2 5Z"/><path class="accent" d="M22.5 5.5 26.5 9.5"/></svg></span><p><strong>GLP-1 support</strong> alongside your healthcare provider.</p></li>
        <li class="holus-who-item"><span class="holus-who-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M25.5 6.5C14 7 7.5 13 7.5 21c0 3 2 5 5 5 8 0 13-7.5 13-19.5Z"/><path class="accent" d="M8.5 25c4-6 8-10 14-14"/><path d="m14 19 1-5m2 2 4 .5"/></svg></span><p><strong>Midlife nutrition</strong> for changing priorities.</p></li>
        <li class="holus-who-item"><span class="holus-who-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M5 7.5h15a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-8l-5 4v-4a3 3 0 0 1-2-3v-6a3 3 0 0 1 3-3Z"/><path class="accent" d="M11 12h7m-7 4h4"/><path d="M24 14.5h1a2 2 0 0 1 2 2v7l-3-2h-5"/></svg></span><p><strong>Conflicting advice</strong> made clearer.</p></li>
        <li class="holus-who-item"><span class="holus-who-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="11"/><path class="accent" d="M16 9v7l5 3"/><path d="M16 5V3m11 13h2"/></svg></span><p><strong>Habits and routines</strong> built for real life.</p></li>
        <li class="holus-who-item"><span class="holus-who-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M11 5v6c0 4 12 3 12 8s-12 4-12 8M21 5v3M11 27v1"/><path class="accent" d="M11 12c3 1 7 0 9-2m-8 14c3-1 7 0 9 2"/></svg></span><p><strong>Digestion and sensitivities</strong> explored carefully.</p></li>
        <li class="holus-who-item"><span class="holus-who-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><circle cx="20" cy="6" r="2.5"/><path d="m9 28 5-9 5 4 1 6M9 15l6-5 5 3 3 5M15 10l1.5 8"/><path class="accent" d="m5 21 5-2m14 2 4 2"/></svg></span><p><strong>Active lifestyles</strong> supported through nutrition.</p></li>
      </ul>
    </div>`;
}

function applyLivingNetwork(doc, pageWindow) {
  const method = doc.querySelector('.method');
  if (!method || method.dataset.holusNetwork === 'true') return;

  if (!doc.querySelector('#holus-network-styles')) {
    const styles = doc.createElement('style');
    styles.id = 'holus-network-styles';
    styles.textContent = `
      .holus-network-section { overflow: hidden; color: var(--ink); background: var(--mist); }
      .holus-network-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; gap: clamp(3rem, 8vw, 7rem); }
      .holus-network-visual { min-width: 0; }
      .holus-network-visual svg { width: 100%; height: auto; }
      .holus-network-visual line { stroke: rgba(36,51,65,.22); stroke-width: 1.3; }
      .holus-network-visual circle { fill: white; stroke: var(--sage-light); stroke-width: 1.5; }
      .holus-network-visual .tn-core { fill: var(--sage); stroke: none; }
      .holus-network-visual text { fill: var(--ink); font: 600 13px Manrope, sans-serif; text-anchor: middle; }
      .holus-network-visual .tn-core-text { fill: white; font-weight: 700; }
      .holus-network-copy .eyebrow { color: var(--sage-deep); }
      .holus-network-copy h2 { max-width: 10ch; color: var(--ink); }
      .holus-fan { position: relative; height: clamp(300px, 32vw, 400px); }
      .fan-card { position: absolute; top: 8%; width: 35%; aspect-ratio: 3 / 4; display: grid; grid-template-rows: 1fr auto; padding: 16px 16px 20px; border-radius: 22px; background: white; box-shadow: 0 18px 40px rgba(36,51,65,.12); transition: transform .4s cubic-bezier(.2,.7,.2,1); }
      .fan-art { display: grid; place-items: center; border-radius: 14px; background: var(--cloud); }
      .fan-art img { width: 80%; height: auto; }
      .fan-card b { margin-top: 14px; color: var(--ink); font: 800 clamp(1.25rem, 2.4vw, 1.75rem)/1 Manrope, sans-serif; letter-spacing: -.03em; }
      .fan-card:nth-child(1) { left: 0; transform: rotate(-8deg); }
      .fan-card:nth-child(2) { left: 32.5%; z-index: 2; background: var(--ink); transform: rotate(1deg) translateY(-14px); }
      .fan-card:nth-child(2) .fan-art { background: #2d3f50; }
      .fan-card:nth-child(2) b { color: white; }
      .fan-card:nth-child(3) { left: 65%; z-index: 1; transform: rotate(9deg); }
      .fan-card:nth-child(3) b { padding-left: .6rem; }
      @media (hover: hover) { .holus-fan:hover .fan-card { transform: none; } }
      @media (max-width: 640px) {
        .holus-fan { height: auto; aspect-ratio: 3 / 1.55; }
        .fan-card { width: 31%; top: 8%; padding: 8px 8px 12px; border-radius: 16px; }
        .fan-art { border-radius: 10px; }
        .fan-card b { margin-top: 8px; font-size: 1.05rem; }
        .fan-card:nth-child(1) { left: 2%; transform: rotate(-6deg); }
        .fan-card:nth-child(2) { left: 34.5%; transform: translateY(-6px); }
        .fan-card:nth-child(3) { left: 67%; transform: rotate(6deg); }
      }
      @media (prefers-reduced-motion: reduce) { .fan-card { transition: none; } }
      .holus-network-copy > p:not(.eyebrow) { max-width: 36rem; margin: 1.35rem 0 0; color: var(--muted); font-size: 1.04rem; }
      .holus-network-copy .text-link { display: inline-block; margin-top: 1.4rem; color: var(--ink); }
      .holus-network-points { display: flex; flex-wrap: wrap; gap: .35rem; margin: 1.6rem 0 2rem; padding: 0; color: var(--sage-deep); list-style: none; font: 700 .88rem/1.5 Manrope, sans-serif; }
      .holus-network-points li:not(:last-child)::after { content: " ·"; margin-left: .35rem; color: var(--sage-light); }
      .holus-network-visual .tn-lines line { stroke-dasharray: 420; stroke-dashoffset: 420; }
      .holus-network-visual .tn-signals line { opacity: 0; stroke: var(--sage); stroke-width: 4; stroke-linecap: round; stroke-dasharray: 18 500; stroke-dashoffset: 0; }
      .holus-network-visual .tn-nodes circle { opacity: 0; transform: scale(.78); transform-box: fill-box; transform-origin: center; }
      .holus-network-visual .tn-labels { opacity: 0; }
      .holus-network-visual.is-visible .tn-lines line { animation: holus-net-draw .9s ease-out forwards; }
      .holus-network-visual.is-visible .tn-lines line:nth-child(2n) { animation-delay: .08s; }
      .holus-network-visual.is-visible .tn-lines line:nth-child(3n) { animation-delay: .16s; }
      .holus-network-visual.is-visible .tn-signals line { animation: holus-net-signal .78s ease-out 1s forwards; }
      .holus-network-visual.is-visible .tn-signals line:nth-child(2) { animation-delay: 1.09s; }
      .holus-network-visual.is-visible .tn-signals line:nth-child(3) { animation-delay: 1.18s; }
      .holus-network-visual.is-visible .tn-signals line:nth-child(4) { animation-delay: 1.27s; }
      .holus-network-visual.is-visible .tn-signals line:nth-child(5) { animation-delay: 1.36s; }
      .holus-network-visual.is-visible .tn-signals line:nth-child(6) { animation-delay: 1.45s; }
      .holus-network-visual.is-visible .tn-signals line:nth-child(7) { animation-delay: 1.54s; }
      .holus-network-visual.is-visible .tn-nodes circle { animation: holus-net-node-in .42s cubic-bezier(.2,.8,.2,1.25) forwards; }
      .holus-network-visual.is-visible .tn-nodes circle:nth-child(2) { animation-delay: .12s; }
      .holus-network-visual.is-visible .tn-nodes circle:nth-child(3) { animation-delay: .2s; }
      .holus-network-visual.is-visible .tn-nodes circle:nth-child(4) { animation-delay: .28s; }
      .holus-network-visual.is-visible .tn-nodes circle:nth-child(5) { animation-delay: .36s; }
      .holus-network-visual.is-visible .tn-nodes circle:nth-child(6) { animation-delay: .44s; }
      .holus-network-visual.is-visible .tn-nodes circle:nth-child(7) { animation-delay: .52s; }
      .holus-network-visual.is-visible .tn-nodes .tn-core { animation: holus-net-node-in .5s cubic-bezier(.2,.8,.2,1.2) .62s forwards, holus-net-core-breathe 5s ease-in-out 1.5s infinite; }
      .holus-network-visual.is-visible .tn-labels { animation: holus-net-label-in .5s ease-out .78s forwards; }
      @keyframes holus-net-draw { to { stroke-dashoffset: 0; } }
      @keyframes holus-net-signal { 0% { opacity: 0; stroke-dashoffset: 0; } 12% { opacity: .95; } 78% { opacity: .8; } 100% { opacity: 0; stroke-dashoffset: -230; } }
      @keyframes holus-net-node-in { to { opacity: 1; transform: scale(1); } }
      @keyframes holus-net-label-in { to { opacity: 1; } }
      @keyframes holus-net-core-breathe { 0%, 12%, 100% { transform: scale(1); } 6% { transform: scale(1.045); } }
      @media (max-width: 800px) {
        .holus-network-grid { grid-template-columns: 1fr; gap: 2.5rem; }
        .holus-network-copy { order: -1; }
        .holus-network-copy h2 { max-width: 12ch; }
        .holus-network-visual { width: min(100%, 34rem); margin-inline: auto; }
      }
      @media (prefers-reduced-motion: reduce) {
        .holus-network-visual .tn-lines line { stroke-dashoffset: 0; }
        .holus-network-visual .tn-signals { display: none; }
        .holus-network-visual .tn-nodes circle { opacity: 1; transform: none; }
        .holus-network-visual .tn-labels { opacity: 1; }
        .holus-network-visual.is-visible :is(.tn-lines line, .tn-nodes circle, .tn-labels) { animation: none; }
      }
    `;
    doc.head.append(styles);
  }

  method.dataset.holusNetwork = 'true';
  method.classList.add('holus-network-section');
  method.innerHTML = `
    <div class="section-shell holus-network-grid">
      <div class="holus-network-copy">
        <p class="eyebrow">How we work together</p>
        <h2>Everything connects.</h2>
        <p>We find what matters most for you, right now.</p>
        <a class="text-link" href="/nutrition-behaviour-change/">How it works</a>
      </div>
      <div class="holus-network-visual holus-fan" role="list" aria-label="How we work together: see, choose, adapt">
        <div class="fan-card" role="listitem"><div class="fan-art"><img src="assets/food-tea.svg" alt="" width="240" height="200"></div><b>See</b></div>
        <div class="fan-card" role="listitem"><div class="fan-art"><img src="assets/food-apple.svg" alt="" width="240" height="200"></div><b>Choose</b></div>
        <div class="fan-card" role="listitem"><div class="fan-art"><img src="assets/food-avocado.svg" alt="" width="240" height="200"></div><b>Adapt</b></div>
      </div>
    </div>`;

  const network = method.querySelector('.holus-network-visual');
  if (!network) return;
  const reduceMotion = pageWindow.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in pageWindow)) {
    network.classList.add('is-visible');
    return;
  }

  const observer = new pageWindow.IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    network.classList.add('is-visible');
    observer.disconnect();
  }, { threshold: .3 });
  observer.observe(network);
}

function applyHolusBrand(pageFrame) {
  const doc = pageFrame?.contentDocument;
  if (!doc?.body) return;

  doc.title = doc.title.replaceAll('Hōlus Nutrition Counselling', BRAND_NAME);

  doc.querySelectorAll('.brand').forEach((brand) => {
    brand.setAttribute('aria-label', `${BRAND_NAME} ${BRAND_DESCRIPTOR} home`);
    brand.innerHTML = wordmarkMarkup(true);
  });

  doc.querySelectorAll('[data-brand-wordmark]').forEach((element) => {
    element.innerHTML = wordmarkMarkup(element.getAttribute('data-brand-wordmark') !== 'name-only');
  });

  doc.querySelectorAll('.brand-wordmark').forEach((wordmark) => {
    wordmark.setAttribute('aria-label', BRAND_NAME);
    wordmark.textContent = BRAND_NAME;
  });

  replaceBrandText(doc);

  applyConnectedWho(doc);

  rewriteHolusPolicies(doc);

  const nutritionEducationTitle = [...doc.querySelectorAll('main h2')]
    .find((heading) => heading.textContent.trim() === 'Nutrition education you can use.');
  nutritionEducationTitle?.closest('section')?.remove();

  if (doc.querySelector('#home')) doc.querySelector('.faq')?.remove();

  doc.querySelectorAll('[aria-label]').forEach((element) => {
    element.setAttribute('aria-label', element.getAttribute('aria-label').replaceAll('Hōlus Nutrition Counselling', FORMAL_NAME));
  });

  applyLivingNetwork(doc, pageFrame.contentWindow);

  document.documentElement.classList.add('ready');
}

function connectToCurrentSite() {
  const shellDocument = shellFrame.contentDocument;
  const nestedFrame = shellDocument?.querySelector('#brand-site');

  if (!nestedFrame) {
    requestAnimationFrame(() => applyHolusBrand(shellFrame));
    return;
  }

  const pageFrame = nestedFrame;

  shellDocument.title = shellDocument.title.replaceAll('Hōlus Nutrition Counselling', BRAND_NAME);
  pageFrame.setAttribute('title', `${BRAND_NAME} ${BRAND_DESCRIPTOR} website`);

  const rebrand = () => requestAnimationFrame(() => applyHolusBrand(pageFrame));
  pageFrame.addEventListener('load', rebrand);
  rebrand();
}

shellFrame.addEventListener('load', connectToCurrentSite);
