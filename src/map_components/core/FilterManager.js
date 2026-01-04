// src/map_components/core/FilterManager.js

export class FilterManager {
  constructor(stateManager, config) {
    this.stateManager = stateManager;
    this.config = config;
  }

  applyUrlFilters(callbacks) {
    return new Promise((resolve) => {
      const urlParams = new URLSearchParams(window.location.search);
      const filterKey = urlParams.get('filter');
      const filterValue = urlParams.get('value');
      const subFilterKey = urlParams.get('subfilter');
      const subFilterValue = urlParams.get('subvalue');

      console.log('Checking URL parameters:', { filterKey, filterValue, subFilterKey, subFilterValue });

      if (filterKey && filterValue) {
        console.log(`Applying URL filter: ${filterKey} = ${filterValue}, ${subFilterKey} = ${subFilterValue}`);
        const filters = [
          [filterKey, filterValue],
          ...(subFilterKey != null ? [[subFilterKey, subFilterValue]] : [])
        ];
        const state = this.stateManager.getState();
        for (const [key, value] of filters) {
          if (this.config.aggregations && this.config.aggregations[key]) {
            const facetConfig = this.config.aggregations[key];
            let processedValue = value;

            // Se è un range, converti la stringa in array [min, max]
            if (facetConfig.type === 'range') {
              const parts = value.includes('-')
                ? value.split('-').map(v => parseInt(v.trim(), 10))
                : value.split(',').map(v => parseInt(v.trim(), 10));

              if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                processedValue = parts;
              } else {
                console.error(`Invalid range format: ${value}`);
                resolve();
                return;
              }
            }

            // Applica il filtro direttamente allo stato
            if (facetConfig.type === 'range') {
              state.filters[key] = processedValue;
            } else {
              if (!state.filters[key]) {
                state.filters[key] = [];
              }
              if (!state.filters[key].includes(processedValue)) {
                state.filters[key].push(processedValue);
              }
            }
          }
          else {
            console.warn(`Filter key '${key}' not found in configuration`);
            if (callbacks.onError) {
              callbacks.onError(`Filtro '${key}' non trovato`, 'warning');
            }
            resolve();
            return
          }
        }
        this.stateManager.setState(state);
        console.log('State filters after URL application:', state.filters);

        // Esegui la ricerca
        setTimeout(async () => {
          if (callbacks.onApplyFilters) {
            await callbacks.onApplyFilters();
          }

          if (callbacks.onShowNotification) {
            callbacks.onShowNotification(filterKey, filterValue, subFilterKey, subFilterValue);
          }
          resolve(); // Risolvi la Promise dopo che tutto è completato
        }, 1500);
      }
      else {
        // Nessun filtro URL da applicare
        resolve();
      }
    });
  }

  clearAllFilters() {
    const state = this.stateManager.getState();
    state.query = '';
    state.filters = this.stateManager.createEmptyFilters();
    this.stateManager.setState(state);

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
  }

  removeFilter(facetKey, value) {
    const state = this.stateManager.getState();

    if (!state.filters[facetKey]) return;

    if (value) {
      state.filters[facetKey] = state.filters[facetKey].filter(v => v !== value);
    } else {
      state.filters[facetKey] = [];
    }

    this.stateManager.setState(state);
  }

  clearSearchQuery() {
    const state = this.stateManager.getState();
    state.query = '';
    this.stateManager.setState(state);

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
  }
}
