// src/index.js
import { initMap } from './map_components/map/initMap.js';
// import { parseData } from './utils/dataParser.js';
import { loadConfiguration } from './utils/configLoader.js';
import { UniversalNav } from './navigation/universalNav.js';
import { UniversalFooter } from './navigation/universalFooter.js';
import './styles/tailwind.css'
import './styles/fonts.css'


function initializeScrollytelling() {
  const sectionsContainer = document.querySelector('.sections-container');
  const sections = document.querySelectorAll('.section-fullscreen[data-section-id]');
  const indicators = document.querySelectorAll('.indicator');
  const navLinks = document.querySelectorAll('.nav-link');
  // const sectionButtons = document.querySelectorAll('.section-btn');

  let currentSection = 0;
  let isScrolling = false;
  let isManualScroll = false;

  // sectionButtons.forEach((button) => {
  //   button.addEventListener('click', (e) => {
  //     e.preventDefault(); // Previene comportamenti di default

  //     const targetSection = parseInt(button.getAttribute('data-section'));
  //     // Verifica che la sezione target sia valida
  //     if (!isNaN(targetSection) && targetSection >= 0 && targetSection < sections.length) {
  //       console.log(`Navigazione verso sezione ${targetSection} tramite bottone`);
  //       goToSection(targetSection);
  //     } else {
  //       console.warn(`Sezione target non valida: ${targetSection}`);
  //     }
  //   });
  // });

  function ensureContainerHeight() {
    if (sectionsContainer) {
      sectionsContainer.style.height = '100vh';
      sectionsContainer.style.overflow = 'auto';
      sectionsContainer.style.display = 'block';
      // Add smooth scrolling if desired
      sectionsContainer.style.scrollBehavior = 'smooth';
    }

    // Ensure sections have correct height
    sections.forEach(section => {
      section.style.minHeight = '100vh';
      section.style.display = 'flex';
      section.style.justifyContent = 'center'; // Center content
      section.style.boxSizing = 'border-box'; // Include padding in calculations
    });

    // Remove browser defaults more comprehensively
    const resetStyles = {
      margin: '0',
      padding: '0',
      boxSizing: 'border-box'
    };

    Object.assign(document.body.style, resetStyles);
    Object.assign(document.documentElement.style, resetStyles);

    // Optional: Set html height for better consistency
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
  }

  // Funzione per navigare a una sezione specifica
  function goToSection(sectionIndex, skip_scroll = false) {
    if (sectionIndex < 0 || sectionIndex >= sections.length || isScrolling) return;
    if (sectionIndex == sections.length - 1)
      scrollArrow.classList.remove("active")
    else
      scrollArrow.classList.add("active")
    isScrolling = true;
    isManualScroll = true;
    currentSection = sectionIndex;

    // Scroll alla sezione con calcolo preciso
    const targetSection = sections[sectionIndex];
    const headerHeight = 80; // Altezza header fisso
    if (!skip_scroll)
      sectionsContainer.scrollTo({
        top: targetSection.offsetTop - headerHeight,
        behavior: 'smooth'
      });

    // Aggiorna indicatori e navigazione
    updateIndicators();
    updateNavigation();

    // Reset dei flag dopo l'animazione
    isScrolling = false;
    isManualScroll = false;
    // setTimeout(() => {
    //   isScrolling = false;
    //   setTimeout(() => {
    //     isManualScroll = false;
    //   }, 50);
    // }, 600);
  }

  // Aggiorna gli indicatori attivi
  function updateIndicators() {
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentSection);
    });
  }

  // Aggiorna la navigazione
  function updateNavigation() {
    navLinks.forEach((link, index) => {
      const sectionId = parseInt(link.getAttribute('data-section'));

      // 🔹 Only update if link corresponds to scrollytelling sections
      if (isNaN(sectionId)) return;

      if (sectionId === currentSection) {
        link.classList.remove('text-gray-600');
        link.classList.add('text-primary-900', 'border-b-2', 'border-primary-600', 'pb-1');
      } else {
        link.classList.remove('text-primary-900', 'border-b-2', 'border-primary-600', 'pb-1');
        link.classList.add('text-gray-600');
      }
    });
  }

  // Event listeners per gli indicatori
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', (e) => {
      e.preventDefault();
      goToSection(index);
    });
  });

  // FIX: Wheel scrolling migliorato con prevenzione della barra bianca
  let lastWheelTime = 0;
  let wheelTimeout;
  let isWheelBlocked = false;

  sectionsContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Blocca se c'è già un'animazione in corso o se il wheel è temporaneamente bloccato
    if (isScrolling || isManualScroll || isWheelBlocked) return;

    // Soglia per movimenti minimi
    if (Math.abs(e.deltaY) < 15) return;

    const now = Date.now();

    // Throttling più efficace
    if (now - lastWheelTime < 300) return;

    lastWheelTime = now;
    isWheelBlocked = true;

    if (e.deltaY > 0 && currentSection < sections.length - 1) {
      goToSection(currentSection + 1);
    } else if (e.deltaY < 0 && currentSection > 0) {
      goToSection(currentSection - 1);
    }

    // Rilascia il blocco dopo l'animazione
    setTimeout(() => {
      isWheelBlocked = false;
    }, 650);

  }, { passive: false });

  // Gestione delle frecce da tastiera
  document.addEventListener('keydown', (e) => {
    if (isScrolling || isManualScroll) return;

    switch (e.key) {
      case 'ArrowDown':
      case 'PageDown':
        e.preventDefault();
        if (currentSection < sections.length - 1) {
          goToSection(currentSection + 1);
        }
        break;
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        if (currentSection > 0) {
          goToSection(currentSection - 1);
        }
        break;
      case 'Home':
        e.preventDefault();
        goToSection(0);
        break;
      case 'End':
        e.preventDefault();
        goToSection(sections.length - 1);
        break;
    }
  });

  // For smartphone
  // Works a bit differently from others, other first update indicator then move
  // Here is os that moves and a timer update the indicator
  // Maybe there's a better way tho
  sectionsContainer.addEventListener('touchend', (e) => {
    // Solo se non è uno scroll programmatico
    if (isScrolling || isManualScroll) return;
    setTimeout(() => {

      const viewportCenter = sectionsContainer.scrollTop + (window.innerHeight / 2);
      let detectedSection = currentSection;
      let minDistance = Infinity;

      sections.forEach((section, index) => {
        const sectionCenter = section.offsetTop + (section.offsetHeight / 2);
        const distance = Math.abs(viewportCenter - sectionCenter);

        if (distance < minDistance) {
          minDistance = distance;
          detectedSection = index;
        }
      });

      // Only trigger goToSection when the section actually changes
      if (detectedSection !== currentSection) {
        currentSection = detectedSection;
        goToSection(detectedSection, true);
      }
    }, 200);
  });

  // FIX: Gestione del tocco per dispositivi mobili (MIGLIORATA)
  // let touchStartY = 0;
  // let touchEndY = 0;
  // let touchStartTime = 0;

  // sectionsContainer.addEventListener('touchstart', (e) => {
  //   touchStartY = e.touches[0].clientY;
  //   touchStartTime = Date.now();
  // }, { passive: true });

  // sectionsContainer.addEventListener('touchend', (e) => {
  //   if (isScrolling || isManualScroll) return;

  //   const touchEndTime = Date.now();
  //   const touchDuration = touchEndTime - touchStartTime;

  //   // Ignora tocchi troppo lunghi (probabilmente scroll normale)
  //   if (touchDuration > 300) return;

  //   touchEndY = e.changedTouches[0].clientY;
  //   const touchDiff = touchStartY - touchEndY;

  // Minimo movimento per attivare il cambio sezione
  // if (Math.abs(touchDiff) > 80) {
  //   if (touchDiff > 0 && currentSection < sections.length - 1) {
  //     // Swipe verso l'alto - vai alla sezione successiva
  //     goToSection(currentSection + 1);
  //   } else if (touchDiff < 0 && currentSection > 0) {
  //     // Swipe verso il basso - vai alla sezione precedente
  //     goToSection(currentSection - 1);
  //   }
  // }
  // }, { passive: true });

  // FIX: Gestione del resize della finestra
  window.addEventListener('resize', () => {
    ensureContainerHeight();
  });

  const scrollArrow = document.getElementById('scroll-down-arrow');
  // Click sulla freccia
  if (scrollArrow) {
    scrollArrow.addEventListener('click', function (e) {
      e.preventDefault();
      if (currentSection < sections.length - 1) {
        goToSection(currentSection + 1);
      }
    });
  }

  // FIX: Inizializzazione con correzione dell'altezza
  ensureContainerHeight();
  updateIndicators();
  updateNavigation();

  // FIX: Forza un reflow dopo l'inizializzazione
  setTimeout(() => {
    ensureContainerHeight();
  }, 100);
}

// Previeni scroll orizzontale
window.addEventListener('scroll', function () {
  if (window.scrollX !== 0) {
    window.scrollTo(0, window.scrollY);
  }
});

// Funzione principale asincrona per la mappa
async function initializeMap(config, data) {
  try {
    // Crea un elemento container con ID specifico per Leaflet preso dal config file 
    const mapId = 'map';

    // Verifica se il container esiste già
    let mapContainer = document.getElementById(mapId);

    // Assicurati che la struttura della configurazione sia completa
    if (!config.map) {
      console.warn('Configurazione della mappa mancante, utilizzo configurazione predefinita');
      config.map = {
        initialView: [45.9763, 7.6586],
        initialZoom: 8,
        tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      };
    }

    // Passa l'ID del container alla configurazione
    config.map.containerId = mapId;

    console.log(`Inizializzazione mappa con container ID: "${mapId}"`);

    // Inizializza la mappa con la configurazione UNA SOLA VOLTA
    const mapResult = initMap(config);
    const map = mapResult.map;
    const markers = mapResult.markers;
    const renderMarkers = mapResult.renderMarkers;

    // Aggiungi i dati alla mappa
    if (data && Array.isArray(data)) {
      console.log(`Aggiunti ${data.length} punti alla mappa`);

      // Usa la funzione renderMarkers per aggiungere i marker alla mappa già inizializzata
      if (renderMarkers && typeof renderMarkers === 'function') {
        renderMarkers(data);
      } else {
        console.warn('La funzione renderMarkers non è disponibile');
      }

      // Rendi i dati disponibili globalmente per altri moduli
      window.alpinismData = data;
    } else {
      console.warn('Nessun dato valido trovato o formato dati non valido');
    }

    console.log('Mappa inizializzata con successo');
  } catch (error) {
    console.error('Errore durante l\'inizializzazione della mappa:', error);

    // Mostra un messaggio di errore visibile
    const errorContainer = document.querySelector('.map-container') || document.body;
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message p-4 bg-red-100 text-red-700 border border-red-300 rounded';
    errorMessage.textContent = 'Si è verificato un errore durante il caricamento della mappa. Ricarica la pagina per riprovare.';
    errorContainer.appendChild(errorMessage);
  }
}

// Preview semplice e responsive per la homepage
function generateIndexPreview(config) {
  // Verifica configurazione
  if (!config.aggregations || typeof config.aggregations !== 'object') {
    console.warn('Nessuna configurazione aggregations trovata');
    return null;
  }

  const aggregationsArray = Object.entries(config.aggregations);
  if (aggregationsArray.length === 0) {
    console.warn('Nessuna aggregation trovata');
    return null;
  }

  // Container principale centrato 100vh
  const container = document.createElement('div');
  container.className = 'w-full min-h-screen flex items-center justify-center relative overflow-hidden';

  // Elementi decorativi semplici
  // const deco1 = document.createElement('div');
  // deco1.className = 'absolute top-10 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20';
  // container.appendChild(deco1);

  // const deco2 = document.createElement('div');
  // deco2.className = 'absolute bottom-10 right-10 w-24 h-24 bg-secondary-200 rounded-full opacity-15';
  // container.appendChild(deco2);

  // Contenuto centrato
  const content = document.createElement('div');
  content.className = 'text-center px-6 max-w-4xl mx-auto relative z-10';

  // Badge
  // const badge = document.createElement('div');
  // badge.className = 'inline-flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6';
  // badge.innerHTML = `
  //   <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  //   </svg>
  //   Navigazione per indici
  // `;

  // Titolo
  const title = document.createElement('h2');
  title.className = 'pb-6 text-4xl sm:text-5xl lg:text-6xl lg:leading-tight font-bold bg-gradient-to-r from-primary-700 to-secondary-700 bg-clip-text text-transparent';
  title.textContent = 'Scopri gli indici';

  // Descrizione
  const description = document.createElement('p');
  description.className = 'text-xl sm:text-2xl text-gray-600 mb-8 lg:mb-12';
  description.textContent = 'Esplora i contenuti dell’Atlante organizzati per categorie';

  // CTA Button
  const ctaButton = document.createElement('a');
  ctaButton.href = 'pages/indici.html';
  ctaButton.className = 'inline-flex items-center bg-primary-600 hover:bg-gradient-to-r hover:from-primary-600 hover:to-secondary-600 text-white px-8 py-4 lg:px-12 lg:py-6 rounded-xl font-semibold text-lg lg:text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group';

  ctaButton.innerHTML = `
    <span class="mr-3">Vai agli indici</span>
    <svg class="w-5 h-5 lg:w-6 lg:h-6 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5-5 5M6 12h12"></path>
    </svg>
  `;

  // Assembla tutto
  // content.appendChild(badge);
  content.appendChild(title);
  content.appendChild(description);
  content.appendChild(ctaButton);
  container.appendChild(content);

  return container;
}

// Funzione per inserire nel DOM
async function initializeIndexPreview(config) {
  try {
    const container = document.getElementById('index-cards-container');
    if (container) {
      const preview = generateIndexPreview(config);
      if (preview) {
        container.innerHTML = '';
        container.appendChild(preview);
        console.log('Preview degli indici generata con successo');
      }
    } else {
      console.warn('Container index-cards-container non trovato');
    }
  } catch (error) {
    console.error('Errore preview indici:', error);
  }
}

// Chiama tutte le funzioni
async function initializeApp() {
  try {
    // Carica la configurazione
    const config = await loadConfiguration();
    console.log('Configurazione caricata:', config);

    // Inizializza la navigazione universale (navbar e footer)
    const universalNav = new UniversalNav(config);
    universalNav.render();

    const universalFooter = new UniversalFooter(config);
    universalFooter.render();

    // Inizializza le schede degli indici
    await initializeIndexPreview(config);

    // Carica e processa i dati
    // const data = await parseData();
    // console.log('Dati caricati:', data);

    // Inizializza la mappa
    // await initializeMap(config, data);

    // FIX: Inizializza lo scrollytelling dopo che tutto è caricato
    setTimeout(() => {
      initializeScrollytelling();
    }, 200);

  } catch (error) {
    console.error('Errore durante l\'inizializzazione dell\'app:', error);
  }
}

// FIX: Avvia l'applicazione quando il DOM è pronto con controlli aggiuntivi
document.addEventListener('DOMContentLoaded', () => {
  // Assicura che il body abbia le giuste proprietà CSS
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.overflow = 'hidden'; // Previene lo scroll del body
  document.documentElement.style.margin = '0';
  document.documentElement.style.padding = '0';

  // Inizializza l'app
  initializeApp();

  // FIX: Controllo aggiuntivo dopo il caricamento completo
  window.addEventListener('load', () => {
    setTimeout(() => {
      // Forza un reflow per assicurarsi che tutto sia visualizzato correttamente
      const sectionsContainer = document.querySelector('.sections-container');
      if (sectionsContainer) {
        sectionsContainer.style.height = '100vh';
        sectionsContainer.style.overflow = 'auto';
      }
    }, 300);
  });
});