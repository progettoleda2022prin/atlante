// src/index.js
import { loadConfiguration } from './utils/configLoader.js';
import { UniversalNav } from './navigation/universalNav.js';
import { UniversalFooter } from './navigation/universalFooter.js';
import './styles/tailwind.css'
import './styles/fonts.css'

// Funzione per aggiornare i contenuti dinamicamente
function updateProjectDescription(config) {
    // Aggiorna i paragrafi della descrizione (codice esistente)
    const pubs = document.querySelector('[data-content="publications"]');
    if (pubs) {
        let publs = config.publications;
        const url_regex = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?");
        const updatedPubls = publs.map(element => {
            if (url_regex.test(element)) {
                return element.replace(url_regex, (url) => `<a href="${url}"style="color:red">${url}</a>`);
            }
            return element;
        });
        pubs.innerHTML = "<br><br>" + updatedPubls.join("<br><br>");
    }

    const evs = document.querySelector('[data-content="events"]');
    if (evs) {
        let events = config.events;
        if (events.length > 0)
            evs.innerHTML = "<br><br>" + events.join("<br><br>");
        else
            evs.innerHTML = "<br><br>Non ci sono eventi previsti";
    }

}
// Previeni scroll orizzontale
window.addEventListener('scroll', function () {
    if (window.scrollX !== 0) {
        window.scrollTo(0, window.scrollY);
    }
});


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

        // Aggiorna la descrizione del progetto
        updateProjectDescription(config);

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

    const expand_subdiv = document.getElementsByClassName("expand_subdiv");
    Array.from(expand_subdiv).forEach(header => {
        header.onclick = (e) => {
            // find the div you want to toggle
            const div = e.target.classList[1];
            if (!div) return;

            document.getElementById(div).style.display = document.getElementById(div).style.display == "block" ? "none" : "block"

            // find chevron inside header
            const chevron = header.querySelector('svg');
            if (chevron) {
                chevron.classList.toggle('rotate-180');
            }
        };
    });
});
