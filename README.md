# Coccole di Neve 🎄 — negozio di peluche Jellycat a tema natalizio

Sito statico multipagina (HTML + CSS + JavaScript, nessuna dipendenza) per un negozio in dropshipping
di peluche Jellycat natalizi. Estetica morbida e pastello, illustrazioni originali in SVG disegnate in codice.

## Pagine

| Pagina | Contenuto |
|---|---|
| `index.html` | Hero illustrato con neve, conto alla rovescia a Natale, categorie, bestseller, novità, recensioni, newsletter |
| `catalogo.html` | Catalogo **diviso in pagine** (8 peluche per pagina) con filtri per categoria, ricerca e ordinamento. Ogni categoria ha la sua pagina: `catalogo.html?categoria=amuseables`, `…=animali-delle-nevi`, `…=orsetti-e-amici` |
| `prodotto.html?id=…` | Scheda prodotto: galleria (foto / illustrazione / in confezione regalo), quantità, confezione regalo, stima di consegna, recensioni del prodotto e form |
| `recensioni.html` | Sezione recensioni: media, distribuzione voti, filtri, paginazione e form per scriverne una |
| `regali.html` | Guida ai regali (primo Natale, sotto i 30 €, collezionisti, decorazioni) |
| `spedizioni.html` | Calendario delle spedizioni natalizie, costi, resi e FAQ |
| `carrello.html` | Carrello con barra per la spedizione gratuita, confezione regalo e biglietto |

## Come si personalizza

Tutto è in **`assets/js/data.js`**:

- `CONFIG` — nome negozio, soglia spedizione gratuita, tempi di consegna del fornitore, ultimo giorno utile per Natale, URL del checkout, email.
- `PRODOTTI` — nome, prezzo, categoria, taglia, badge, descrizione. Il campo `tipo` sceglie l'illustrazione
  (`tree`, `pudding`, `sprout`, `candycane`, `cocoa`, `bauble`, `snowman`, `star`, `gingerbread`, `reindeer`,
  `polarbear`, `penguin`, `fox`, `owl`, `bunny`, `bear`, `mouse`).
- `CATEGORIE`, `GUIDA_REGALI`, `RECENSIONI`.

**Foto dei prodotti:** mettile in `assets/img/prodotti/` con il nome `<id-prodotto>.jpg`
(vedi `assets/img/prodotti/LEGGIMI.md`). Se una foto manca, il sito mostra l'illustrazione.

## Prima di andare online ⚠️

1. **Recensioni:** quelle in `RECENSIONI` sono *esempi* per l'anteprima. In Italia/UE pubblicare recensioni non reali
   è una pratica commerciale scorretta (Codice del Consumo, direttiva Omnibus). Imposta
   `CONFIG.mostraRecensioniEsempio = false` e usa recensioni vere (es. da Judge.me, Trustpilot o dal tuo backend).
   Le recensioni scritte dal form sono salvate solo nel browser di chi le scrive (`localStorage`): per renderle
   pubbliche serve un servizio di recensioni o un backend.
2. **Checkout:** imposta `CONFIG.checkoutUrl` (Shopify, Stripe Payment Links, ecc.). Il carrello è salvato in `localStorage`.
3. **Newsletter:** il form è dimostrativo; collegalo a Mailchimp/Brevo/Klaviyo.
4. **Marchio:** il sito si presenta come rivenditore indipendente (disclaimer nel footer). Verifica con il tuo
   fornitore che i prodotti siano originali e di poter usare nomi e foto.
5. Allinea nomi, prezzi e tempi di consegna con il catalogo del tuo fornitore e aggiungi Privacy/Cookie policy e Termini di vendita.

## Anteprima in locale

```bash
python3 -m http.server 8000
# poi apri http://localhost:8000
```

Si può pubblicare così com'è su GitHub Pages, Netlify o qualsiasi hosting statico.
