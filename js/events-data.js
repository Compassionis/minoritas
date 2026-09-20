/* ============================================
   PROSSIMI EVENTI — modifica solo qui sotto
   Non serve toccare nessun altro file.

   Per ogni evento, compila:
   giorno    -> numero del giorno (es. "31")
   mese      -> mese in maiuscolo (es. "AGOSTO")
   titolo    -> nome dell'evento
   luogo     -> luogo dell'evento
   link      -> pagina di dettaglio (es. articolo del blog)

   Per aggiungere un evento, copia un intero blocco { ... },
   incollalo prima della parentesi quadra finale "]" e
   aggiungi una virgola dopo il blocco precedente.

   Per togliere un evento, cancella l'intero blocco { ... }.
   ============================================ */

const EVENTI = [
  {
    giornoInizio: "03",
    giornoFine: "",
    mese: "OTTOBRE",
    titolo: "Ottavo centenario della morte di San Francesco di Assisi",
    luogo: "Chiesa di Saint-Étienne-de-Bargemon",
    link: "../assets/evento-3-ottobre.jpg",
    nuovaFinestra: true
  },
  {
    giornoInizio: "11",
    giornoFine: "",
    mese: "OTTOBRE",
    titolo: "Pranzo assieme ai Francescani",
    luogo: "Roc-Estello - Plan-d'Aups-Sainte-Baume",
    link: "../assets/evento-11-ottobre.jpg",
    nuovaFinestra: true
  },
  {
    giornoInizio: "20",
    giornoFine: "22",
    mese: "DICEMBRE",
    titolo: "Ritiro \"GRECCIO\" per ragazzi",
    luogo: "Roc-Estello - Plan-d'Aups-Sainte-Baume",
    link: "blog.html"
  }
];
