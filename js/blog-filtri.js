// Blog: filtro per categoria, ricerca testuale e paginazione, tutto lato client.
// Le card nella griglia e la card in evidenza portano data-categoria, data-titolo e data-testo.
// Le card che non corrispondono a filtro o ricerca vengono nascoste; le altre sono divise in pagine
// (numero di card per pagina: attributo data-per-pagina su #blog-griglia).
// La card in evidenza compare solo in pagina 1.

// Ricerca insensibile a maiuscole e accenti (es. "spiritualite" trova "spiritualité")
const normalizza = (t) => (t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const TESTI_PAGINAZIONE = {
  it: { prec: 'Pagina precedente', succ: 'Pagina successiva', pagina: 'Pagina' },
  fr: { prec: 'Page précédente', succ: 'Page suivante', pagina: 'Page' },
  en: { prec: 'Previous page', succ: 'Next page', pagina: 'Page' }
};
const FRECCIA_SX = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M14 8H3M7 4L3 8l4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const FRECCIA_DX = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

document.addEventListener('DOMContentLoaded', () => {
  const pulsantiFiltro = document.querySelectorAll('.filtro-pill');
  const campoRicerca = document.getElementById('blog-search');
  const card = document.querySelectorAll('.blog-card[data-categoria]');
  const griglia = document.getElementById('blog-griglia');
  const navPagine = document.getElementById('blog-paginazione');
  const messaggioVuoto = document.getElementById('blog-vuoto');

  if (!pulsantiFiltro.length || !card.length) return;

  const lingua = (document.documentElement.lang || 'it').slice(0, 2);
  const T = TESTI_PAGINAZIONE[lingua] || TESTI_PAGINAZIONE.it;
  const perPagina = parseInt(griglia && griglia.dataset.perPagina, 10) || 6;

  let categoriaAttiva = 'tutti';
  let paginaCorrente = 1;

  function numeriPagina(totale, corrente) {
    if (totale <= 7) return Array.from({ length: totale }, (_, i) => i + 1);
    const set = new Set([1, totale, corrente - 1, corrente, corrente + 1]);
    const lista = [...set].filter((n) => n >= 1 && n <= totale).sort((a, b) => a - b);
    const out = [];
    lista.forEach((n, i) => {
      if (i && n - lista[i - 1] > 1) out.push('...');
      out.push(n);
    });
    return out;
  }

  function disegnaPaginazione(totale) {
    if (!navPagine) return;
    if (totale <= 1) { navPagine.hidden = true; navPagine.innerHTML = ''; return; }
    navPagine.hidden = false;
    let html = `<button type="button" class="pag-btn" data-vai="${paginaCorrente - 1}" aria-label="${T.prec}"${paginaCorrente === 1 ? ' disabled' : ''}>${FRECCIA_SX}</button>`;
    numeriPagina(totale, paginaCorrente).forEach((n) => {
      if (n === '...') { html += '<span class="pag-punti" aria-hidden="true">…</span>'; return; }
      const attivo = n === paginaCorrente;
      html += `<button type="button" class="pag-btn${attivo ? ' is-attivo' : ''}" data-vai="${n}" aria-label="${T.pagina} ${n}"${attivo ? ' aria-current="page"' : ''}>${n}</button>`;
    });
    html += `<button type="button" class="pag-btn" data-vai="${paginaCorrente + 1}" aria-label="${T.succ}"${paginaCorrente === totale ? ' disabled' : ''}>${FRECCIA_DX}</button>`;
    navPagine.innerHTML = html;
  }

  function applicaFiltri(reset) {
    if (reset) paginaCorrente = 1;
    const termine = normalizza((campoRicerca && campoRicerca.value || '').trim());
    const corrispondenti = [];
    const corrispondentiGriglia = [];

    card.forEach((c) => {
      const categorieCard = (c.dataset.categoria || '').split(/\s+/);
      const categoriaOk = categoriaAttiva === 'tutti' || categorieCard.includes(categoriaAttiva);
      const testo = (c.dataset.testo || '') + ' ' + (c.dataset.titolo || '');
      const ricercaOk = !termine || normalizza(testo).includes(termine);
      const ok = categoriaOk && ricercaOk;
      if (ok) {
        corrispondenti.push(c);
        if (griglia && griglia.contains(c)) corrispondentiGriglia.push(c);
      }
      c.style.display = 'none';
    });

    const totalePagine = Math.max(1, Math.ceil(corrispondentiGriglia.length / perPagina));
    if (paginaCorrente > totalePagine) paginaCorrente = totalePagine;

    corrispondenti.forEach((c) => {
      if (!griglia || !griglia.contains(c)) {
        c.style.display = paginaCorrente === 1 ? '' : 'none';   // card in evidenza: solo pagina 1
      }
    });
    const inizio = (paginaCorrente - 1) * perPagina;
    corrispondentiGriglia.slice(inizio, inizio + perPagina).forEach((c) => { c.style.display = ''; });

    disegnaPaginazione(totalePagine);
    if (messaggioVuoto) messaggioVuoto.hidden = corrispondenti.length > 0;
  }

  pulsantiFiltro.forEach((btn) => {
    btn.addEventListener('click', () => {
      pulsantiFiltro.forEach((b) => b.classList.remove('is-attivo'));
      btn.classList.add('is-attivo');
      categoriaAttiva = btn.dataset.categoria;
      applicaFiltri(true);
    });
  });

  if (campoRicerca) campoRicerca.addEventListener('input', () => applicaFiltri(true));

  if (navPagine) {
    navPagine.addEventListener('click', (e) => {
      const b = e.target.closest('[data-vai]');
      if (!b || b.disabled) return;
      paginaCorrente = parseInt(b.dataset.vai, 10);
      applicaFiltri(false);
      if (griglia) griglia.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  applicaFiltri(true);
});
