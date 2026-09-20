// Blog: filtro per categoria + ricerca testuale, tutto lato client.
// Le card nella griglia e la card in evidenza portano data-categoria e data-testo:
// se una card non corrisponde al filtro attivo o alla ricerca, viene nascosta.

// Ricerca insensibile a maiuscole e accenti (es. "spiritualite" trova "spiritualité")
const normalizza = (t) => (t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

document.addEventListener('DOMContentLoaded', () => {
  const pulsantiFiltro = document.querySelectorAll('.filtro-pill');
  const campoRicerca = document.getElementById('blog-search');
  const card = document.querySelectorAll('.blog-card[data-categoria]');
  const messaggioVuoto = document.getElementById('blog-vuoto');

  if (!pulsantiFiltro.length || !card.length) return;

  let categoriaAttiva = 'tutti';

  function applicaFiltri() {
    const termine = normalizza((campoRicerca && campoRicerca.value || '').trim());
    let visibili = 0;

    card.forEach((c) => {
      const categorieCard = (c.dataset.categoria || '').split(/\s+/);
      const categoriaOk = categoriaAttiva === 'tutti' || categorieCard.includes(categoriaAttiva);
      const testo = (c.dataset.testo || '') + ' ' + (c.dataset.titolo || '');
      const ricercaOk = !termine || normalizza(testo).includes(termine);
      const visibile = categoriaOk && ricercaOk;
      c.style.display = visibile ? '' : 'none';
      if (visibile) visibili++;
    });

    if (messaggioVuoto) messaggioVuoto.hidden = visibili > 0;
  }

  pulsantiFiltro.forEach((btn) => {
    btn.addEventListener('click', () => {
      pulsantiFiltro.forEach((b) => b.classList.remove('is-attivo'));
      btn.classList.add('is-attivo');
      categoriaAttiva = btn.dataset.categoria;
      applicaFiltri();
    });
  });

  if (campoRicerca) {
    campoRicerca.addEventListener('input', applicaFiltri);
  }
});
