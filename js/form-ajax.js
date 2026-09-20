// Gestione invio form (Netlify Forms) via AJAX, con modale di conferma
// al posto del redirect di pagina predefinito.

// Messaggi di errore per lingua (la lingua è quella dell'attributo <html lang>)
const MSG = {
  it: {
    vuoto: 'Indica almeno una Messa, una Novena o una Trentena (il numero non può essere zero per tutti).',
    invio: 'Non è stato possibile inviare la richiesta. Riprova tra poco o scrivici direttamente a nd.septdouleurs@gmail.com.'
  },
  fr: {
    vuoto: 'Indiquez au moins une messe, une neuvaine ou un trentain (le nombre ne peut pas être nul pour tous).',
    invio: 'L\u2019envoi de votre demande n\u2019a pas abouti. Veuillez r\u00e9essayer dans quelques instants ou nous \u00e9crire directement \u00e0 nd.septdouleurs@gmail.com.'
  },
  en: {
    vuoto: 'Please enter at least one Mass, one novena or one Gregorian trental (the number cannot be zero for all).',
    invio: 'Your request could not be sent. Please try again shortly or write to us directly at nd.septdouleurs@gmail.com.'
  }
};
function msg(chiave) {
  const lingua = (document.documentElement.lang || 'it').slice(0, 2);
  return (MSG[lingua] || MSG.it)[chiave];
}

function encodeFormData(form) {
  const formData = new FormData(form);
  return new URLSearchParams(formData).toString();
}

function mostraModale() {
  const modale = document.getElementById('modale-conferma');
  if (!modale) return;
  modale.hidden = false;
  document.body.style.overflow = 'hidden';
}

function nascondiModale() {
  const modale = document.getElementById('modale-conferma');
  if (!modale) return;
  modale.hidden = true;
  document.body.style.overflow = '';
}

function initModale() {
  const modale = document.getElementById('modale-conferma');
  if (!modale) return;
  const chiudi = modale.querySelector('.modale-chiudi');
  if (chiudi) chiudi.addEventListener('click', nascondiModale);
  modale.addEventListener('click', (e) => {
    if (e.target === modale) nascondiModale();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modale.hidden) nascondiModale();
  });
}

function initFormAjax(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  const errore = form.querySelector('.form-errore');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (errore) { errore.classList.remove('is-visible'); errore.textContent = ''; }

    // Per il form Messe: almeno una tra Messe/Novene/Trentene deve essere >= 1
    if (formId === 'form-messa') {
      const messe = parseInt(form.querySelector('[name="numero_messe"]').value, 10) || 0;
      const novene = parseInt(form.querySelector('[name="numero_novene"]').value, 10) || 0;
      const trentene = parseInt(form.querySelector('[name="numero_trentene"]').value, 10) || 0;
      if (messe + novene + trentene < 1) {
        if (errore) {
          errore.textContent = msg('vuoto');
          errore.classList.add('is-visible');
        }
        return;
      }
    }

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeFormData(form)
    })
      .then((response) => {
        if (response.ok) {
          form.reset();
          if (window.grecaptcha) window.grecaptcha.reset();
          mostraModale();
        } else {
          throw new Error('Invio non riuscito');
        }
      })
      .catch(() => {
        if (errore) {
          errore.textContent = msg('invio');
          errore.classList.add('is-visible');
        }
      });
  });
}

function initSteppers() {
  document.querySelectorAll('.stepper-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input[type="number"]');
      if (!input) return;
      const step = parseInt(btn.dataset.step, 10);
      const min = parseInt(input.min || '0', 10);
      const max = parseInt(input.max || '99', 10);
      const nuovo = Math.min(max, Math.max(min, (parseInt(input.value, 10) || 0) + step));
      input.value = nuovo;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initModale();
  initFormAjax('form-preghiera');
  initFormAjax('form-messa');
  initSteppers();
});
