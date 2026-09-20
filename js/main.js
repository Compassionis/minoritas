// Menu mobile
const menuToggle = document.querySelector('.menu-toggle');
const siteHeader = document.querySelector('.site-header');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    siteHeader.classList.toggle('menu-open');
    const expanded = siteHeader.classList.contains('menu-open');
    menuToggle.setAttribute('aria-expanded', expanded);
  });
}

// Header: trasparente sulla foto in cima, solido bianco appena si scrolla
function initHeaderScroll() {
  if (!siteHeader) return;
  const SOGLIA = 60;

  function aggiorna() {
    if (window.scrollY > SOGLIA) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
  }

  aggiorna();
  window.addEventListener('scroll', aggiorna, { passive: true });
}

document.addEventListener('DOMContentLoaded', initHeaderScroll);

// Render card eventi dalla lista in events-data.js
function renderEventi() {
  const contenitore = document.querySelector('[data-eventi-lista]');
  if (!contenitore || typeof EVENTI === 'undefined') return;

  contenitore.innerHTML = EVENTI.map(ev => {
    const data = ev.giornoFine ? `${ev.giornoInizio}-${ev.giornoFine}` : ev.giornoInizio;
    return `
    <a class="evento-card" href="${ev.link}"${ev.nuovaFinestra ? ' target="_blank" rel="noopener"' : ''}>
      <div class="evento-data">
        <span class="giorno">${data}</span>
        <span class="mese">${ev.mese}</span>
      </div>
      <div class="evento-info">
        <h4>${ev.titolo}</h4>
        <span><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>${ev.luogo}</span>
      </div>
      <div class="evento-freccia">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </div>
    </a>
  `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', renderEventi);

// Micro-animazioni in entrata: le sezioni compaiono con una leggera dissolvenza
// verso l'alto quando entrano nella parte visibile dello schermo.
function initReveal() {
  const elementi = document.querySelectorAll('.reveal');
  if (!elementi.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    elementi.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const osservatore = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        osservatore.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  elementi.forEach(el => osservatore.observe(el));
}

document.addEventListener('DOMContentLoaded', initReveal);

// Parallax: le foto orizzontali e a metà colonna sono leggermente più grandi
// del loro contenitore e si spostano allo scroll, rivelando più immagine.
function initParallax() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const immagini = document.querySelectorAll('.parallax-img');
  if (!immagini.length) return;

  const FORZA = 80; // escursione massima in px, in ciascuna direzione
  let ticking = false;

  function aggiorna() {
    const vh = window.innerHeight;
    immagini.forEach(img => {
      const contenitore = img.parentElement;
      const rect = contenitore.getBoundingClientRect();
      // progresso 0 -> il contenitore entra dal basso, 1 -> esce dall'alto
      let progresso = (vh - rect.top) / (vh + rect.height);
      progresso = Math.min(Math.max(progresso, 0), 1);
      const spostamento = (progresso - 0.5) * FORZA * 2;
      img.style.transform = `translateY(${spostamento}px)`;
    });
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(aggiorna);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  aggiorna();
}

document.addEventListener('DOMContentLoaded', initParallax);

// Dropdown di navigazione: resta aperto finché il cursore è nella zona,
// con un piccolo ritardo alla chiusura per non sparire durante il movimento.
function initNavDropdown() {
  document.querySelectorAll('.nav-item-dropdown').forEach((voce) => {
    let timer = null;
    const apri = () => {
      clearTimeout(timer);
      voce.classList.add('is-open');
    };
    const chiudi = () => {
      timer = setTimeout(() => voce.classList.remove('is-open'), 250);
    };
    voce.addEventListener('mouseenter', apri);
    voce.addEventListener('mouseleave', chiudi);
    voce.addEventListener('focusin', apri);
    voce.addEventListener('focusout', chiudi);
  });
}
document.addEventListener('DOMContentLoaded', initNavDropdown);

// Menu mobile: accordion per le sottovoci (Spiritualità, Vocazioni)
function initMobileAccordion() {
  const righe = document.querySelectorAll('.mobile-menu .m-row');
  const lista = document.querySelector('.mobile-menu .m-list');
  if (!righe.length) return;

  righe.forEach((riga) => {
    riga.addEventListener('click', () => {
      const voce = riga.parentElement;
      const eraAperta = voce.classList.contains('is-open');
      document.querySelectorAll('.mobile-menu .m-item').forEach((v) => v.classList.remove('is-open'));
      if (!eraAperta) {
        voce.classList.add('is-open');
        if (lista) lista.classList.add('has-open');
      } else if (lista) {
        lista.classList.remove('has-open');
      }
    });
  });
}
document.addEventListener('DOMContentLoaded', initMobileAccordion);
