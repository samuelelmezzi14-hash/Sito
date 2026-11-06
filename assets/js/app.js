/* =========================================================
   Coccole di Neve — logica del sito
   ========================================================= */
(() => {
  'use strict';

  /* ---------------- utilità ---------------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const euro = n => n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
  const prodotto = id => PRODOTTI.find(p => p.id === id);
  const categoria = id => CATEGORIE.find(c => c.id === id);
  const fotoDi = p => p.foto || `assets/img/prodotti/${p.id}.jpg`;

  const store = {
    get(k, def) { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage non disponibile */ } }
  };

  /* ---------------- date e Natale ---------------- */
  const oggi = new Date();
  const natale = (() => {
    let d = new Date(oggi.getFullYear(), 11, 25);
    if (oggi > new Date(oggi.getFullYear(), 11, 25, 23, 59)) d = new Date(oggi.getFullYear() + 1, 11, 25);
    return d;
  })();
  const giorniANatale = Math.max(0, Math.ceil((natale - new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate())) / 864e5));
  const ultimoOrdine = new Date(natale.getFullYear(), CONFIG.ultimoOrdineNatale.mese - 1, CONFIG.ultimoOrdineNatale.giorno, 23, 59);
  const inTempoPerNatale = oggi <= ultimoOrdine;
  const fmtData = d => d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });
  const fmtDataLunga = d => d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
  const aggiungiGiorniLavorativi = (d, n) => {
    const r = new Date(d);
    while (n > 0) { r.setDate(r.getDate() + 1); const g = r.getDay(); if (g !== 0 && g !== 6) n--; }
    return r;
  };

  /* ---------------- recensioni ---------------- */
  const recensioniUtente = () => store.get('cdn_recensioni', []);
  const tutteRecensioni = () =>
    [...recensioniUtente().map(r => ({ ...r, tua: true })), ...(CONFIG.mostraRecensioniEsempio ? RECENSIONI : [])];
  const recensioniDi = id => tutteRecensioni().filter(r => r.prodotto === id);
  const media = lista => lista.length ? lista.reduce((a, r) => a + r.voto, 0) / lista.length : 0;

  const stelle = (voto, size = 16) => {
    let h = `<span class="stars" style="--size:${size}px" aria-label="${voto.toFixed(1).replace('.', ',')} su 5 stelle" role="img">`;
    for (let i = 1; i <= 5; i++) {
      const fill = Math.max(0, Math.min(1, voto - i + 1));
      h += `<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="s${i}-${Math.round(fill * 100)}"><stop offset="${fill}" stop-color="#e6b54a"/><stop offset="${fill}" stop-color="#e8e0d4"/></linearGradient></defs><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z" fill="url(#s${i}-${Math.round(fill * 100)})" stroke-linejoin="round"/></svg>`;
    }
    return h + '</span>';
  };

  /* ---------------- carrello ---------------- */
  const carrello = {
    leggi() { return store.get('cdn_carrello', { articoli: [], regalo: false, messaggio: '' }); },
    salva(c) { store.set('cdn_carrello', c); aggiornaContatore(); },
    aggiungi(id, qta = 1) {
      const c = this.leggi();
      const a = c.articoli.find(x => x.id === id);
      if (a) a.qta = Math.min(10, a.qta + qta); else c.articoli.push({ id, qta });
      this.salva(c);
    },
    numero() { return this.leggi().articoli.reduce((s, a) => s + a.qta, 0); },
    totali() {
      const c = this.leggi();
      const sub = c.articoli.reduce((s, a) => s + (prodotto(a.id)?.prezzo || 0) * a.qta, 0);
      const regalo = c.regalo && c.articoli.length ? CONFIG.costoPacchettoRegalo : 0;
      const sped = !c.articoli.length || sub >= CONFIG.sogliaSpedizioneGratuita ? 0 : CONFIG.costoSpedizione;
      return { sub, regalo, sped, tot: sub + regalo + sped };
    }
  };

  function aggiornaContatore() {
    const n = carrello.numero();
    $$('[data-cart-count]').forEach(el => { el.textContent = n; el.hidden = n === 0; });
  }

  let toastTimer;
  function toast(html) {
    let t = $('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.innerHTML = html;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    e.preventDefault();
    const p = prodotto(b.dataset.add);
    if (!p) return;
    const qtaEl = b.dataset.qta ? $(b.dataset.qta) : null;
    carrello.aggiungi(p.id, qtaEl ? Math.max(1, parseInt(qtaEl.value, 10) || 1) : 1);
    toast(`<span class="toast-ico">${Illustrazioni.peluche(p.tipo, p.colori)}</span><span><strong>${esc(p.nome)}</strong> è nel tuo sacco dei regali!<br><a href="carrello.html">Vai al carrello →</a></span>`);
    b.classList.add('added');
    setTimeout(() => b.classList.remove('added'), 900);
  });

  /* ---------------- media: foto reale o illustrazione ---------------- */
  const visuale = (p, extra = '') =>
    `<div class="media" data-foto="${esc(fotoDi(p))}" data-alt="${esc(p.nome)}" ${extra}>${Illustrazioni.peluche(p.tipo, p.colori)}</div>`;

  // Se la foto del prodotto esiste in assets/img/prodotti/ la mostriamo, altrimenti resta l'illustrazione.
  function caricaFoto(root = document) {
    $$('[data-foto]', root).forEach(el => {
      if (el.dataset.caricata) return;
      el.dataset.caricata = '1';
      const img = new Image();
      img.onload = () => {
        img.alt = el.dataset.alt || '';
        img.className = 'foto';
        img.loading = 'lazy';
        el.innerHTML = '';
        el.appendChild(img);
        el.classList.add('ha-foto');
      };
      img.src = el.dataset.foto;
    });
  }

  /* ---------------- componenti ---------------- */
  const card = p => {
    const rec = recensioniDi(p.id);
    const m = media(rec);
    return `<article class="card">
      <a class="card-media" href="prodotto.html?id=${encodeURIComponent(p.id)}" style="--bg:${p.bg}" aria-label="${esc(p.nome)}">
        ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}
        ${visuale(p)}
      </a>
      <div class="card-body">
        <h3 class="card-title"><a href="prodotto.html?id=${encodeURIComponent(p.id)}">${esc(p.nome)}</a></h3>
        <p class="card-size">${esc(p.taglia)}</p>
        ${rec.length ? `<a class="card-rating" href="prodotto.html?id=${encodeURIComponent(p.id)}#recensioni">${stelle(m, 14)}<span>(${rec.length})</span></a>` : '<span class="card-rating muted">Nuovo arrivo</span>'}
        <div class="card-foot">
          <span class="price">${p.prezzoPrima ? `<s>${euro(p.prezzoPrima)}</s> ` : ''}${euro(p.prezzo)}</span>
          <button class="btn-add" data-add="${esc(p.id)}" aria-label="Aggiungi ${esc(p.nome)} al carrello">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
          </button>
        </div>
      </div>
    </article>`;
  };
  const griglia = lista => `<div class="grid">${lista.map(card).join('')}</div>`;

  const cardRecensione = r => {
    const p = prodotto(r.prodotto);
    return `<article class="review">
      <div class="review-head">
        ${stelle(r.voto, 16)}
        <time datetime="${esc(r.data)}">${fmtDataLunga(new Date(r.data))}</time>
      </div>
      <h3>${esc(r.titolo)}</h3>
      <p>${esc(r.testo)}</p>
      <div class="review-foot">
        <span class="avatar" aria-hidden="true">${esc(r.nome.charAt(0))}</span>
        <span><strong>${esc(r.nome)}</strong>${r.citta ? ` · ${esc(r.citta)}` : ''}${r.tua ? ' <span class="pill">La tua recensione</span>' : ''}</span>
        ${p ? `<a class="review-prod" href="prodotto.html?id=${encodeURIComponent(p.id)}"><span class="mini" style="--bg:${p.bg}">${Illustrazioni.peluche(p.tipo, p.colori)}</span>${esc(p.nome)}</a>` : ''}
      </div>
    </article>`;
  };

  const paginazione = (pagina, totPagine, url) => {
    if (totPagine <= 1) return '';
    let h = `<nav class="pagination" aria-label="Pagine">`;
    h += pagina > 1 ? `<a class="pg-prev" href="${url(pagina - 1)}">← Precedente</a>` : `<span class="pg-prev disabled">← Precedente</span>`;
    h += '<span class="pg-nums">';
    for (let i = 1; i <= totPagine; i++)
      h += i === pagina ? `<span class="pg-num current" aria-current="page">${i}</span>` : `<a class="pg-num" href="${url(i)}">${i}</a>`;
    h += '</span>';
    h += pagina < totPagine ? `<a class="pg-next" href="${url(pagina + 1)}">Successiva →</a>` : `<span class="pg-next disabled">Successiva →</span>`;
    return h + '</nav>';
  };

  const qs = obj => {
    const u = new URLSearchParams();
    Object.entries(obj).forEach(([k, v]) => { if (v !== '' && v != null && !(k === 'pagina' && +v === 1)) u.set(k, v); });
    const s = u.toString();
    return s ? `?${s}` : '';
  };

  const fioccoNeve = (n = 28) => {
    let h = '<div class="snow" aria-hidden="true">';
    for (let i = 0; i < n; i++) {
      const l = (i * 37.3) % 100, d = 6 + (i % 7), del = -(i * 0.83) % 9, s = 4 + (i % 5) * 2;
      h += `<span style="left:${l}%;--d:${d}s;--del:${del}s;--s:${s}px;--x:${(i % 2 ? 1 : -1) * (10 + i % 20)}px"></span>`;
    }
    return h + '</div>';
  };

  /* ---------------- header e footer ---------------- */
  function layout() {
    document.body.insertAdjacentHTML('afterbegin', Illustrazioni.defs());
    const pagina = document.body.dataset.page;
    const cat = params.get('categoria');
    const attivo = (pg, c) => (pg === pagina && (c === undefined || c === cat)) ? ' aria-current="page"' : '';

    const messaggi = [
      `Spedizione gratuita sopra ${euro(CONFIG.sogliaSpedizioneGratuita)}`,
      inTempoPerNatale ? `Ordina entro il ${CONFIG.ultimoOrdineNatale.giorno} dicembre per riceverlo per Natale` : 'Spedizioni attive anche durante le feste',
      'Confezione regalo disponibile per ogni ordine'
    ];

    const header = `
      <a class="skip" href="#main">Vai al contenuto</a>
      <div class="announce">
        <div class="announce-track">${messaggi.map(m => `<span>${Illustrazioni.fiocco(14)} ${esc(m)}</span>`).join('')}</div>
      </div>
      <header class="site-header">
        <div class="header-top container">
          <button class="icon-btn menu-toggle" aria-label="Apri il menu" aria-expanded="false" aria-controls="main-nav">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <a class="icon-btn search-link" href="catalogo.html#cerca" aria-label="Cerca un peluche">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </a>
          <a class="logo" href="index.html" aria-label="${esc(CONFIG.nomeNegozio)} — Home">
            <span class="logo-mark">${Illustrazioni.fiocco(26)}</span>
            <span class="logo-text">Coccole <em>di</em> Neve</span>
          </a>
          <span class="countdown-mini" title="Giorni a Natale">${giorniANatale === 0 ? 'Buon Natale!' : `🎄 −${giorniANatale}`}</span>
          <a class="icon-btn cart-link" href="carrello.html" aria-label="Carrello">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8" fill="none" stroke="currentColor" stroke-width="2"/></svg>
            <span class="cart-count" data-cart-count hidden>0</span>
          </a>
        </div>
        <nav class="main-nav" id="main-nav" aria-label="Navigazione principale">
          <ul class="container">
            <li><a href="catalogo.html"${pagina === 'catalogo' && !cat ? ' aria-current="page"' : ''}>Tutti i peluche</a></li>
            ${CATEGORIE.map(c => `<li><a href="catalogo.html?categoria=${c.id}"${attivo('catalogo', c.id)}>${esc(c.breve)}</a></li>`).join('')}
            <li><a href="regali.html"${attivo('regali')}>Idee regalo</a></li>
            <li><a href="recensioni.html"${attivo('recensioni')}>Recensioni</a></li>
            <li><a href="spedizioni.html"${attivo('spedizioni')}>Spedizioni</a></li>
          </ul>
        </nav>
      </header>`;

    const footer = `
      <footer class="site-footer">
        <div class="garland" aria-hidden="true"></div>
        <div class="container footer-grid">
          <div class="footer-brand">
            <a class="logo logo-footer" href="index.html"><span class="logo-mark">${Illustrazioni.fiocco(22)}</span><span class="logo-text">Coccole <em>di</em> Neve</span></a>
            <p>Peluche Jellycat a tema natalizio, scelti uno per uno e spediti fino a casa tua (o sotto l’albero di qualcuno di speciale).</p>
            <p class="footer-countdown">${giorniANatale === 0 ? 'Buon Natale! 🎄' : `Mancano <strong>${giorniANatale}</strong> giorni a Natale`}</p>
          </div>
          <div>
            <h3>Negozio</h3>
            <ul>
              <li><a href="catalogo.html">Tutti i peluche</a></li>
              ${CATEGORIE.map(c => `<li><a href="catalogo.html?categoria=${c.id}">${esc(c.nome)}</a></li>`).join('')}
              <li><a href="regali.html">Idee regalo</a></li>
            </ul>
          </div>
          <div>
            <h3>Aiuto</h3>
            <ul>
              <li><a href="spedizioni.html">Spedizioni e consegne</a></li>
              <li><a href="spedizioni.html#resi">Resi e rimborsi</a></li>
              <li><a href="spedizioni.html#faq">Domande frequenti</a></li>
              <li><a href="recensioni.html">Recensioni clienti</a></li>
              <li><a href="mailto:${esc(CONFIG.email)}">${esc(CONFIG.email)}</a></li>
            </ul>
          </div>
          <div>
            <h3>Entra nella lista dei buoni</h3>
            <p>Novità, restock e codici sconto delle feste. Niente carbone, promesso.</p>
            <form class="newsletter" data-newsletter>
              <label class="sr-only" for="nl-footer">La tua email</label>
              <input id="nl-footer" type="email" required placeholder="La tua email">
              <button class="btn btn-small" type="submit">Iscrivimi</button>
            </form>
          </div>
        </div>
        <div class="container footer-bottom">
          <p>© ${oggi.getFullYear()} ${esc(CONFIG.nomeNegozio)} · Pagamenti sicuri · Recesso entro 14 giorni</p>
          <p class="disclaimer">${esc(CONFIG.nomeNegozio)} è un rivenditore indipendente. Jellycat® è un marchio registrato di Jellycat Limited; questo negozio non è affiliato, sponsorizzato né approvato da Jellycat Limited.</p>
        </div>
      </footer>`;

    document.body.insertAdjacentHTML('afterbegin', header);
    document.body.insertAdjacentHTML('beforeend', footer);
    $('.garland').style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(Illustrazioni.ghirlandaSvg())}")`;

    const toggle = $('.menu-toggle'), nav = $('#main-nav');
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
    });

    document.addEventListener('submit', e => {
      const f = e.target.closest('[data-newsletter]');
      if (!f) return;
      e.preventDefault();
      f.innerHTML = `<p class="nl-ok">${Illustrazioni.fiocco(18)} Sei nella lista dei buoni! Controlla la tua email.</p>`;
    });

    aggiornaContatore();
  }

  /* =========================================================
     PAGINE
     ========================================================= */
  const pagine = {};

  /* ---------- HOME ---------- */
  pagine.home = main => {
    const bestseller = PRODOTTI.filter(p => p.badge === 'Bestseller').slice(0, 4);
    const novita = PRODOTTI.filter(p => p.badge === 'Novità').slice(0, 4);
    const rec = tutteRecensioni();
    const top = [...rec].sort((a, b) => b.voto - a.voto || b.testo.length - a.testo.length).slice(0, 3);

    main.innerHTML = `
      <section class="hero">
        ${fioccoNeve()}
        <div class="container hero-inner">
          <div class="hero-text">
            <p class="kicker">${Illustrazioni.fiocco(16)} Collezione Natale ${natale.getFullYear()}</p>
            <h1>Il Natale più <span class="squiggle">morbido</span> di sempre</h1>
            <p class="lead">Renne timide, alberelli con le gambette e pudding da abbracciare: i peluche Jellycat delle feste, pronti a finire sotto l’albero.</p>
            <div class="hero-cta">
              <a class="btn" href="catalogo.html">Scopri i peluche</a>
              <a class="btn btn-ghost" href="regali.html">Idee regalo</a>
            </div>
            <div class="countdown" aria-live="polite">
              <div class="cd-num"><strong>${giorniANatale}</strong><span>giorni a Natale</span></div>
              <p>${inTempoPerNatale
                ? `Ordina entro il <strong>${CONFIG.ultimoOrdineNatale.giorno} dicembre</strong> per riceverlo in tempo per Natale.`
                : 'Gli ordini di oggi potrebbero arrivare dopo Natale: perfetti per la Befana!'}</p>
            </div>
          </div>
          <div class="hero-art">${Illustrazioni.scenaHero()}</div>
        </div>
      </section>

      <section class="usp container" aria-label="Perché sceglierci">
        <div>${Illustrazioni.icone.slitta}<p><strong>Spedizione gratuita</strong> sopra ${euro(CONFIG.sogliaSpedizioneGratuita)}</p></div>
        <div>${Illustrazioni.icone.regalo}<p><strong>Confezione regalo</strong> con biglietto scritto a mano</p></div>
        <div>${Illustrazioni.icone.reso}<p><strong>Reso facile</strong> entro 14 giorni</p></div>
        <div>${Illustrazioni.icone.cuore}<p><strong>Peluche selezionati</strong> uno per uno</p></div>
      </section>

      <section class="section container">
        <div class="section-head">
          <h2>Scegli il tuo angolo di Natale</h2>
          <p>Ogni collezione ha la sua pagina: sfoglia con calma, come davanti a una vetrina innevata.</p>
        </div>
        <div class="cats">
          ${CATEGORIE.map(c => `
            <a class="cat" href="catalogo.html?categoria=${c.id}" style="--bg:${c.bg}">
              <span class="cat-art">${Illustrazioni.peluche(c.tipo)}</span>
              <span class="cat-name">${esc(c.nome)}</span>
              <span class="cat-count">${PRODOTTI.filter(p => p.categoria === c.id).length} peluche →</span>
            </a>`).join('')}
          <a class="cat" href="regali.html" style="--bg:var(--lilac)">
            <span class="cat-art">${Illustrazioni.confezioneRegalo('bunny')}</span>
            <span class="cat-name">Idee regalo</span>
            <span class="cat-count">Guida ai regali →</span>
          </a>
        </div>
      </section>

      <section class="section container">
        <div class="section-head row">
          <div><h2>I più amati delle feste</h2><p>I peluche che quest’anno tutti vogliono trovare sotto l’albero.</p></div>
          <a class="link-arrow" href="catalogo.html?ordina=voto">Vedi tutti →</a>
        </div>
        ${griglia(bestseller)}
      </section>

      <section class="section container">
        <div class="banner-letter">
          <div class="bl-art">${Illustrazioni.letteraBabbo()}</div>
          <div class="bl-text">
            <h2>Non sai cosa scrivere nella letterina?</h2>
            <p>Abbiamo diviso i peluche per budget, età e personalità. Dal primo Natale del nipotino al Secret Santa in ufficio, c’è una coccola per tutti.</p>
            <a class="btn btn-red" href="regali.html">Apri la guida ai regali</a>
          </div>
        </div>
      </section>

      <section class="section container">
        <div class="section-head row">
          <div><h2>Appena arrivati al Polo Nord</h2><p>Le novità della collezione di Natale.</p></div>
          <a class="link-arrow" href="catalogo.html">Tutto il catalogo →</a>
        </div>
        ${griglia(novita)}
      </section>

      ${rec.length ? `
      <section class="section reviews-band">
        <div class="container">
          <div class="section-head row">
            <div>
              <h2>Parola di chi li ha già abbracciati</h2>
              <p class="rating-line">${stelle(media(rec), 20)} <strong>${media(rec).toFixed(1).replace('.', ',')}/5</strong> su ${rec.length} recensioni</p>
            </div>
            <a class="link-arrow" href="recensioni.html">Leggi tutte le recensioni →</a>
          </div>
          <div class="reviews-grid">${top.map(cardRecensione).join('')}</div>
        </div>
      </section>` : ''}

      <section class="section container">
        <div class="newsletter-band">
          <div>
            <h2>Entra nella lista dei buoni</h2>
            <p>Ricevi per primo i restock dei peluche più ricercati e i codici sconto dell’Avvento.</p>
            <form class="newsletter" data-newsletter>
              <label class="sr-only" for="nl-home">La tua email</label>
              <input id="nl-home" type="email" required placeholder="nome@email.it">
              <button class="btn" type="submit">Iscrivimi</button>
            </form>
          </div>
          <div class="nb-art">${Illustrazioni.peluche('penguin')}</div>
        </div>
      </section>`;
  };

  /* ---------- CATALOGO (con categorie e pagine) ---------- */
  pagine.catalogo = main => {
    const stato = {
      categoria: categoria(params.get('categoria')) ? params.get('categoria') : '',
      ordina: params.get('ordina') || 'evidenza',
      q: params.get('q') || '',
      pagina: Math.max(1, parseInt(params.get('pagina'), 10) || 1)
    };
    const cat = categoria(stato.categoria);
    document.title = `${cat ? cat.nome : 'Tutti i peluche'} · ${CONFIG.nomeNegozio}`;

    main.innerHTML = `
      <section class="page-hero" style="--bg:${cat ? cat.bg : 'var(--blush)'}">
        ${fioccoNeve(16)}
        <div class="container page-hero-inner">
          <div>
            <nav class="crumbs" aria-label="Percorso"><a href="index.html">Home</a> / ${cat ? `<a href="catalogo.html">Peluche</a> / <span>${esc(cat.nome)}</span>` : '<span>Tutti i peluche</span>'}</nav>
            <h1>${cat ? esc(cat.nome) : 'Tutti i peluche di Natale'}</h1>
            <p>${cat ? esc(cat.descrizione) : 'Tutta la collezione delle feste, divisa in pagine per sfogliarla con calma. Usa i filtri per trovare il peluche giusto.'}</p>
          </div>
          <div class="page-hero-art">${Illustrazioni.peluche(cat ? cat.tipo : 'reindeer')}</div>
        </div>
      </section>
      <section class="container section-tight">
        <div class="toolbar">
          <div class="chips" role="list">
            <a role="listitem" class="chip" href="catalogo.html${qs({ ordina: stato.ordina === 'evidenza' ? '' : stato.ordina, q: stato.q })}" ${!cat ? 'aria-current="true"' : ''}>Tutti</a>
            ${CATEGORIE.map(c => `<a role="listitem" class="chip" href="catalogo.html${qs({ categoria: c.id, ordina: stato.ordina === 'evidenza' ? '' : stato.ordina, q: stato.q })}" ${c.id === stato.categoria ? 'aria-current="true"' : ''}>${esc(c.breve)}</a>`).join('')}
          </div>
          <form class="filters" id="cerca">
            <label class="search">
              <span class="sr-only">Cerca</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              <input type="search" name="q" value="${esc(stato.q)}" placeholder="Cerca renna, pudding…">
            </label>
            <label class="select">
              <span class="sr-only">Ordina per</span>
              <select name="ordina">
                ${[['evidenza', 'In evidenza'], ['prezzo-asc', 'Prezzo: dal più basso'], ['prezzo-desc', 'Prezzo: dal più alto'], ['voto', 'Più votati'], ['nome', 'Nome A–Z']]
                  .map(([v, l]) => `<option value="${v}" ${v === stato.ordina ? 'selected' : ''}>${l}</option>`).join('')}
              </select>
            </label>
          </form>
        </div>
        <div id="risultati"></div>
      </section>`;

    const render = () => {
      const q = stato.q.trim().toLowerCase();
      let lista = PRODOTTI.filter(p => (!stato.categoria || p.categoria === stato.categoria) &&
        (!q || (p.nome + ' ' + p.descrizione).toLowerCase().includes(q)));
      const voto = p => media(recensioniDi(p.id));
      const ord = {
        'prezzo-asc': (a, b) => a.prezzo - b.prezzo,
        'prezzo-desc': (a, b) => b.prezzo - a.prezzo,
        voto: (a, b) => voto(b) - voto(a),
        nome: (a, b) => a.nome.localeCompare(b.nome, 'it')
      }[stato.ordina];
      if (ord) lista = [...lista].sort(ord);

      const per = CONFIG.prodottiPerPagina;
      const totPagine = Math.max(1, Math.ceil(lista.length / per));
      stato.pagina = Math.min(stato.pagina, totPagine);
      const da = (stato.pagina - 1) * per;
      const pagina = lista.slice(da, da + per);
      const url = n => `catalogo.html${qs({ categoria: stato.categoria, ordina: stato.ordina === 'evidenza' ? '' : stato.ordina, q: stato.q, pagina: n })}`;

      $('#risultati').innerHTML = lista.length ? `
        <p class="count">${lista.length} peluche · pagina ${stato.pagina} di ${totPagine}</p>
        ${griglia(pagina)}
        ${paginazione(stato.pagina, totPagine, url)}` : `
        <div class="empty">
          <div class="empty-art">${Illustrazioni.peluche('owl')}</div>
          <h2>Nessun peluche trovato</h2>
          <p>Il gufo ha cercato ovunque, ma niente. Prova con un’altra parola.</p>
          <a class="btn" href="catalogo.html">Vedi tutti i peluche</a>
        </div>`;
      caricaFoto($('#risultati'));
    };

    const form = $('#cerca');
    const aggiorna = () => {
      stato.q = form.q.value;
      stato.ordina = form.ordina.value;
      stato.pagina = 1;
      history.replaceState(null, '', `catalogo.html${qs({ categoria: stato.categoria, ordina: stato.ordina === 'evidenza' ? '' : stato.ordina, q: stato.q })}`);
      render();
    };
    form.addEventListener('submit', e => { e.preventDefault(); aggiorna(); });
    form.ordina.addEventListener('change', aggiorna);
    let t; form.q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(aggiorna, 250); });
    render();
    if (location.hash === '#cerca') form.q.focus();
  };

  /* ---------- PRODOTTO ---------- */
  pagine.prodotto = main => {
    const p = prodotto(params.get('id'));
    if (!p) {
      main.innerHTML = `<div class="container empty">
        <div class="empty-art">${Illustrazioni.peluche('penguin')}</div>
        <h1>Peluche non trovato</h1><p>Forse è scappato a giocare nella neve.</p>
        <a class="btn" href="catalogo.html">Torna al catalogo</a></div>`;
      return;
    }
    const cat = categoria(p.categoria);
    document.title = `${p.nome} · ${CONFIG.nomeNegozio}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = p.descrizione;

    const da = aggiungiGiorniLavorativi(oggi, CONFIG.consegnaMin);
    const a = aggiungiGiorniLavorativi(oggi, CONFIG.consegnaMax);
    const correlati = [...PRODOTTI.filter(x => x.categoria === p.categoria && x.id !== p.id), ...PRODOTTI.filter(x => x.categoria !== p.categoria)].slice(0, 4);

    main.innerHTML = `
      <div class="container">
        <nav class="crumbs" aria-label="Percorso"><a href="index.html">Home</a> / <a href="catalogo.html?categoria=${cat.id}">${esc(cat.nome)}</a> / <span>${esc(p.nome)}</span></nav>
        <div class="product">
          <div class="gallery">
            <div class="gallery-main" style="--bg:${p.bg}">
              ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}
              <div class="gallery-view" data-view="0" hidden><img class="foto" alt="${esc(p.nome)}"></div>
              <div class="gallery-view" data-view="1">${Illustrazioni.peluche(p.tipo, p.colori)}</div>
              <div class="gallery-view" data-view="2" hidden>${Illustrazioni.confezioneRegalo(p.tipo, p.colori)}</div>
            </div>
            <div class="thumbs" role="tablist" aria-label="Immagini del prodotto">
              <button role="tab" aria-selected="false" data-thumb="0" style="--bg:${p.bg}" aria-label="Foto" hidden><img class="foto" alt=""></button>
              <button role="tab" aria-selected="true" data-thumb="1" style="--bg:${p.bg}" aria-label="Illustrazione">${Illustrazioni.peluche(p.tipo, p.colori)}</button>
              <button role="tab" aria-selected="false" data-thumb="2" style="--bg:var(--cream-2)" aria-label="In confezione regalo">${Illustrazioni.confezioneRegalo(p.tipo, p.colori)}</button>
            </div>
          </div>
          <div class="product-info">
            <h1>${esc(p.nome)}</h1>
            <a class="rating-line" href="#recensioni" id="rating-top"></a>
            <p class="product-price">${p.prezzoPrima ? `<s>${euro(p.prezzoPrima)}</s> ` : ''}${euro(p.prezzo)}</p>
            <p class="size-chip">Taglia: <strong>${esc(p.taglia)}</strong></p>
            <p class="product-desc">${esc(p.descrizione)}</p>
            <div class="buy">
              <label class="qty">
                <span class="sr-only">Quantità</span>
                <button type="button" data-step="-1" aria-label="Diminuisci">−</button>
                <input id="qta" type="number" min="1" max="10" value="1" inputmode="numeric">
                <button type="button" data-step="1" aria-label="Aumenta">+</button>
              </label>
              <button class="btn btn-red btn-wide" data-add="${esc(p.id)}" data-qta="#qta">Aggiungi al sacco dei regali</button>
            </div>
            <label class="gift-opt">
              <input type="checkbox" id="opt-regalo" ${carrello.leggi().regalo ? 'checked' : ''}>
              <span>${Illustrazioni.icone.regalo}<span><strong>Confezione regalo</strong> con fiocco e biglietto (+${euro(CONFIG.costoPacchettoRegalo)} sull’ordine)</span></span>
            </label>
            <div class="delivery">
              ${Illustrazioni.icone.slitta}
              <div>
                <p><strong>Consegna stimata:</strong> ${fmtData(da)} – ${fmtData(a)}</p>
                <p class="${inTempoPerNatale ? 'ok' : 'warn'}">${inTempoPerNatale
                  ? `✓ Arriva in tempo per Natale se ordini entro il ${CONFIG.ultimoOrdineNatale.giorno} dicembre`
                  : 'Potrebbe arrivare dopo Natale: perfetto per la Befana!'}</p>
              </div>
            </div>
            <div class="accordion">
              <details open><summary>Dettagli</summary><ul>${p.dettagli.map(d => `<li>${esc(d)}</li>`).join('')}</ul></details>
              <details><summary>Cura del peluche</summary><p>Lavare a mano in acqua tiepida (max 30°) con sapone delicato. Non centrifugare, non usare l’asciugatrice: lascia asciugare all’aria, lontano da fonti di calore. Spazzola delicatamente il pelo per farlo tornare soffice.</p></details>
              <details><summary>Spedizione e resi</summary><p>Spedizione gratuita sopra ${euro(CONFIG.sogliaSpedizioneGratuita)}, altrimenti ${euro(CONFIG.costoSpedizione)}. Consegna in ${CONFIG.consegnaMin}–${CONFIG.consegnaMax} giorni lavorativi con tracciamento. Puoi esercitare il recesso entro 14 giorni dalla consegna. <a href="spedizioni.html">Tutti i dettagli</a></p></details>
            </div>
          </div>
        </div>
      </div>

      <section class="section reviews-band" id="recensioni">
        <div class="container" id="prod-reviews"></div>
      </section>

      <section class="section container">
        <div class="section-head row"><div><h2>Potrebbe piacerti anche</h2></div><a class="link-arrow" href="catalogo.html?categoria=${cat.id}">${esc(cat.nome)} →</a></div>
        ${griglia(correlati)}
      </section>`;

    // galleria
    $$('[data-thumb]').forEach(b => b.addEventListener('click', () => {
      $$('[data-thumb]').forEach(x => x.setAttribute('aria-selected', x === b));
      $$('.gallery-view').forEach(v => { v.hidden = v.dataset.view !== b.dataset.thumb; });
    }));
    // foto reale (se presente in assets/img/prodotti/) come prima immagine
    const foto = new Image();
    foto.onload = () => {
      $$('.gallery img.foto').forEach(i => { i.src = foto.src; });
      const t0 = $('[data-thumb="0"]');
      t0.hidden = false;
      t0.click();
    };
    foto.src = fotoDi(p);
    // quantità
    const qta = $('#qta');
    $$('[data-step]').forEach(b => b.addEventListener('click', () => {
      qta.value = Math.min(10, Math.max(1, (parseInt(qta.value, 10) || 1) + +b.dataset.step));
    }));
    $('#opt-regalo').addEventListener('change', e => {
      const c = carrello.leggi(); c.regalo = e.target.checked; carrello.salva(c);
    });

    const renderRecensioni = () => {
      const rec = recensioniDi(p.id).sort((x, y) => y.data.localeCompare(x.data));
      const m = media(rec);
      $('#rating-top').innerHTML = rec.length ? `${stelle(m, 18)} <span>${m.toFixed(1).replace('.', ',')} · ${rec.length} recensioni</span>` : '<span>Sii il primo a recensirlo</span>';
      $('#prod-reviews').innerHTML = `
        <div class="section-head row">
          <div>
            <h2>Recensioni</h2>
            ${rec.length ? `<p class="rating-line">${stelle(m, 20)} <strong>${m.toFixed(1).replace('.', ',')}/5</strong> · ${rec.length} recensioni</p>` : '<p>Ancora nessuna recensione per questo peluche.</p>'}
          </div>
          <a class="link-arrow" href="recensioni.html">Tutte le recensioni del negozio →</a>
        </div>
        <div class="reviews-layout">
          <div class="reviews-grid one">${rec.map(cardRecensione).join('') || ''}</div>
          ${formRecensione(p.id)}
        </div>`;
      collegaForm(renderRecensioni);
    };
    renderRecensioni();
  };

  /* ---------- form recensione (riutilizzato) ---------- */
  const formRecensione = idFisso => `
    <form class="review-form" id="review-form" novalidate>
      <h3>Scrivi una recensione</h3>
      ${idFisso ? `<input type="hidden" name="prodotto" value="${esc(idFisso)}">` : `
      <label>Peluche<select name="prodotto" required>
        <option value="">Scegli il peluche…</option>
        ${PRODOTTI.map(p => `<option value="${esc(p.id)}">${esc(p.nome)}</option>`).join('')}
      </select></label>`}
      <fieldset class="star-input">
        <legend>Il tuo voto</legend>
        <div class="star-row">${[5, 4, 3, 2, 1].map(v => `<input type="radio" id="voto-${v}" name="voto" value="${v}" ${v === 5 ? 'checked' : ''}><label for="voto-${v}" title="${v} stelle"><span class="sr-only">${v} stelle</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z"/></svg></label>`).join('')}</div>
      </fieldset>
      <div class="form-row">
        <label>Nome<input name="nome" required maxlength="40" placeholder="Es. Giulia M."></label>
        <label>Città (facoltativa)<input name="citta" maxlength="40" placeholder="Es. Milano"></label>
      </div>
      <label>Titolo<input name="titolo" required maxlength="80" placeholder="Riassumi in poche parole"></label>
      <label>La tua recensione<textarea name="testo" required minlength="10" maxlength="800" rows="4" placeholder="Com’è il peluche? A chi l’hai regalato?"></textarea></label>
      <p class="form-error" role="alert" hidden></p>
      <button class="btn" type="submit">Pubblica recensione</button>
    </form>`;

  function collegaForm(onSaved) {
    const f = $('#review-form');
    if (!f) return;
    f.addEventListener('submit', e => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(f));
      const err = $('.form-error', f);
      const manca = !d.prodotto ? 'Scegli il peluche da recensire.' : !d.nome.trim() ? 'Inserisci il tuo nome.' : !d.titolo.trim() ? 'Aggiungi un titolo.' : d.testo.trim().length < 10 ? 'La recensione deve avere almeno 10 caratteri.' : '';
      if (manca) { err.textContent = manca; err.hidden = false; return; }
      const lista = recensioniUtente();
      lista.unshift({
        prodotto: d.prodotto, nome: d.nome.trim(), citta: d.citta.trim(), voto: +d.voto || 5,
        titolo: d.titolo.trim(), testo: d.testo.trim(), data: new Date().toISOString().slice(0, 10)
      });
      store.set('cdn_recensioni', lista);
      onSaved();
      toast(`<span class="toast-ico">${Illustrazioni.icone.cuore}</span><span><strong>Grazie!</strong> La tua recensione è stata pubblicata.</span>`);
    });
  }

  /* ---------- RECENSIONI ---------- */
  pagine.recensioni = main => {
    const stato = {
      voto: params.get('voto') || '',
      prodotto: params.get('prodotto') || '',
      ordina: params.get('ordina') || 'recenti',
      pagina: Math.max(1, parseInt(params.get('pagina'), 10) || 1)
    };

    main.innerHTML = `
      <section class="page-hero" style="--bg:var(--butter)">
        ${fioccoNeve(16)}
        <div class="container page-hero-inner">
          <div>
            <nav class="crumbs" aria-label="Percorso"><a href="index.html">Home</a> / <span>Recensioni</span></nav>
            <h1>Le vostre coccole, in parole</h1>
            <p>Cosa dicono le famiglie che hanno già messo un nostro peluche sotto l’albero. Hai ricevuto il tuo ordine? Raccontacelo!</p>
            <a class="btn" href="#review-form">Scrivi una recensione</a>
          </div>
          <div class="page-hero-art duo">${Illustrazioni.peluche('bunny')}${Illustrazioni.peluche('reindeer')}</div>
        </div>
      </section>
      <section class="container section-tight">
        <div class="reviews-summary" id="summary"></div>
        <form class="filters filters-reviews" id="filtri">
          <label class="select"><span class="sr-only">Stelle</span>
            <select name="voto">
              <option value="">Tutte le stelle</option>
              ${[5, 4, 3, 2, 1].map(v => `<option value="${v}" ${String(v) === stato.voto ? 'selected' : ''}>${v} stelle</option>`).join('')}
            </select></label>
          <label class="select"><span class="sr-only">Peluche</span>
            <select name="prodotto">
              <option value="">Tutti i peluche</option>
              ${PRODOTTI.map(p => `<option value="${esc(p.id)}" ${p.id === stato.prodotto ? 'selected' : ''}>${esc(p.nome)}</option>`).join('')}
            </select></label>
          <label class="select"><span class="sr-only">Ordina</span>
            <select name="ordina">
              ${[['recenti', 'Più recenti'], ['alto', 'Voto più alto'], ['basso', 'Voto più basso']].map(([v, l]) => `<option value="${v}" ${v === stato.ordina ? 'selected' : ''}>${l}</option>`).join('')}
            </select></label>
        </form>
        <div id="lista-recensioni"></div>
      </section>
      <section class="section container" id="scrivi">
        <div class="write-band">
          <div class="wb-art">${Illustrazioni.letteraBabbo()}</div>
          ${formRecensione()}
        </div>
      </section>`;

    const render = () => {
      const tutte = tutteRecensioni();
      const m = media(tutte);
      const dist = [5, 4, 3, 2, 1].map(v => [v, tutte.filter(r => r.voto === v).length]);
      $('#summary').innerHTML = tutte.length ? `
        <div class="rs-score"><strong>${m.toFixed(1).replace('.', ',')}</strong>${stelle(m, 22)}<span>${tutte.length} recensioni</span></div>
        <div class="rs-bars">${dist.map(([v, n]) => `
          <a class="rs-bar" href="recensioni.html${qs({ voto: v })}">
            <span>${v} ★</span><span class="bar"><span style="width:${tutte.length ? n / tutte.length * 100 : 0}%"></span></span><span>${n}</span>
          </a>`).join('')}</div>
        <div class="rs-note">${Illustrazioni.icone.cuore}<p><strong>${Math.round(tutte.filter(r => r.voto >= 4).length / tutte.length * 100)}%</strong> dei clienti consiglierebbe i nostri peluche a un amico.</p></div>` : '<p>Ancora nessuna recensione: scrivi la prima!</p>';

      let lista = tutte.filter(r => (!stato.voto || r.voto === +stato.voto) && (!stato.prodotto || r.prodotto === stato.prodotto));
      lista.sort({
        recenti: (a, b) => b.data.localeCompare(a.data),
        alto: (a, b) => b.voto - a.voto || b.data.localeCompare(a.data),
        basso: (a, b) => a.voto - b.voto || b.data.localeCompare(a.data)
      }[stato.ordina] || (() => 0));
      const per = CONFIG.recensioniPerPagina;
      const totPagine = Math.max(1, Math.ceil(lista.length / per));
      stato.pagina = Math.min(stato.pagina, totPagine);
      const url = n => `recensioni.html${qs({ voto: stato.voto, prodotto: stato.prodotto, ordina: stato.ordina === 'recenti' ? '' : stato.ordina, pagina: n })}`;
      $('#lista-recensioni').innerHTML = lista.length ? `
        <p class="count">${lista.length} recensioni · pagina ${stato.pagina} di ${totPagine}</p>
        <div class="reviews-grid">${lista.slice((stato.pagina - 1) * per, stato.pagina * per).map(cardRecensione).join('')}</div>
        ${paginazione(stato.pagina, totPagine, url)}` : `<div class="empty"><div class="empty-art">${Illustrazioni.peluche('owl')}</div><p>Nessuna recensione con questi filtri.</p></div>`;
    };

    const f = $('#filtri');
    f.addEventListener('change', () => {
      stato.voto = f.voto.value; stato.prodotto = f.prodotto.value; stato.ordina = f.ordina.value; stato.pagina = 1;
      history.replaceState(null, '', `recensioni.html${qs({ voto: stato.voto, prodotto: stato.prodotto, ordina: stato.ordina === 'recenti' ? '' : stato.ordina })}`);
      render();
    });
    collegaForm(() => {
      $('#review-form').reset();
      stato.voto = ''; stato.prodotto = ''; stato.ordina = 'recenti'; stato.pagina = 1;
      f.reset();
      render();
      $('#summary').scrollIntoView({ behavior: 'smooth' });
    });
    render();
  };

  /* ---------- IDEE REGALO ---------- */
  pagine.regali = main => {
    main.innerHTML = `
      <section class="page-hero" style="--bg:var(--lilac)">
        ${fioccoNeve(16)}
        <div class="container page-hero-inner">
          <div>
            <nav class="crumbs" aria-label="Percorso"><a href="index.html">Home</a> / <span>Idee regalo</span></nav>
            <h1>La guida ai regali più morbida</h1>
            <p>Quattro liste per trovare in un attimo il peluche giusto per ogni persona speciale.</p>
            <div class="chips">${GUIDA_REGALI.map(g => `<a class="chip" href="#${g.id}">${esc(g.titolo)}</a>`).join('')}</div>
          </div>
          <div class="page-hero-art">${Illustrazioni.confezioneRegalo('reindeer')}</div>
        </div>
      </section>
      ${GUIDA_REGALI.map((g, i) => {
        const lista = g.filtro ? PRODOTTI.filter(g.filtro) : g.prodotti.map(prodotto).filter(Boolean);
        return `<section class="section container gift-section" id="${g.id}">
          <div class="gift-head ${i % 2 ? 'rev' : ''}" style="--bg:${g.bg}">
            <div class="gift-art">${Illustrazioni.peluche(g.tipo)}</div>
            <div><p class="kicker">Lista ${i + 1} di ${GUIDA_REGALI.length}</p><h2>${esc(g.titolo)}</h2><p>${esc(g.testo)}</p></div>
          </div>
          ${griglia(lista.slice(0, 8))}
        </section>`;
      }).join('')}`;
  };

  /* ---------- SPEDIZIONI & FAQ ---------- */
  pagine.spedizioni = main => {
    const ultimo = `${CONFIG.ultimoOrdineNatale.giorno} dicembre`;
    main.innerHTML = `
      <section class="page-hero" style="--bg:var(--sky)">
        ${fioccoNeve(16)}
        <div class="container page-hero-inner">
          <div>
            <nav class="crumbs" aria-label="Percorso"><a href="index.html">Home</a> / <span>Spedizioni</span></nav>
            <h1>Spedizioni, resi e domande</h1>
            <p>Tutto quello che serve sapere perché il tuo peluche arrivi sotto l’albero in tempo.</p>
          </div>
          <div class="page-hero-art">${Illustrazioni.peluche('penguin')}</div>
        </div>
      </section>
      <section class="section container">
        <div class="section-head"><h2>Il calendario della slitta</h2><p>Le date da segnare per ricevere i regali prima di Natale.</p></div>
        <ol class="timeline">
          <li><span class="tl-date">Da oggi</span><h3>Ordini aperti</h3><p>Consegna in ${CONFIG.consegnaMin}–${CONFIG.consegnaMax} giorni lavorativi con tracciamento.</p></li>
          <li class="${inTempoPerNatale ? 'hl' : ''}"><span class="tl-date">${ultimo}</span><h3>Ultimo giorno per Natale</h3><p>Gli ordini ricevuti entro le 23:59 arrivano in tempo per la Vigilia.</p></li>
          <li><span class="tl-date">24 dicembre</span><h3>La Vigilia</h3><p>I peluche sono pronti sotto l’albero (o nascosti nell’armadio).</p></li>
          <li><span class="tl-date">6 gennaio</span><h3>Arriva la Befana</h3><p>Ordini dopo il ${ultimo}? Perfetti per riempire la calza!</p></li>
        </ol>
      </section>
      <section class="section container">
        <div class="ship-table">
          <div><h3>Spedizione standard</h3><p class="big">${euro(CONFIG.costoSpedizione)}</p><p>${CONFIG.consegnaMin}–${CONFIG.consegnaMax} giorni lavorativi, con numero di tracciamento.</p></div>
          <div class="hl"><h3>Spedizione gratuita</h3><p class="big">${euro(0)}</p><p>Per tutti gli ordini sopra ${euro(CONFIG.sogliaSpedizioneGratuita)}.</p></div>
          <div><h3>Confezione regalo</h3><p class="big">${euro(CONFIG.costoPacchettoRegalo)}</p><p>Carta natalizia, fiocco e biglietto con il tuo messaggio.</p></div>
        </div>
      </section>
      <section class="section container faq" id="faq">
        <div class="section-head"><h2>Domande frequenti</h2></div>
        <div class="accordion big">
          <details open><summary>Quanto tempo ci vuole per ricevere il mio ordine?</summary><p>Gli ordini vengono preparati dal nostro magazzino partner e consegnati in ${CONFIG.consegnaMin}–${CONFIG.consegnaMax} giorni lavorativi. Nel periodo natalizio i corrieri possono avere qualche giorno di ritardo: per stare tranquilli, ordina entro il ${ultimo}.</p></details>
          <details><summary>I peluche sono originali?</summary><p>Sì: vendiamo esclusivamente peluche Jellycat originali, provenienti da distributori autorizzati. Ogni peluche ha la sua etichetta di cucitura originale.</p></details>
          <details><summary>Riceverò un numero di tracciamento?</summary><p>Certo. Appena l’ordine parte ti inviamo un’email con il link per seguire la spedizione passo dopo passo.</p></details>
          <details><summary>Posso spedire il regalo direttamente a un’altra persona?</summary><p>Sì: inserisci l’indirizzo del destinatario al checkout e aggiungi la confezione regalo. Nel pacco non inseriamo mai lo scontrino con i prezzi.</p></details>
          <details><summary>Quali metodi di pagamento accettate?</summary><p>Carte di credito e debito, PayPal, Apple Pay e Google Pay. Tutti i pagamenti sono protetti e cifrati.</p></details>
          <details id="resi"><summary>Come funzionano resi e rimborsi?</summary><p>Hai 14 giorni dalla consegna per esercitare il diritto di recesso. Scrivici a <a href="mailto:${esc(CONFIG.email)}">${esc(CONFIG.email)}</a> indicando il numero d’ordine: ti invieremo le istruzioni per il reso. Il rimborso arriva entro 14 giorni dalla ricezione del prodotto, che deve essere integro e con l’etichetta originale.</p></details>
          <details><summary>Il peluche è arrivato danneggiato, cosa faccio?</summary><p>Ci dispiace tantissimo! Mandaci una foto del pacco e del peluche entro 48 ore dalla consegna e ti spediremo subito un sostituto, senza costi aggiuntivi.</p></details>
        </div>
      </section>`;
    if (location.hash === '#resi') $('#resi').open = true;
  };

  /* ---------- CARRELLO ---------- */
  pagine.carrello = main => {
    const render = () => {
      const c = carrello.leggi();
      c.articoli = c.articoli.filter(a => prodotto(a.id));
      if (!c.articoli.length) {
        main.innerHTML = `<div class="container empty cart-empty">
          <div class="empty-art">${Illustrazioni.peluche('polarbear')}</div>
          <h1>Il tuo sacco dei regali è vuoto</h1>
          <p>L’orso polare sta aspettando qualche amico da portare a casa.</p>
          <a class="btn" href="catalogo.html">Scopri i peluche</a></div>`;
        return;
      }
      const t = carrello.totali();
      const manca = CONFIG.sogliaSpedizioneGratuita - t.sub;
      const perc = Math.min(100, t.sub / CONFIG.sogliaSpedizioneGratuita * 100);
      main.innerHTML = `
        <div class="container">
          <nav class="crumbs" aria-label="Percorso"><a href="index.html">Home</a> / <span>Carrello</span></nav>
          <h1 class="cart-title">Il tuo sacco dei regali</h1>
          <div class="cart">
            <div>
              <div class="free-ship">
                ${Illustrazioni.icone.slitta}
                <div>
                  <p>${manca > 0 ? `Ti mancano <strong>${euro(manca)}</strong> per la spedizione gratuita!` : '<strong>Evviva!</strong> La spedizione è gratuita.'}</p>
                  <div class="bar"><span style="width:${perc}%"></span></div>
                </div>
              </div>
              <ul class="cart-list">
                ${c.articoli.map(a => {
                  const p = prodotto(a.id);
                  return `<li class="cart-item">
                    <a class="ci-media" href="prodotto.html?id=${encodeURIComponent(p.id)}" style="--bg:${p.bg}">${visuale(p)}</a>
                    <div class="ci-info">
                      <a href="prodotto.html?id=${encodeURIComponent(p.id)}"><strong>${esc(p.nome)}</strong></a>
                      <span class="muted">${esc(p.taglia)}</span>
                      <span>${euro(p.prezzo)}</span>
                    </div>
                    <div class="qty small">
                      <button type="button" data-cqty="${esc(p.id)}" data-d="-1" aria-label="Diminuisci ${esc(p.nome)}">−</button>
                      <span aria-live="polite">${a.qta}</span>
                      <button type="button" data-cqty="${esc(p.id)}" data-d="1" aria-label="Aumenta ${esc(p.nome)}">+</button>
                    </div>
                    <strong class="ci-tot">${euro(p.prezzo * a.qta)}</strong>
                    <button class="ci-remove" data-remove="${esc(p.id)}" aria-label="Rimuovi ${esc(p.nome)}">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    </button>
                  </li>`;
                }).join('')}
              </ul>
              <div class="gift-box">
                <label class="gift-opt">
                  <input type="checkbox" id="cart-regalo" ${c.regalo ? 'checked' : ''}>
                  <span>${Illustrazioni.icone.regalo}<span><strong>Aggiungi la confezione regalo</strong> (+${euro(CONFIG.costoPacchettoRegalo)})</span></span>
                </label>
                <label class="gift-msg" ${c.regalo ? '' : 'hidden'}>Messaggio sul biglietto
                  <textarea id="cart-msg" rows="3" maxlength="200" placeholder="Buon Natale! Con tanto affetto…">${esc(c.messaggio || '')}</textarea>
                </label>
              </div>
            </div>
            <aside class="summary">
              <h2>Riepilogo</h2>
              <dl>
                <div><dt>Subtotale</dt><dd>${euro(t.sub)}</dd></div>
                ${t.regalo ? `<div><dt>Confezione regalo</dt><dd>${euro(t.regalo)}</dd></div>` : ''}
                <div><dt>Spedizione</dt><dd>${t.sped ? euro(t.sped) : 'Gratuita'}</dd></div>
                <div class="tot"><dt>Totale</dt><dd>${euro(t.tot)}</dd></div>
              </dl>
              <p class="muted small-print">IVA inclusa. ${inTempoPerNatale ? `Ordina entro il ${CONFIG.ultimoOrdineNatale.giorno} dicembre per riceverlo per Natale.` : ''}</p>
              <button class="btn btn-red btn-wide" id="checkout">Procedi al pagamento</button>
              <a class="link-arrow center" href="catalogo.html">← Continua lo shopping</a>
            </aside>
          </div>
        </div>`;
      caricaFoto(main);

      $$('[data-cqty]').forEach(b => b.addEventListener('click', () => {
        const cc = carrello.leggi();
        const a = cc.articoli.find(x => x.id === b.dataset.cqty);
        if (!a) return;
        a.qta = Math.max(1, Math.min(10, a.qta + +b.dataset.d));
        carrello.salva(cc); render();
      }));
      $$('[data-remove]').forEach(b => b.addEventListener('click', () => {
        const cc = carrello.leggi();
        cc.articoli = cc.articoli.filter(x => x.id !== b.dataset.remove);
        carrello.salva(cc); render();
      }));
      $('#cart-regalo').addEventListener('change', e => {
        const cc = carrello.leggi(); cc.regalo = e.target.checked; carrello.salva(cc); render();
      });
      $('#cart-msg').addEventListener('input', e => {
        const cc = carrello.leggi(); cc.messaggio = e.target.value; store.set('cdn_carrello', cc);
      });
      $('#checkout').addEventListener('click', () => {
        if (CONFIG.checkoutUrl) { location.href = CONFIG.checkoutUrl; return; }
        toast(`<span class="toast-ico">${Illustrazioni.icone.regalo}</span><span><strong>Checkout dimostrativo.</strong><br>Collega il pagamento in <code>CONFIG.checkoutUrl</code> (Shopify, Stripe…).</span>`);
      });
    };
    render();
  };

  /* ---------------- avvio ---------------- */
  document.addEventListener('DOMContentLoaded', () => {
    layout();
    const main = $('#main');
    const fn = pagine[document.body.dataset.page];
    if (fn && main) fn(main);
    caricaFoto();
  });
})();
