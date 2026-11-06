/* =========================================================
   Coccole di Neve — dati del negozio
   Modifica qui prodotti, categorie, recensioni e impostazioni.
   ========================================================= */

const CONFIG = {
  nomeNegozio: 'Coccole di Neve',
  valuta: '€',
  sogliaSpedizioneGratuita: 49,
  costoSpedizione: 4.9,
  costoPacchettoRegalo: 3.5,
  // Giorni lavorativi di consegna del fornitore (dropshipping)
  consegnaMin: 4,
  consegnaMax: 8,
  // Ultimo giorno utile per ordinare e ricevere entro Natale
  ultimoOrdineNatale: { mese: 12, giorno: 15 },
  prodottiPerPagina: 8,
  recensioniPerPagina: 6,
  // URL del checkout (es. Shopify, Stripe Payment Link). Vuoto = messaggio dimostrativo.
  checkoutUrl: '',
  // Le recensioni qui sotto sono ESEMPI per l'anteprima del sito.
  // Prima di andare online mettile a false e usa solo recensioni reali dei clienti.
  mostraRecensioniEsempio: true,
  email: 'ciao@coccoledineve.it'
};

const CATEGORIE = [
  {
    id: 'amuseables',
    nome: 'Amuseables di Natale',
    breve: 'Amuseables',
    descrizione: 'Alberelli, pudding e palline con le gambette in velluto: le decorazioni più morbide che ci siano.',
    bg: 'var(--mint)',
    tipo: 'tree'
  },
  {
    id: 'animali-delle-nevi',
    nome: 'Animali delle nevi',
    breve: 'Animali delle nevi',
    descrizione: 'Renne timide, orsi polari e pinguini pronti a scaldare le notti d’inverno.',
    bg: 'var(--sky)',
    tipo: 'polarbear'
  },
  {
    id: 'orsetti-e-amici',
    nome: 'Orsetti & amici',
    breve: 'Orsetti & amici',
    descrizione: 'Gli amici di sempre, vestiti a festa con maglioni, sciarpe e cappellini.',
    bg: 'var(--blush)',
    tipo: 'bear'
  }
];

const PRODOTTI = [
  // ---------- Amuseables di Natale ----------
  {
    id: 'amuseable-albero-di-natale',
    nome: 'Amuseable Albero di Natale',
    categoria: 'amuseables',
    prezzo: 32,
    taglia: 'Medio · 26 cm',
    badge: 'Bestseller',
    tipo: 'tree',
    bg: 'var(--mint)',
    descrizione: 'Un abete sorridente con stella dorata, palline ricamate e due gambette in velluto a coste. Sta in piedi da solo sotto l’albero… quello vero.',
    dettagli: ['Peluche super morbido con dettagli ricamati', 'Gambette in velluto a coste', 'Adatto dalla nascita', 'Lavabile a mano a 30°']
  },
  {
    id: 'amuseable-christmas-pudding',
    nome: 'Amuseable Christmas Pudding',
    categoria: 'amuseables',
    prezzo: 29,
    taglia: 'Piccolo · 15 cm',
    badge: 'Novità',
    tipo: 'pudding',
    bg: 'var(--butter)',
    descrizione: 'Il dolce più goloso delle feste: glassa cremosa, foglioline di agrifoglio e bacche rosse. Zero calorie, solo coccole.',
    dettagli: ['Glassa in morbido pile', 'Agrifoglio in feltro', 'Adatto dalla nascita', 'Lavabile a mano a 30°']
  },
  {
    id: 'amuseable-cavoletto',
    nome: 'Amuseable Cavoletto di Bruxelles',
    categoria: 'amuseables',
    prezzo: 24,
    taglia: 'Piccolo · 12 cm',
    tipo: 'sprout',
    bg: 'var(--mint)',
    descrizione: 'Lo scartano tutti a tavola, ma nessuno riesce a resistergli in versione peluche. Foglie a strati e un sorriso irresistibile.',
    dettagli: ['Foglie a strati in velluto', 'Gambette in velluto a coste', 'Adatto dalla nascita', 'Lavabile a mano a 30°']
  },
  {
    id: 'amuseable-bastoncino-di-zucchero',
    nome: 'Amuseable Bastoncino di Zucchero',
    categoria: 'amuseables',
    prezzo: 27,
    taglia: 'Medio · 28 cm',
    badge: 'Ultimi pezzi',
    tipo: 'candycane',
    bg: 'var(--blush)',
    descrizione: 'A righe bianche e rosse, curvo al punto giusto per appendersi all’albero o al braccio di chi lo ama.',
    dettagli: ['Righe in peluche bicolore', 'Gancio imbottito', 'Adatto dai 12 mesi', 'Lavabile a mano a 30°']
  },
  {
    id: 'amuseable-cioccolata-calda',
    nome: 'Amuseable Cioccolata Calda',
    categoria: 'amuseables',
    prezzo: 29,
    taglia: 'Piccolo · 14 cm',
    tipo: 'cocoa',
    bg: 'var(--butter)',
    descrizione: 'Una tazza fumante con marshmallow morbidosi. Da tenere stretta nelle sere di neve davanti al camino.',
    dettagli: ['Marshmallow in pile', 'Manico imbottito', 'Adatto dalla nascita', 'Lavabile a mano a 30°']
  },
  {
    id: 'amuseable-pallina-rossa',
    nome: 'Amuseable Pallina di Natale Rossa',
    categoria: 'amuseables',
    prezzo: 22,
    taglia: 'Piccolo · 11 cm',
    badge: 'Bestseller',
    tipo: 'bauble',
    colori: { corpo: '#d9474f', scuro: '#b8343d' },
    bg: 'var(--blush)',
    descrizione: 'La decorazione che non si rompe mai. Lucida, tonda e con un fiocchetto per appenderla.',
    dettagli: ['Tessuto effetto satinato', 'Laccetto per appenderla', 'Adatto dalla nascita', 'Lavabile a mano a 30°']
  },
  {
    id: 'amuseable-pallina-verde',
    nome: 'Amuseable Pallina di Natale Verde',
    categoria: 'amuseables',
    prezzo: 22,
    taglia: 'Piccolo · 11 cm',
    tipo: 'bauble',
    colori: { corpo: '#4f9a73', scuro: '#3a7c5a' },
    bg: 'var(--mint)',
    descrizione: 'Sorella verde della pallina rossa: insieme fanno l’albero più tenero del quartiere.',
    dettagli: ['Tessuto effetto satinato', 'Laccetto per appenderla', 'Adatto dalla nascita', 'Lavabile a mano a 30°']
  },
  {
    id: 'amuseable-pupazzo-di-neve',
    nome: 'Amuseable Pupazzo di Neve',
    categoria: 'amuseables',
    prezzo: 34,
    taglia: 'Medio · 24 cm',
    badge: 'Novità',
    tipo: 'snowman',
    bg: 'var(--sky)',
    descrizione: 'Non si scioglie nemmeno vicino al termosifone. Sciarpa rossa a righe, naso a carota e guanciotte rosa.',
    dettagli: ['Peluche bianco extra soffice', 'Sciarpa in maglia rimovibile', 'Adatto dalla nascita', 'Lavabile a mano a 30°']
  },
  {
    id: 'amuseable-stella',
    nome: 'Amuseable Stella Cometa',
    categoria: 'amuseables',
    prezzo: 26,
    taglia: 'Medio · 20 cm',
    tipo: 'star',
    bg: 'var(--butter)',
    descrizione: 'Una stellina dorata e luccicante che preferisce stare tra le braccia piuttosto che in cima all’albero.',
    dettagli: ['Tessuto dorato glitterato', 'Gambette in velluto a coste', 'Adatto dai 12 mesi', 'Lavabile a mano a 30°']
  },
  // ---------- Animali delle nevi ----------
  {
    id: 'renna-timida',
    nome: 'Renna Timida',
    categoria: 'animali-delle-nevi',
    prezzo: 36,
    taglia: 'Medio · 31 cm',
    badge: 'Bestseller',
    tipo: 'reindeer',
    bg: 'var(--butter)',
    descrizione: 'Lunghe zampe morbide, corna di velluto e un nasino rosso che si illumina… di simpatia. La compagna perfetta della Vigilia.',
    dettagli: ['Pelo extra morbido', 'Corna in velluto beige', 'Adatto dalla nascita', 'Lavabile a mano a 30°']
  },
  {
    id: 'orso-polare-fiocco',
    nome: 'Orso Polare Fiocco',
    categoria: 'animali-delle-nevi',
    prezzo: 38,
    taglia: 'Medio · 28 cm',
    tipo: 'polarbear',
    bg: 'var(--sky)',
    descrizione: 'Un orsone candido dal pelo lunghissimo, con una sciarpina verde per non prendere freddo.',
    dettagli: ['Pelo lungo effetto neve', 'Sciarpa in maglia', 'Adatto dalla nascita', 'Lavabile a mano a 30°']
  },
  {
    id: 'pinguino-pingui',
    nome: 'Pinguino Pinguì',
    categoria: 'animali-delle-nevi',
    prezzo: 28,
    taglia: 'Piccolo · 18 cm',
    badge: 'Novità',
    tipo: 'penguin',
    bg: 'var(--sky)',
    descrizione: 'Paffuto, dondolante e con una sciarpa rossa a righe: Pinguì arriva dritto dal Polo Sud per le feste.',
    dettagli: ['Pancino bianco in pile', 'Becco e zampette ricamati', 'Adatto dalla nascita', 'Lavabile a mano a 30°']
  },
  {
    id: 'volpe-artica',
    nome: 'Volpe Artica',
    categoria: 'animali-delle-nevi',
    prezzo: 34,
    taglia: 'Medio · 25 cm',
    tipo: 'fox',
    bg: 'var(--lilac)',
    descrizione: 'Codona soffice e orecchie a punta: la volpe delle nevi è elegante, curiosa e dolcissima.',
    dettagli: ['Coda extra voluminosa', 'Pelo bianco perlato', 'Adatto dai 12 mesi', 'Lavabile a mano a 30°']
  },
  {
    id: 'gufo-delle-nevi',
    nome: 'Gufo delle Nevi',
    categoria: 'animali-delle-nevi',
    prezzo: 30,
    taglia: 'Piccolo · 18 cm',
    tipo: 'owl',
    bg: 'var(--sky)',
    descrizione: 'Rotondo come una palla di neve, con le piume punteggiate e gli occhioni grandi per vegliare sui sogni.',
    dettagli: ['Piume ricamate', 'Base stabile per stare seduto', 'Adatto dalla nascita', 'Lavabile a mano a 30°']
  },
  // ---------- Orsetti & amici ----------
  {
    id: 'orsetto-bartolomeo-maglione',
    nome: 'Orsetto Bartolomeo col Maglione',
    categoria: 'orsetti-e-amici',
    prezzo: 42,
    prezzoPrima: 48,
    taglia: 'Medio · 33 cm',
    badge: 'Edizione Natale',
    tipo: 'bear',
    bg: 'var(--blush)',
    descrizione: 'L’orsetto più abbracciato di sempre indossa il suo maglione natalizio rosso con fiocchi di neve. Un classico da tramandare.',
    dettagli: ['Maglione in maglia rimovibile', 'Muso ricamato', 'Adatto dalla nascita', 'Lavabile a mano a 30°']
  },
  {
    id: 'topolino-natalino',
    nome: 'Topolino Natalino',
    categoria: 'orsetti-e-amici',
    prezzo: 25,
    taglia: 'Piccolo · 18 cm',
    tipo: 'mouse',
    bg: 'var(--lilac)',
    descrizione: 'Grandi orecchie rosa e un cappellino da Babbo Natale: il topolino che sbircia i regali la notte della Vigilia.',
    dettagli: ['Cappellino in feltro', 'Coda lunga e morbida', 'Adatto dai 12 mesi', 'Lavabile a mano a 30°']
  },
  {
    id: 'coniglietto-fiocco-di-neve',
    nome: 'Coniglietto Fiocco di Neve',
    categoria: 'orsetti-e-amici',
    prezzo: 33,
    taglia: 'Medio · 31 cm',
    badge: 'Bestseller',
    tipo: 'bunny',
    bg: 'var(--mint)',
    descrizione: 'Orecchie lunghissime e un fiocco rosso al collo: il coniglietto timido è il regalo che fa sciogliere chiunque.',
    dettagli: ['Orecchie lunghe in pile', 'Fiocco in raso', 'Adatto dalla nascita', 'Lavabile a mano a 30°']
  },
  {
    id: 'omino-pan-di-zenzero',
    nome: 'Omino di Pan di Zenzero',
    categoria: 'orsetti-e-amici',
    prezzo: 27,
    taglia: 'Medio · 24 cm',
    badge: 'Novità',
    tipo: 'gingerbread',
    bg: 'var(--butter)',
    descrizione: 'Profuma di biscotto (solo nella fantasia): glassa ricamata, bottoncini colorati e un sorriso appena sfornato.',
    dettagli: ['Glassa ricamata a mano', 'Bottoni in feltro', 'Adatto dalla nascita', 'Lavabile a mano a 30°']
  }
];

// Recensioni di ESEMPIO (vedi CONFIG.mostraRecensioniEsempio)
const RECENSIONI = [
  { prodotto: 'amuseable-albero-di-natale', nome: 'Giulia M.', citta: 'Milano', voto: 5, titolo: 'Ha conquistato tutta la famiglia', testo: 'L’ho preso per mia nipote ma ora sta sotto il nostro albero. È morbidissimo e le gambette sono adorabili. Arrivato ben imballato.', data: '2025-12-03' },
  { prodotto: 'amuseable-albero-di-natale', nome: 'Paolo R.', citta: 'Torino', voto: 4, titolo: 'Bellissimo, consegna un po’ lunga', testo: 'Qualità ottima, identico alle foto. Ci ha messo 7 giorni lavorativi, quindi consiglio di ordinare per tempo.', data: '2025-12-10' },
  { prodotto: 'renna-timida', nome: 'Sara L.', citta: 'Bologna', voto: 5, titolo: 'La renna più dolce del mondo', testo: 'Mio figlio non se ne separa più, ci dorme ogni notte. Il naso rosso ricamato è un dettaglio delizioso.', data: '2025-12-01' },
  { prodotto: 'renna-timida', nome: 'Chiara B.', citta: 'Roma', voto: 5, titolo: 'Regalo perfetto', testo: 'Presa come regalo di Natale per la mia migliore amica (adulta!) che colleziona peluche. Ha pianto di gioia.', data: '2025-11-28' },
  { prodotto: 'orsetto-bartolomeo-maglione', nome: 'Francesca D.', citta: 'Firenze', voto: 5, titolo: 'Un classico intramontabile', testo: 'Il maglione si può togliere ed è fatto benissimo. L’orsetto è grande e pesante al punto giusto, sembra di abbracciare una nuvola.', data: '2025-12-06' },
  { prodotto: 'orsetto-bartolomeo-maglione', nome: 'Marco T.', citta: 'Verona', voto: 4, titolo: 'Molto bello', testo: 'Bellissimo orsetto, avrei preferito un pacchetto regalo un po’ più curato ma il peluche è perfetto.', data: '2025-12-12' },
  { prodotto: 'amuseable-christmas-pudding', nome: 'Elena V.', citta: 'Napoli', voto: 5, titolo: 'Troppo carino!', testo: 'L’ho messo al centro della tavola della Vigilia ed è stato il protagonista delle foto di famiglia. Le bacche rosse sono stupende.', data: '2025-12-20' },
  { prodotto: 'coniglietto-fiocco-di-neve', nome: 'Alessia P.', citta: 'Bari', voto: 5, titolo: 'Morbidezza incredibile', testo: 'Le orecchie lunghe sono la parte preferita di mia figlia. Il fiocco rosso lo rende perfetto per Natale ma va bene tutto l’anno.', data: '2025-11-30' },
  { prodotto: 'coniglietto-fiocco-di-neve', nome: 'Luca F.', citta: 'Genova', voto: 5, titolo: 'Primo Natale della nostra bimba', testo: 'Scelto per il suo primo Natale, adatto dalla nascita e super morbido. Lo consiglio a tutti i neogenitori.', data: '2025-12-15' },
  { prodotto: 'pinguino-pingui', nome: 'Martina G.', citta: 'Padova', voto: 5, titolo: 'Pinguì è un amore', testo: 'Più piccolo di quanto pensassi ma proprio per questo perfetto da portare in borsa. La sciarpa a righe è carinissima.', data: '2025-12-04' },
  { prodotto: 'amuseable-pupazzo-di-neve', nome: 'Roberta S.', citta: 'Trento', voto: 5, titolo: 'Non si scioglie davvero', testo: 'Il bianco è candido e il pelo morbidissimo. La sciarpa si toglie, quindi si lava facilmente. Ne ho presi due!', data: '2025-12-08' },
  { prodotto: 'amuseable-cioccolata-calda', nome: 'Davide C.', citta: 'Parma', voto: 4, titolo: 'Simpaticissima', testo: 'I marshmallow sono adorabili. L’ho regalata alla mia ragazza che ama la cioccolata calda: centro pieno.', data: '2025-12-18' },
  { prodotto: 'amuseable-pallina-rossa', nome: 'Valentina N.', citta: 'Palermo', voto: 5, titolo: 'Decorazione a prova di bimbo', testo: 'Finalmente una pallina che il gatto non può rompere! L’abbiamo appesa all’albero ed è bellissima.', data: '2025-12-02' },
  { prodotto: 'volpe-artica', nome: 'Irene Z.', citta: 'Udine', voto: 5, titolo: 'Elegantissima', testo: 'La coda è enorme e soffice. È diventata la mascotte del mio studio. Ottimo anche il servizio clienti, rispondono subito.', data: '2025-11-25' },
  { prodotto: 'gufo-delle-nevi', nome: 'Simone A.', citta: 'Perugia', voto: 4, titolo: 'Carino e ben fatto', testo: 'Le piume ricamate sono un bel dettaglio, sta seduto da solo sulla mensola. Consegna in 6 giorni.', data: '2025-12-09' },
  { prodotto: 'topolino-natalino', nome: 'Beatrice O.', citta: 'Cagliari', voto: 5, titolo: 'Le orecchie!!', testo: 'Le orecchie rosa sono la cosa più tenera che abbia mai visto. Il cappellino da Babbo Natale è cucito benissimo.', data: '2025-12-11' },
  { prodotto: 'omino-pan-di-zenzero', nome: 'Federico L.', citta: 'Bergamo', voto: 5, titolo: 'Appena sfornato', testo: 'Sembra davvero un biscotto! I bottoncini colorati e la glassa ricamata sono fatti con cura.', data: '2025-12-14' },
  { prodotto: 'amuseable-cavoletto', nome: 'Noemi R.', citta: 'Lecce', voto: 5, titolo: 'Ironico e tenerissimo', testo: 'Regalato al mio papà che odia i cavoletti: ha riso per mezz’ora e ora lo tiene in macchina.', data: '2025-12-21' },
  { prodotto: 'orso-polare-fiocco', nome: 'Giorgia E.', citta: 'Bolzano', voto: 5, titolo: 'Un orso nuvola', testo: 'Il pelo lungo è morbidissimo e non perde. È grande il giusto per essere abbracciato la notte.', data: '2025-12-05' },
  { prodotto: 'amuseable-stella', nome: 'Tommaso I.', citta: 'Ancona', voto: 4, titolo: 'Brilla davvero', testo: 'Il tessuto dorato è luccicante e di qualità. Un pelo più piccola del previsto ma bellissima.', data: '2025-12-16' },
  { prodotto: 'amuseable-bastoncino-di-zucchero', nome: 'Laura K.', citta: 'Pisa', voto: 5, titolo: 'Righe perfette', testo: 'Lo appendiamo alla porta della cameretta. Morbido, colorato e molto ben rifinito.', data: '2025-12-07' }
];

const GUIDA_REGALI = [
  {
    id: 'primo-natale',
    titolo: 'Per il primo Natale',
    testo: 'Peluche adatti dalla nascita, morbidissimi e sicuri per le manine più piccole.',
    bg: 'var(--mint)',
    tipo: 'bunny',
    prodotti: ['coniglietto-fiocco-di-neve', 'amuseable-pupazzo-di-neve', 'gufo-delle-nevi', 'amuseable-christmas-pudding']
  },
  {
    id: 'sotto-30',
    titolo: 'Sotto i 30 €',
    testo: 'Pensierini perfetti per la calza, il Secret Santa o il collega simpatico.',
    bg: 'var(--butter)',
    tipo: 'bauble',
    filtro: p => p.prezzo < 30
  },
  {
    id: 'collezionisti',
    titolo: 'Per chi colleziona',
    testo: 'Edizioni natalizie e novità di stagione da aggiungere alla mensola dei sogni.',
    bg: 'var(--blush)',
    tipo: 'bear',
    prodotti: ['orsetto-bartolomeo-maglione', 'amuseable-christmas-pudding', 'omino-pan-di-zenzero', 'pinguino-pingui']
  },
  {
    id: 'decorare',
    titolo: 'Per decorare la casa',
    testo: 'Appendili all’albero, mettili sul tavolo della Vigilia o sulla mensola del camino.',
    bg: 'var(--sky)',
    tipo: 'tree',
    prodotti: ['amuseable-albero-di-natale', 'amuseable-pallina-rossa', 'amuseable-pallina-verde', 'amuseable-bastoncino-di-zucchero', 'amuseable-stella']
  }
];
