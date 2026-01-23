// src/map_components/core/StateManager.js

export class StateManager {
  constructor(config) {
    this.config = config;
    this.state = {
      query: '',
      filters: {},
      sort: '',
      bounds: null,
    };

    this.state.sort = this.config.searchConfig.defaultSort;
    this.state.filters = this.createEmptyFilters();
  }

  createEmptyFilters() {
    const filters = {};
    for (const [field] of Object.entries(this.config.aggregations)) {
      filters[field] = [];
    }
    return filters;
  }

  hasActiveFilters() {
    if (!this.state.filters) return false;

    for (const [key, values] of Object.entries(this.state.filters)) {
      if (Array.isArray(values) && values.length > 0) {
        return true;
      }
      if (!Array.isArray(values) && values) {
        return true;
      }
    }
    return false;
  }

  updateFilters(facetType, faceValue, checked, subFilterKey = null, subFilterValue = null) {
    console.log(`Updating filter: ${facetType}, value: ${faceValue}, checked: ${checked}`);

    if (checked) {
      const filters = [
        [facetType, faceValue],
        ...(subFilterKey != null ? [[subFilterKey, subFilterValue]] : [])
      ];
      for (const [key, value] of filters) {
        if (!this.state.filters[key]) {
          this.state.filters[key] = [];
        }

        // Controlla se il valore esiste già prima di aggiungerlo [fix per taxonomy]
        if (!this.state.filters[key].includes(value)) {
          this.state.filters[key].push(value);
        }
      }
    } else {
      this.state.filters[facetType] =
        this.state.filters[facetType]?.filter(v => v !== faceValue) || [];
      if (subFilterKey != null)
        this.state.filters[subFilterKey] =
          this.state.filters[subFilterKey]?.filter(v => v !== subFilterValue) || [];
    }
  }

  async handleStateChange(action, callbacks) {
    console.log('handleStateChange called with action:', action);

    try {
      switch (action.type) {
        case 'FACET_CHANGE':
          this.updateFilters(action.facetType, action.value, action.checked, action.subFilterKey, action.subFilterValue);
          break;
        case 'RANGE_CHANGE':
          this.state.filters[action.facetKey] = action.value;
          break;
        case 'QUERY_CHANGE':
          this.state.query = action.query;
          break;
        case 'SORT_CHANGE':
          this.state.sort = action.sort;
          break;
      }

      console.log('State updated, triggering search. New state:', this.state);

      // Chiama il callback per eseguire la ricerca
      if (callbacks && callbacks.onStateChange) {
        await callbacks.onStateChange(this.state);
      }

    } catch (error) {
      console.error('Error in handleStateChange:', error);
    }
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
  }
}
