// src/index.js
import { loadConfiguration } from './utils/configLoader.js';
import { UniversalNav } from './navigation/universalNav.js';
import { UniversalFooter } from './navigation/universalFooter.js';
import './styles/tailwind.css'
import './styles/fonts.css'

function arrToUl(root, arr, universalFooter) {
    var ul = document.createElement('ul');
    root.appendChild(document.createElement('br'));
    root.appendChild(ul);

    arr.forEach(function (item) {
        var li = document.createElement('li');

        // ---- description text ----
        var desc = document.createElement('div');
        desc.style.whiteSpace = 'pre-line'; // renders \n as line breaks
        desc.appendChild(document.createTextNode(item.description));
        li.appendChild(desc);

        // ---- image under description ----
        if (item.flyer_path) {
            var img = document.createElement('img');
            img.src = universalFooter.getRelativePath(item.flyer_path);
            img.alt = 'Flyer image';
            img.style.display = 'block'; // puts image on new line
            img.style.marginTop = '8px';  // spacing under text
            img.style.height = '200px';

            var a = document.createElement('a');
            a.href = item.flyer_path;
            a.target = '_b';
            a.appendChild(img);
            li.appendChild(a);
        }

        ul.appendChild(li);
    });
}


// Funzione per aggiornare i contenuti dinamicamente
function updateProjectDescription(config, universalFooter) {
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
        if (events.length > 0) {
            arrToUl(evs, events, universalFooter)
        }
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
        updateProjectDescription(config, universalFooter);

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
            const div = e.target.classList[0];
            if (!div) return;

            document.getElementById(div).style.display = document.getElementById(div).style.display == "block" ? "none" : "block"
            const arrow_val = document.getElementById(div + "_arrow").classList;
            if (arrow_val.contains("fa-angle-down")) {
                arrow_val.remove("fa-angle-down");
                arrow_val.add("fa-angle-up");
            }
            else {
                arrow_val.remove("fa-angle-up");
                arrow_val.add("fa-angle-down");
            }

        };
    });
    const hash = window.location.hash;

    if (!hash) return;

    const target = document.querySelector(hash);
    if (!target) return;

    // Reveal hidden parents if needed
    let el = target;
    while (el) {
        if (el.style?.display === 'none') {
            el.style.display = '';
        }
        el = el.parentElement;
    }

    // Scroll after revealing
    requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
