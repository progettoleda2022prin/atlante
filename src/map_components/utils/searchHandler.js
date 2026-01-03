// searchHandler.js
export class SearchHandler {
  constructor(searchEngine, config) {
    this.searchEngine = searchEngine;
    this.config = config;
    this.multiFacetSearchNeededTags = [
      "Location", "Tipologia del luogo",
      "Tipologia dello Spazio", "Temporalità dello Spazio",
      "Definizione dello spazio"
    ]
  }

  performSearch(state, callbacks = {}) {
    if (!this.searchEngine) {
      console.error('Search engine not initialized');
      return;
    }

    const { filters } = state;

    // Separate filters by type to handle them differently
    let { regularFilters, dateFilters, taxonomyFilters } = this._separateFilters(filters);

    let results = this.searchEngine.search({
      query: state.query || '',
      filters: regularFilters,
      sort: state.sort || 'title_asc',
      per_page: 1000,
      filter: (item) => this._customFilter(item, dateFilters, taxonomyFilters)
    });
    /* If filtering on a location attribute (i.e. location, Tipologia del luogo, Tipologia dello Spazio)
     * the filter will remove data from the work (e.g., if filter "Bologna" it will show all work with this city as Location but will
     * not show all other locations involved in that opera), so will need to run a double search
     */
    const hasAnyMultiFacetFilters = this.multiFacetSearchNeededTags.some(
      tag => filters[tag] && filters[tag].length > 0
    );
    const initial_results = results;
    if (hasAnyMultiFacetFilters) {
      const filteredIds = results.data.items.map(hit => hit.pivot_ID);
      regularFilters = {};
      regularFilters["pivot_ID"] = filteredIds
      // Get full facets for those items only
      results = this.searchEngine.search({
        query: state.query || '',
        filters: regularFilters,
        sort: state.sort || 'title_asc',
        per_page: 1000
      });
    }


    // Extract coordinates for map
    const coordinates = this._extractCoordinates(results.data.items);

    // Execute callbacks
    if (callbacks.onMarkersUpdate) {
      if (hasAnyMultiFacetFilters)
        // To show only filtered location/others and not all 
        // if click on other location on right will give a warning "marker not found"
        callbacks.onMarkersUpdate(initial_results.data.items);
      else
        callbacks.onMarkersUpdate(results.data.items)
    }

    if (callbacks.onResultsUpdate) {
      callbacks.onResultsUpdate(results.data.items);
    }

    if (callbacks.onAggregationsUpdate) {
      const aggregations = this._formatAggregations(results.data.aggregations);
      callbacks.onAggregationsUpdate(aggregations);
    }

    return {
      items: results.data.items,
      coordinates,
      aggregations: this._formatAggregations(results.data.aggregations)
    };
  }

  _separateFilters(filters) {
    const regularFilters = {};
    const dateFilters = {};
    const taxonomyFilters = {};

    Object.entries(filters).forEach(([key, values]) => {
      if (!values || values.length === 0) return;

      const config = this.config.aggregations[key];
      if (!config) return;

      switch (config.type) {
        case 'range':
          dateFilters[key] = values;
          break;
        case 'taxonomy':
          taxonomyFilters[key] = values;
          break;
        default:
          regularFilters[key] = values;
      }
    });

    return { regularFilters, dateFilters, taxonomyFilters };
  }

  _normalizeToStringArray(value) {
    if (Array.isArray(value)) {
      return value.map(v => String(v)).filter(Boolean);
    }
    if (typeof value === 'string') {
      return [value];
    }
    if (value == null) {
      return [];
    }
    return [String(value)];
  }

  _customFilter(item, dateFilters, taxonomyFilters) {
    // Check date filters
    for (const [field, range] of Object.entries(dateFilters)) {
      if (range.length === 2) {
        const [startDate, endDate] = range;
        const itemDate = new Date(item[field]).getTime();
        if (!(itemDate >= startDate && itemDate <= endDate)) {
          return false;
        }
      }
    }

    // Check taxonomy filters
    for (const [field, paths] of Object.entries(taxonomyFilters)) {
      if (!item[field]) return false;

      // Check if any of the selected paths match the item's taxonomy
      const itemValues = item[field];
      const itemValueStrings = this._normalizeToStringArray(itemValues);
      const matches = paths.some(path =>
        itemValueStrings.some(itemStr =>
          itemStr === path || itemStr.startsWith(path + ' > ')
        )
      );
      if (!matches) return false;
    }

    return true;
  }

  _extractCoordinates(items) {
    return items
      .filter(item => item.lat_long && item.lat_long.length > 0)
      .map(item => {
        // Get the string from the array's first element
        const coordString = item.lat_long[0];
        const [latitude, longitude] = coordString.split(",");
        return [parseFloat(latitude), parseFloat(longitude)];
      });
  }

  _formatAggregations(aggregations) {
    const formatted = {};
    for (const key in aggregations) {
      if (aggregations.hasOwnProperty(key)) {
        formatted[key] = aggregations[key].buckets;
      }
    }
    return formatted;
  }
}