/* ==========================================================================
   UniTo Crowd — Funds TOgether | Motore Client-Side Unificato (script.js — V2)
   Progettato secondo le 10 Euristiche di Nielsen e i Principi di HCI
   Autori: Gruppo I (Stigliano Antonio, Tumolo Christian) — UniTo Informatica
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initGlobalModals();
  initLanguageToggle();
  initHeaderSearch();
  initCatalogPage();
  initProjectPage();
  initCheckoutPage();
  initProponiPage();
});

/* --------------------------------------------------------------------------
   1. SWITCH LINGUA GLOBALE IT | EN (Risolve H2 Pag. 12-16 e H8 Pag. 43)
   Sincronizza testi, placeholder, documenti legali Privacy e attributo lang
   -------------------------------------------------------------------------- */
function initLanguageToggle() {
  const savedLang = sessionStorage.getItem('unito_lang') || 'it';
  applyLanguage(savedLang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      sessionStorage.setItem('unito_lang', lang);
      applyLanguage(lang);
    });
  });
}

function applyLanguage(lang) {
  document.documentElement.setAttribute('lang', lang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  // Traduce tutti gli elementi dotati di attributi bilingui data-it e data-en
  document.querySelectorAll('[data-it][data-en]').forEach(el => {
    el.textContent = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-it');
  });

  // Traduce i placeholder dei campi di input e ricerca
  document.querySelectorAll('[data-placeholder-it][data-placeholder-en]').forEach(input => {
    input.placeholder = lang === 'en'
      ? input.getAttribute('data-placeholder-en')
      : input.getAttribute('data-placeholder-it');
  });

  // Traduce eventuali tooltip con attributi bilingui
  document.querySelectorAll('[data-tooltip-it][data-tooltip-en]').forEach(tip => {
    tip.setAttribute(
      'data-tooltip',
      lang === 'en' ? tip.getAttribute('data-tooltip-en') : tip.getAttribute('data-tooltip-it')
    );
  });

  // Sincronizza in tempo reale la modale Privacy Policy & Terms of Use (Risolve H2 Pag. 12-13)
  const privIt = document.getElementById('privacy-content-it');
  const privEn = document.getElementById('privacy-content-en');
  if (privIt && privEn) {
    privIt.style.display = lang === 'en' ? 'none' : 'block';
    privEn.style.display = lang === 'en' ? 'block' : 'none';
  }
}

/* --------------------------------------------------------------------------
   2. RICERCA GLOBALE DALL'HEADER (Azzeramento filtri restrittivi + Redirect)
   -------------------------------------------------------------------------- */
function initHeaderSearch() {
  const form = document.getElementById('header-search-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('header-search-input');
    const query = input ? input.value.trim() : '';

    // Salva la query cercata e imposta i filtri su "Tutti" per evitare falsi Empty State
    sessionStorage.setItem('unito_cat_query', query);
    sessionStorage.setItem('unito_cat_filter', 'all');
    sessionStorage.setItem('unito_status_filter', 'all');
    window.location.href = `catalogo.html${query ? `?q=${encodeURIComponent(query)}` : ''}`;
  });
}

/* --------------------------------------------------------------------------
   3. MODALE UNIFICATA DI LOGIN + ANTEPRIMA DASHBOARD E MODALE PRIVACY BILINGUE
   (Risolve H4 Login sparsi Pag. 26-27, H2 Vecchio Username Pag. 19,
    H3/H4 Navbar e Tasto Home in Dashboard Pag. 23 e 28-29, H2 Privacy Pag. 12-13)
   -------------------------------------------------------------------------- */
function initGlobalModals() {
  const modalHTML = `
    <!-- MODALE UNIFICATA ACCEDI (Progettista / Partner CSR / Sostenitore) -->
    <div id="login-modal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
      <div class="modal-content">
        <button type="button" class="modal-close" data-close-modal="login-modal" aria-label="Chiudi finestra">✕</button>

        <!-- VISTA 1: FORM DI ACCESSO UNIFICATO (Senza avviso criptico sul vecchio username - H2) -->
        <div id="login-view-form">
          <span class="badge badge-active" style="margin-bottom:8px;"
                data-it="✓ Accesso Unificato d'Ateneo (Euristica 4)"
                data-en="✓ Unified University Login (Heuristic 4)">
            ✓ Accesso Unificato d'Ateneo (Euristica 4)
          </span>
          <h2 id="login-modal-title" style="color:var(--unito-navy); margin-bottom:6px;"
              data-it="Accedi a UniTo Crowd — Funds TOgether"
              data-en="Sign in to UniTo Crowd — Funds TOgether">
            Accedi a UniTo Crowd — Funds TOgether
          </h2>
          <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:16px;"
             data-it="Un unico punto di accesso centralizzato per Ricercatori Proponenti, Enti Partner CSR e Sostenitori (elimina la dispersione tra Header e Footer)."
             data-en="A single centralized login point for Proposing Researchers, CSR Partners, and Backers (eliminating scattered Header/Footer logins).">
             Un unico punto di accesso centralizzato per Ricercatori Proponenti, Enti Partner CSR e Sostenitori (elimina la dispersione tra Header e Footer).
          </p>

          <div class="filter-pills" style="margin-bottom:18px;" id="login-role-pills" role="group" aria-label="Seleziona il tuo profilo">
            <button type="button" class="pill-btn active"
                    data-role-key="researcher"
                    data-role="Ricercatrice / Progettista UniTo"
                    data-demo-email="chiara.ferrero@unito.it">
              🎓 Progettista UniTo (Chiara)
            </button>
            <button type="button" class="pill-btn"
                    data-role-key="partner"
                    data-role="Partner CSR / Sustainability Manager"
                    data-demo-email="m.dubois@alpinebiotech.eu">
              🏢 Partner CSR (Marc)
            </button>
            <button type="button" class="pill-btn"
                    data-role-key="backer"
                    data-role="Sostenitore / Comunità"
                    data-demo-email="elena.rostagno@istruzione.it">
              ❤️ Sostenitore (Elena)
            </button>
          </div>

          <form id="unified-login-form">
            <div class="form-group">
              <label for="login-email" data-it="Email Istituzionale (@unito.it) o Personale (*)"
                     data-en="Institutional (@unito.it) or Personal Email (*)">
                Email Istituzionale (@unito.it) o Personale (*)
              </label>
              <input type="email" id="login-email" class="form-input input-valid" value="chiara.ferrero@unito.it" required>
            </div>
            <div class="form-group">
              <label for="login-pass">Password (*)</label>
              <input type="password" id="login-pass" class="form-input input-valid" value="••••••••••••" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;">
              <span data-it="Accedi come " data-en="Sign in as ">Accedi come </span>
              <span id="selected-role-label" style="margin-left:4px;">Ricercatrice / Progettista UniTo</span> →
            </button>
          </form>
        </div>

        <!-- VISTA 2: DASHBOARD RISERVATA CON NAVBAR E TASTO "TORNA ALLA HOME" PRESERVATI (Risolve H3/H4 Pag. 23 e 28-29) -->
        <div id="login-view-dashboard" style="display:none;">
          <div style="background:var(--unito-navy); color:#ffffff; padding:12px 16px; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:16px;">
            <strong id="dash-header-badge">🏛️ Area Progettisti UniTo</strong>
            <nav aria-label="Navigazione persistente Area Riservata" style="display:flex; gap:14px; font-size:0.85rem; align-items:center;">
              <a href="index.html" style="color:var(--accent-gold); font-weight:800; text-decoration:underline;">🏠 Torna alla Home</a>
              <a href="catalogo.html" style="color:#ffffff;">Esplora Progetti</a>
              <a href="proponi.html#faq-section" style="color:#ffffff;">FAQ & Guida</a>
              <a href="partner.html" style="color:#ffffff;">Partner</a>
            </nav>
          </div>

          <span class="badge badge-active" style="margin-bottom:6px;">
            ✓ Continuità Visiva e Tasto Home Garantiti (Euristiche 3 e 4)
          </span>
          <h3 id="dash-welcome-title" style="color:var(--unito-navy); margin-bottom:6px;">
            Benvenuta, Dott.ssa Chiara Ferrero (DISAFA UniTo)
          </h3>
          <p id="dash-welcome-sub" style="font-size:0.88rem; color:var(--text-muted); margin-bottom:16px;">
            A differenza della vecchia piattaforma, l'Area Riservata mantiene sempre visibile la barra di navigazione principale e il link rapido per tornare alla Home Page.
          </p>

          <div id="dash-card-content" style="border:1.5px solid var(--border-color); padding:16px; border-radius:var(--radius-sm); background:var(--bg-subtle); margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span class="badge badge-active">In Pre-Campagna • Step 3/4</span>
              <span style="font-size:0.8rem; font-weight:700; color:var(--unito-navy);">Protocollo #CAND-UNITO-2026-19</span>
            </div>
            <h4 style="color:var(--unito-navy); font-size:1.05rem; margin-bottom:4px;">
              PolliNet: Monitoraggio Bioacustico degli Impollinatori Alpini
            </h4>
            <p style="font-size:0.86rem; color:var(--text-muted);">
              <strong>Budget:</strong> 8.000 € (4.000 € Community + 4.000 € Match-Funding UniTo) • <strong>Campaign Manager:</strong> Dott.ssa Flavia Dian
            </p>
          </div>

          <div style="display:flex; gap:10px; justify-content:space-between; flex-wrap:wrap;">
            <button type="button" class="btn btn-outline" id="back-to-login-btn">← Cambia Profilo / Esci</button>
            <div style="display:flex; gap:8px;">
              <a href="index.html" class="btn btn-secondary">🏠 Vai alla Home</a>
              <a href="proponi.html" id="dash-primary-action" class="btn btn-primary">Gestisci Proposta →</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODALE INFORMATIVA PRIVACY & CONDIZIONI D'USO REALMENTE BILINGUE (Risolve H2 Pag. 12-13) -->
    <div id="privacy-modal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="privacy-modal-heading">
      <div class="modal-content">
        <button type="button" class="modal-close" data-close-modal="privacy-modal" aria-label="Chiudi informativa">✕</button>

        <!-- Versione Italiana (Mostrata quando la lingua è IT) -->
        <div id="privacy-content-it">
          <span class="badge badge-active">✓ Documento Legale in Italiano (Coerente con lingua IT)</span>
          <h2 id="privacy-modal-heading" style="color:var(--unito-navy); margin:8px 0;">
            Informativa Privacy e Condizioni d'Uso (UE GDPR 2016/679)
          </h2>
          <p style="font-size:0.9rem; margin-bottom:10px;">
            <strong>1. Titolare del Trattamento:</strong> Università degli Studi di Torino (Via Verdi 8, 10124 Torino) in co-titolarità con il gestore tecnologico Ginger Crowdfunding S.r.l. Società Benefit, ai sensi dell'art. 13 del Regolamento UE 2016/679 (GDPR).
          </p>
          <p style="font-size:0.9rem; margin-bottom:10px;">
            <strong>2. Tutela del Donatore e Regola "O tutto o niente":</strong> I dati inseriti nel Checkout sono trattati esclusivamente per elaborare la transazione liberale, emettere la ricevuta fiscale detraibile e disporre il rimborso automatico integrale (100%) qualora la campagna non raggiunga l'obiettivo entro la scadenza.
          </p>
          <p style="font-size:0.84rem; color:var(--text-muted);">
            <em>Nota HCI (Euristica 2): Commutando il selettore lingua dell'header su <strong>EN</strong>, questo documento viene integralmente servito in lingua inglese per garantire un reale consenso informato agli utenti internazionali.</em>
          </p>
        </div>

        <!-- Versione Inglese Ufficiale (Mostrata quando la lingua è EN — Risolve H2 Pag. 12-13 Assignment 1) -->
        <div id="privacy-content-en" style="display:none;">
          <span class="badge badge-active">✓ Official English Legal Document (Synced with EN Language)</span>
          <h2 style="color:var(--unito-navy); margin:8px 0;">
            Privacy Policy & Terms of Use (EU GDPR Regulation 2016/679)
          </h2>
          <p style="font-size:0.9rem; margin-bottom:10px;">
            <strong>1. Data Controller:</strong> University of Turin (Università degli Studi di Torino, Via Verdi 8, 10124 Turin, Italy), acting in joint controllership with Ginger Crowdfunding S.r.l. Benefit Corporation under Art. 13 of EU Regulation 2016/679 (GDPR).
          </p>
          <p style="font-size:0.9rem; margin-bottom:10px;">
            <strong>2. Backer Protection & "All-or-Nothing" Rule:</strong> Personal data provided during Checkout is processed strictly to execute your pledge, issue official tax-deductible receipts for citizens and CSR corporate partners, and guarantee a 100% automatic refund if the campaign does not reach its goal.
          </p>
          <p style="font-size:0.84rem; color:var(--text-muted);">
            <em>HCI Note (Heuristic 2): Unlike the previous website where English links opened Italian legal texts, this document matches the active language selected by international users.</em>
          </p>
        </div>

        <div style="margin-top:18px; display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn btn-secondary" data-close-modal="privacy-modal"
                  data-it="✓ Ho letto e compreso (Chiudi)" data-en="✓ I have read and understood (Close)">
            ✓ Ho letto e compreso (Chiudi)
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Apertura Modale Unificata Login
  document.querySelectorAll('[data-open-login]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('login-modal').classList.add('open');
    });
  });

  // Apertura Modale Privacy sincronizzata con la lingua attiva IT | EN
  document.querySelectorAll('[data-open-privacy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentLang = sessionStorage.getItem('unito_lang') || 'it';
      document.getElementById('privacy-content-it').style.display = currentLang === 'en' ? 'none' : 'block';
      document.getElementById('privacy-content-en').style.display = currentLang === 'en' ? 'block' : 'none';
      document.getElementById('privacy-modal').classList.add('open');
    });
  });

  // Chiusura tramite bottone ✕
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-close-modal');
      const modal = document.getElementById(target);
      if (modal) modal.classList.remove('open');
    });
  });

  // Chiusura Universale tramite tasto ESC o clic fuori dal box (Euristica 3 — Controllo e Libertà)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList && e.target.classList.contains('modal-backdrop')) {
      e.target.classList.remove('open');
    }
  });

  // Selezione Ruolo nella Modale Login (Pre-compila i dati reali di Chiara, Marc o Elena)
  let currentRoleKey = 'researcher';
  document.querySelectorAll('#login-role-pills .pill-btn').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#login-role-pills .pill-btn').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentRoleKey = pill.getAttribute('data-role-key') || 'researcher';
      document.getElementById('selected-role-label').textContent = pill.getAttribute('data-role');
      const demoEmail = pill.getAttribute('data-demo-email');
      if (demoEmail) document.getElementById('login-email').value = demoEmail;
    });
  });

  // Submit Login -> Mostra la Dashboard adattata al profilo con Navbar e Tasto Home sempre visibili
  const loginForm = document.getElementById('unified-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dashBadge = document.getElementById('dash-header-badge');
      const dashTitle = document.getElementById('dash-welcome-title');
      const dashCard = document.getElementById('dash-card-content');
      const dashAction = document.getElementById('dash-primary-action');

      if (currentRoleKey === 'partner') {
        dashBadge.textContent = '🏢 Area Partner & CSR UniTo';
        dashTitle.textContent = 'Welcome, Marc Dubois (Alpine BioTech CSR)';
        dashCard.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span class="badge badge-active">Partner CSR Accreditato • Bilancio ESG 2026</span>
            <span style="font-size:0.8rem; font-weight:700; color:var(--unito-navy);">Contributo: 15.000 €</span>
          </div>
          <h4 style="color:var(--unito-navy); font-size:1.05rem; margin-bottom:4px;">Progetti Co-Finanziati: BRIGHT (221%) & MILK-ACT (88%)</h4>
          <p style="font-size:0.86rem; color:var(--text-muted);">Rendicontazione fNIRS disponibile nella Timeline • Ricevute fiscali IT/EN pronte per il Board.</p>
        `;
        dashAction.href = 'partner.html';
        dashAction.textContent = 'Vai alla Vetrina Partner →';
      } else if (currentRoleKey === 'backer') {
        dashBadge.textContent = '❤️ Area Sostenitori UniTo';
        dashTitle.textContent = 'Benvenuta, Elena Rostagno (Donatrice Verificata)';
        dashCard.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span class="badge badge-active">Donazione Registrata #UNITO-2026-8492</span>
            <span style="font-size:0.8rem; font-weight:700; color:var(--success-green);">50,00 € (Impatto 2x: 100,00 €)</span>
          </div>
          <h4 style="color:var(--unito-navy); font-size:1.05rem; margin-bottom:4px;">Progetto Sostenuto: MILK-ACT (VIRMOLAB Medicina)</h4>
          <p style="font-size:0.86rem; color:var(--text-muted);">Ricompensa: Microguida MILK-ACT + Hall of Fame • Ricevuta detraibile disponibile.</p>
        `;
        dashAction.href = 'progetto.html?proj=milk-act';
        dashAction.textContent = 'Vai al Progetto Sostenuto →';
      } else {
        dashBadge.textContent = '🏛️ Area Progettisti UniTo';
        dashTitle.textContent = 'Benvenuta, Dott.ssa Chiara Ferrero (DISAFA UniTo)';
        dashCard.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span class="badge badge-active">In Pre-Campagna • Step 3/4</span>
            <span style="font-size:0.8rem; font-weight:700; color:var(--unito-navy);">Protocollo #CAND-UNITO-2026-19</span>
          </div>
          <h4 style="color:var(--unito-navy); font-size:1.05rem; margin-bottom:4px;">PolliNet: Monitoraggio Bioacustico degli Impollinatori Alpini</h4>
          <p style="font-size:0.86rem; color:var(--text-muted);"><strong>Budget:</strong> 8.000 € (4.000 € Community + 4.000 € Match-Funding UniTo) • <strong>Campaign Manager:</strong> Dott.ssa Flavia Dian</p>
        `;
        dashAction.href = 'proponi.html';
        dashAction.textContent = 'Gestisci Proposta →';
      }

      document.getElementById('login-view-form').style.display = 'none';
      document.getElementById('login-view-dashboard').style.display = 'block';
    });
  }

  const backBtn = document.getElementById('back-to-login-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      document.getElementById('login-view-dashboard').style.display = 'none';
      document.getElementById('login-view-form').style.display = 'block';
    });
  }
}

/* --------------------------------------------------------------------------
   4. LOGICA PAGINA CATALOGO: FILTRI, RICERCA, EMPTY STATE E DOPPIA PERSISTENZA
   (Risolve H3 Reset Stato Gravità 4 con SessionStorage + URL Params,
    H7 Filtri/Ordinamento e H9 Empty State — Pag. 20-21, 37-38, 48-49 Ass. 1)
   -------------------------------------------------------------------------- */
function initCatalogPage() {
  const catalogGrid = document.getElementById('catalog-projects-grid');
  if (!catalogGrid) return;

  const cards = Array.from(catalogGrid.querySelectorAll('.project-card'));
  const catButtons = document.querySelectorAll('[data-filter-cat]');
  const statusButtons = document.querySelectorAll('[data-filter-status]');
  const sortSelect = document.getElementById('catalog-sort');
  const searchInput = document.getElementById('catalog-search');
  const emptyState = document.getElementById('catalog-empty-state');
  const emptyQuerySpan = document.getElementById('empty-query-text');
  const countSpan = document.getElementById('catalog-results-count');
  const resetBtn = document.getElementById('reset-filters-btn');
  const emptyResetBtn = document.getElementById('empty-reset-btn');
  const testEmptyBtn = document.getElementById('test-empty-state-btn');

  // Legge lo stato iniziale combinando eventuali parametri URL e il sessionStorage
  const params = new URLSearchParams(window.location.search);
  let state = {
    cat: params.get('cat') || sessionStorage.getItem('unito_cat_filter') || 'all',
    status: params.get('status') || sessionStorage.getItem('unito_status_filter') || 'all',
    sort: params.get('sort') || sessionStorage.getItem('unito_sort') || 'goal',
    query: params.get('q') !== null ? params.get('q') : (sessionStorage.getItem('unito_cat_query') || '')
  };

  function updateCatalogUI() {
    // 1. Salva stato in sessionStorage (così tornando indietro col browser non si resetta mai!)
    sessionStorage.setItem('unito_cat_filter', state.cat);
    sessionStorage.setItem('unito_status_filter', state.status);
    sessionStorage.setItem('unito_sort', state.sort);
    sessionStorage.setItem('unito_cat_query', state.query);

    // 2. Aggiorna dinamicamente l'URL senza ricaricare la pagina (Come proposto a Pag. 21 Ass. 1)
    const urlParams = new URLSearchParams();
    if (state.cat !== 'all') urlParams.set('cat', state.cat);
    if (state.status !== 'all') urlParams.set('status', state.status);
    if (state.sort !== 'goal') urlParams.set('sort', state.sort);
    if (state.query) urlParams.set('q', state.query);
    const newUrl = urlParams.toString()
      ? `${window.location.pathname}?${urlParams.toString()}`
      : window.location.pathname;
    window.history.replaceState(state, '', newUrl);

    // 3. Sincronizza stato visivo dei controlli
    catButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter-cat') === state.cat));
    statusButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter-status') === state.status));
    if (sortSelect) sortSelect.value = state.sort;
    if (searchInput && searchInput.value !== state.query) searchInput.value = state.query;

    // 4. Filtra le card
    const visibleCards = cards.filter(card => {
      const cCat = card.getAttribute('data-cat');
      const cStatus = card.getAttribute('data-status');
      const cText = card.textContent.toLowerCase();
      const matchCat = state.cat === 'all' || cCat === state.cat;
      const matchStatus = state.status === 'all' || cStatus === state.status;
      const matchQuery = !state.query || cText.includes(state.query.toLowerCase());
      return matchCat && matchStatus && matchQuery;
    });

    // 5. Ordina le card visibili
    visibleCards.sort((a, b) => {
      if (state.sort === 'raised') {
        return Number(b.getAttribute('data-raised')) - Number(a.getAttribute('data-raised'));
      }
      if (state.sort === 'recent') {
        return Number(b.getAttribute('data-order')) - Number(a.getAttribute('data-order'));
      }
      return Number(b.getAttribute('data-pct')) - Number(a.getAttribute('data-pct'));
    });

    cards.forEach(c => (c.style.display = 'none'));
    visibleCards.forEach(c => {
      c.style.display = 'flex';
      catalogGrid.appendChild(c);
    });

    if (countSpan) countSpan.textContent = visibleCards.length;

    // 6. Gestione Empty State costruttivo (Risolve H9 Pag. 48-49 Assignment 1)
    if (visibleCards.length === 0) {
      catalogGrid.style.display = 'none';
      emptyState.style.display = 'block';
      if (emptyQuerySpan) {
        const lang = sessionStorage.getItem('unito_lang') || 'it';
        emptyQuerySpan.textContent = state.query || (lang === 'en' ? 'selected filters' : 'i filtri selezionati');
      }
    } else {
      catalogGrid.style.display = 'grid';
      emptyState.style.display = 'none';
    }
  }

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      state.cat = btn.getAttribute('data-filter-cat');
      updateCatalogUI();
    });
  });

  statusButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      state.status = btn.getAttribute('data-filter-status');
      updateCatalogUI();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.sort = sortSelect.value;
      updateCatalogUI();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      state.query = searchInput.value.trim();
      updateCatalogUI();
    });
  }

  function resetAllFilters() {
    state = { cat: 'all', status: 'all', sort: 'goal', query: '' };
    if (searchInput) searchInput.value = '';
    updateCatalogUI();
  }

  if (resetBtn) resetBtn.addEventListener('click', resetAllFilters);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAllFilters);

  // Bottone di test per simulare la query "provaprovaababaab" dell'Assignment 1 (Pag. 48-49)
  if (testEmptyBtn) {
    testEmptyBtn.addEventListener('click', () => {
      state.query = 'provaprovaababaab';
      if (searchInput) searchInput.value = state.query;
      updateCatalogUI();
    });
  }

  updateCatalogUI();
}

/* --------------------------------------------------------------------------
   5. LOGICA SCHEDA PROGETTO (Switch Attivo/Concluso, Blocco Invio H4, Tab)
   (Risolve H4 Gravità 4 Pag. 24-25: disabilita i form sui progetti conclusi)
   -------------------------------------------------------------------------- */
function initProjectPage() {
  const projectPage = document.getElementById('project-detail-page');
  if (!projectPage) return;

  // Gestione Tab navigabili
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  // Switcher tra Progetti Attivi (MILK-ACT / SpeechMatE) e Progetto Concluso (BRIGHT)
  const switcherBtns = document.querySelectorAll('[data-switch-project]');
  const params = new URLSearchParams(window.location.search);
  const initialProj = params.get('proj') || sessionStorage.getItem('unito_current_proj') || 'milk-act';

  function renderProjectState(projKey) {
    sessionStorage.setItem('unito_current_proj', projKey);
    window.history.replaceState({ proj: projKey }, '', `${window.location.pathname}?proj=${projKey}`);

    switcherBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-switch-project') === projKey));

    const isClosed = projKey === 'bright';
    const titleEl = document.getElementById('proj-title');
    const deptEl = document.getElementById('proj-dept');
    const breadcrumbEl = document.getElementById('proj-breadcrumb-name');
    const statusBadge = document.getElementById('proj-status-badge');
    const raisedEl = document.getElementById('proj-raised');
    const goalEl = document.getElementById('proj-goal');
    const donorsEl = document.getElementById('proj-donors');
    const daysEl = document.getElementById('proj-days');
    const barFill = document.getElementById('proj-bar-fill');
    const closedAlert = document.getElementById('closed-project-alert');
    const customInput = document.getElementById('custom-donation-input');
    const customBtn = document.getElementById('custom-donation-btn');
    const rewardCards = document.querySelectorAll('.reward-option');

    if (projKey === 'speechmate') {
      titleEl.textContent = 'SpeechMatE: Matematica Vocale Accessibile per Studenti con Disabilità Motorie';
      deptEl.textContent = 'Responsabile Scientifico: Prof.ssa Sofia Polin — Dipartimento di Matematica "Giuseppe Peano" UniTo';
      breadcrumbEl.textContent = 'SpeechMatE';
      raisedEl.textContent = '8.450 €';
      goalEl.textContent = 'raccolti su 10.000 € (5.000 € Community + 5.000 € Raddoppio UniTo)';
      donorsEl.textContent = '👥 142 sostenitori';
      daysEl.textContent = '⏳ 19 giorni al termine';
    } else if (projKey === 'bright') {
      titleEl.textContent = 'BRIGHT: Brain Research in Interactive Gaming & Human Technology';
      deptEl.textContent = 'Gruppo Neuroscienze Cognitive — Dipartimento di Psicologia UniTo';
      breadcrumbEl.textContent = 'BRIGHT (Campagna Conclusa)';
      raisedEl.textContent = '22.182 €';
      goalEl.textContent = 'raccolti su 10.000 € (Obiettivo Raggiunto al 221% + Cofinanziamento UniTo)';
      donorsEl.textContent = '👥 111 sostenitori';
      daysEl.textContent = '🔒 Campagna Conclusa';
    } else {
      titleEl.textContent = 'MILK-ACT: Proteggere i più piccoli dai virus di domani attraverso il latte materno';
      deptEl.textContent = 'Responsabile Scientifico: Prof.ssa Valeria Rossi — VIRMOLAB Dip. Scienze Cliniche e Biologiche UniTo';
      breadcrumbEl.textContent = 'MILK-ACT';
      raisedEl.textContent = '14.200 €';
      goalEl.textContent = 'raccolti su 16.000 € (8.000 € Community + 8.000 € Raddoppio UniTo)';
      donorsEl.textContent = '👥 198 sostenitori';
      daysEl.textContent = '⏳ Scade il 17/11/2026';
    }

    // Risolve H4 Gravità 4 (Pag. 24-25 Ass. 1): disabilita uniformemente tutti i campi sui progetti conclusi
    if (isClosed) {
      statusBadge.className = 'badge badge-closed';
      statusBadge.textContent = '🔒 Campagna Conclusa — Raccolta Chiusa';
      barFill.classList.add('closed');
      if (closedAlert) closedAlert.style.display = 'block';
      customInput.disabled = true;
      customInput.setAttribute('disabled', 'disabled');
      customInput.value = '';
      customInput.placeholder = 'Raccolta fondi terminata (Input disabilitato)';
      customBtn.disabled = true;
      customBtn.setAttribute('disabled', 'disabled');
      customBtn.textContent = '🔒 Campagna Conclusa';
      rewardCards.forEach(card => {
        card.classList.add('disabled');
        card.classList.remove('selected');
        const btn = card.querySelector('button');
        if (btn) {
          btn.disabled = true;
          btn.setAttribute('disabled', 'disabled');
          btn.textContent = '🔒 Non selezionabile (Progetto Concluso)';
        }
      });
    } else {
      statusBadge.className = 'badge badge-active';
      statusBadge.textContent = '● Campagna Attiva — Sostenibile Ora';
      barFill.classList.remove('closed');
      if (closedAlert) closedAlert.style.display = 'none';
      customInput.disabled = false;
      customInput.removeAttribute('disabled');
      if (!customInput.value) customInput.value = '25';
      customInput.placeholder = 'Importo € (min. 5€)';
      customBtn.disabled = false;
      customBtn.removeAttribute('disabled');
      customBtn.textContent = 'Dona Ora →';
      rewardCards.forEach(card => {
        card.classList.remove('disabled');
        const btn = card.querySelector('button');
        if (btn) {
          btn.disabled = false;
          btn.removeAttribute('disabled');
          const amt = card.getAttribute('data-amount');
          btn.textContent = `Scegli questa ricompensa (${amt} €) →`;
        }
      });
    }
  }

  switcherBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      renderProjectState(btn.getAttribute('data-switch-project'));
    });
  });

  // Prevenzione assoluta del bug "Invio -> Redirect alla Home" nel form Fai Tu (H4 Gravità 4)
  const customForm = document.getElementById('custom-donation-form');
  if (customForm) {
    customForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const customInput = document.getElementById('custom-donation-input');
      if (!customInput || customInput.disabled) return false;
      const val = Math.max(5, Number(customInput.value) || 25);
      sessionStorage.setItem('unito_checkout_amount', val);
      sessionStorage.setItem('unito_checkout_reward', 'Contributo Libero ("Fai tu") — Attestato Ufficiale UniTo');
      window.location.href = `checkout.html?amount=${val}`;
    });
  }

  // Click sulle card ricompensa
  document.querySelectorAll('.reward-option').forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('disabled')) return;
      const amt = card.getAttribute('data-amount');
      const title = card.getAttribute('data-reward-title');
      sessionStorage.setItem('unito_checkout_amount', amt);
      sessionStorage.setItem('unito_checkout_reward', title);
      window.location.href = `checkout.html?amount=${amt}`;
    });
  });

  renderProjectState(initialProj);
}

/* --------------------------------------------------------------------------
   6. LOGICA CHECKOUT: INLINE VALIDATION DIAGNOSTICA E TOTALE DINAMICO
   (Risolve H1 Totale Destra Pag. 10-11, H5 Inline Validation Gravità 3 Pag. 34-35,
    H8 Monolingue Pag. 43 Assignment 1)
   -------------------------------------------------------------------------- */
function initCheckoutPage() {
  const checkoutForm = document.getElementById('checkout-form');
  if (!checkoutForm) return;

  const amountInput = document.getElementById('chk-amount');
  const nameInput = document.getElementById('chk-name');
  const emailInput = document.getElementById('chk-email');
  const privacyCheck = document.getElementById('chk-privacy');
  const anonCheck = document.getElementById('chk-anon');
  const submitBtn = document.getElementById('chk-submit-btn');

  const summaryAmount = document.getElementById('summary-amount-val');
  const summaryTotal = document.getElementById('summary-total-val');
  const summaryReward = document.getElementById('summary-reward-title');

  const params = new URLSearchParams(window.location.search);
  const savedAmt = params.get('amount') || sessionStorage.getItem('unito_checkout_amount') || '50';
  const savedReward = sessionStorage.getItem('unito_checkout_reward') || 'Microguida Scientifica MILK-ACT + Hall of Fame Digitale (50 €)';

  amountInput.value = savedAmt;
  if (summaryReward) summaryReward.textContent = savedReward;

  function updateSummaryTotal() {
    const val = Number(amountInput.value);
    const formatted = val >= 5 ? `${val.toFixed(2).replace('.', ',')} €` : '0,00 €';
    if (summaryAmount) summaryAmount.textContent = formatted;
    if (summaryTotal) summaryTotal.textContent = formatted;
  }

  function validateAmount() {
    const val = Number(amountInput.value);
    const fb = document.getElementById('fb-amount');
    const lang = sessionStorage.getItem('unito_lang') || 'it';
    if (!val || val < 5) {
      amountInput.classList.add('input-error');
      amountInput.classList.remove('input-valid');
      fb.className = 'field-feedback error';
      fb.textContent = lang === 'en'
        ? '⚠️ Minimum donation amount is 5.00 €.'
        : '⚠️ Inserisci un importo minimo di almeno 5,00 €.';
      return false;
    }
    amountInput.classList.remove('input-error');
    amountInput.classList.add('input-valid');
    fb.className = 'field-feedback valid';
    fb.textContent = lang === 'en'
      ? '✓ Valid amount (€0.00 platform fees).'
      : '✓ Importo valido (0,00 € commissioni).';
    return true;
  }

  function validateName() {
    const val = nameInput.value.trim();
    const fb = document.getElementById('fb-name');
    const lang = sessionStorage.getItem('unito_lang') || 'it';
    if (val.length < 3 || !val.includes(' ')) {
      nameInput.classList.add('input-error');
      nameInput.classList.remove('input-valid');
      fb.className = 'field-feedback error';
      fb.textContent = lang === 'en'
        ? '⚠️ Please enter both First and Last Name (e.g. Elena Rostagno).'
        : '⚠️ Inserisci sia il Nome che il Cognome (es. Elena Rostagno).';
      return false;
    }
    nameInput.classList.remove('input-error');
    nameInput.classList.add('input-valid');
    fb.className = 'field-feedback valid';
    fb.textContent = lang === 'en'
      ? '✓ Full name verified for tax receipt.'
      : '✓ Nome e cognome inseriti correttamente.';
    return true;
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    const fb = document.getElementById('fb-email');
    const lang = sessionStorage.getItem('unito_lang') || 'it';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!val.includes('@')) {
      emailInput.classList.add('input-error');
      emailInput.classList.remove('input-valid');
      fb.className = 'field-feedback error';
      fb.textContent = lang === 'en'
        ? '⚠️ Invalid format: missing "@" symbol (e.g. name@domain.it).'
        : '⚠️ Formato errato: manca il simbolo "@" (es. elena.rostagno@dominio.it).';
      return false;
    }
    if (!emailRegex.test(val)) {
      emailInput.classList.add('input-error');
      emailInput.classList.remove('input-valid');
      fb.className = 'field-feedback error';
      fb.textContent = lang === 'en'
        ? '⚠️ Incomplete domain after "@" (e.g. .it, .com, @unito.it).'
        : '⚠️ Completa il dominio dell\'email dopo la "@" (es. .it, .com, @unito.it).';
      return false;
    }
    emailInput.classList.remove('input-error');
    emailInput.classList.add('input-valid');
    fb.className = 'field-feedback valid';
    fb.textContent = lang === 'en'
      ? '✓ Valid email address for instant receipt delivery.'
      : '✓ Formato email valido per l\'invio della ricevuta.';
    return true;
  }

  function checkOverallValidity() {
    updateSummaryTotal();
    const isAmtOk = Number(amountInput.value) >= 5;
    const isNameOk = nameInput.value.trim().length >= 3 && nameInput.value.trim().includes(' ');
    const isEmailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailInput.value.trim());
    const isPrivOk = privacyCheck.checked;
    submitBtn.disabled = !(isAmtOk && isNameOk && isEmailOk && isPrivOk);
  }

  amountInput.addEventListener('input', () => { validateAmount(); checkOverallValidity(); });
  nameInput.addEventListener('input', () => { validateName(); checkOverallValidity(); });
  emailInput.addEventListener('input', () => { validateEmail(); checkOverallValidity(); });
  nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('blur', validateEmail);
  privacyCheck.addEventListener('change', checkOverallValidity);

  // Bottone per simulare l'errore email "emailemail" dell'Assignment 1 (Pag. 34-35)
  const testInvalidEmailBtn = document.getElementById('test-invalid-email-btn');
  if (testInvalidEmailBtn) {
    testInvalidEmailBtn.addEventListener('click', () => {
      emailInput.value = 'emailemail';
      nameInput.value = 'Elena Rostagno';
      validateName();
      validateEmail();
      checkOverallValidity();
      emailInput.focus();
    });
  }

  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateAmount() || !validateName() || !validateEmail() || !privacyCheck.checked) return;

    document.getElementById('checkout-main-grid').style.display = 'none';
    const receiptBox = document.getElementById('checkout-receipt-box');
    receiptBox.style.display = 'block';
    document.getElementById('receipt-donor-name').textContent = anonCheck.checked
      ? `${nameInput.value} (Visibile pubblicamente come: Donatore Anonimo)`
      : nameInput.value;
    document.getElementById('receipt-donor-email').textContent = emailInput.value;
    document.getElementById('receipt-amount').textContent = `${Number(amountInput.value).toFixed(2).replace('.', ',')} €`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  updateSummaryTotal();
}

/* --------------------------------------------------------------------------
   7. LOGICA PAGINA PROPONI PROGETTO: CALCOLATORE MATCH-FUNDING E CANDIDATURA
   (Risolve H10 Pag. 51 Servizi vaghi e mostra il raddoppio fino a 10.000 €)
   -------------------------------------------------------------------------- */
function initProponiPage() {
  const slider = document.getElementById('match-budget-slider');
  if (!slider) return;

  const totalOut = document.getElementById('calc-total-budget');
  const commOut = document.getElementById('calc-community-share');
  const unitoOut = document.getElementById('calc-unito-share');

  function updateCalculator() {
    const total = Number(slider.value);
    // UniTo raddoppia fino a un massimo di 10.000 € di quota Ateneo (Pag. 7 Assignment 1)
    const unitoMatch = Math.min(total / 2, 10000);
    const communityNeeded = total - unitoMatch;
    if (totalOut) totalOut.textContent = `${total.toLocaleString('it-IT')} €`;
    if (commOut) commOut.textContent = `${communityNeeded.toLocaleString('it-IT')} €`;
    if (unitoOut) unitoOut.textContent = `${unitoMatch.toLocaleString('it-IT')} €`;
  }

  slider.addEventListener('input', updateCalculator);
  updateCalculator();

  const propForm = document.getElementById('proponi-candidatura-form');
  if (propForm) {
    propForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (e.defaultPrevented && document.getElementById('prop-submit-btn')?.disabled) return;
      propForm.style.display = 'none';
      const successBox = document.getElementById('proponi-success-box');
      if (successBox) successBox.style.display = 'block';
    });
  }
}