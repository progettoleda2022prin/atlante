// documenti.js

import { loadConfiguration } from './utils/configLoader.js';
import { UniversalNav } from './navigation/universalNav.js';
import { UniversalFooter } from './navigation/universalFooter.js';
import './styles/tailwind.css';
import './styles/fonts.css';

const base = import.meta.env.BASE_URL;
const BASE_URL = base || '/';

// Initialize page
async function initializePage() {
    try {
        const config = await loadConfiguration();

        const universalNav = new UniversalNav(config);
        universalNav.render();

        const universalFooter = new UniversalFooter(config);
        universalFooter.render();

        console.log('Navigation e Footer inizializzati');

    } catch (error) {
        console.error('Errore durante l\'inizializzazione:', error);
    }
}

// Start initialization when DOM is ready
document.addEventListener('DOMContentLoaded', initializePage);