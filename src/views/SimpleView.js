// views/SimpleView.js
import { ViewComponents } from './ViewComponents.js';
import { createMapUrlWithFilter } from '../utils/urlHelper.js';
import { ModalRenderer } from '.././map_components/references/modalRenderer.js';
import { loadConfiguration } from '.././utils/configLoader.js';

export class SimpleView extends ViewComponents {
  constructor(data, indexKey, indexInfo, showLocations, showWork) {
    super(data, indexKey, indexInfo);
    this.aggregatedData = this.aggregateData(data, indexKey);
    this.filteredData = { ...this.aggregatedData };
    this.sortOrder = 'alphabetical';
    this.showLocations = showLocations
    this.showWork = showWork
  }
  async loadContent() {
    this.config = await loadConfiguration();
  }

  aggregateData(data, indexKey) {
    const aggregated = {};

    data.forEach(item => {
      const value = item[indexKey];
      const values = Array.isArray(value) ? value : [value];

      values.forEach(val => {
        const key = val || 'Non specificato';
        if (!aggregated[key]) aggregated[key] = [];
        aggregated[key].push(item);
      });
    });

    return aggregated;
  }

  getInitials() {
    const initials = new Set();
    Object.keys(this.aggregatedData).forEach(key => {
      const initial = key.charAt(0).toUpperCase();
      initials.add(initial.match(/[A-Z0-9]/) ? initial : '#');
    });
    return Array.from(initials).sort();
  }

  filterByInitial(initial) {
    if (initial === 'Tutti') {
      this.filteredData = { ...this.aggregatedData };
    } else {
      this.filteredData = {};
      Object.entries(this.aggregatedData).forEach(([key, items]) => {
        const keyInitial = key.charAt(0).toUpperCase();
        const match = initial === '#' ? !keyInitial.match(/[A-Z0-9]/) : keyInitial === initial;
        if (match) this.filteredData[key] = items;
      });
    }
    this.applySearch();
    this.refreshList();
  }

  filterBySearch(searchTerm) {
    this.currentSearchTerm = searchTerm.toLowerCase().trim();

    if (!this.currentSearchTerm) {
      // Se vuoto, ripristina tutto
      this.filteredData = { ...this.aggregatedData };
    } else {
      // Altrimenti cerca
      this.applySearch();
    }

    this.refreshList();
  }

  applySearch() {
    if (!this.currentSearchTerm) {
      return; // Non fa nulla se non c'è termine di ricerca
    }

    const filtered = {};
    // filtra da this.aggregatedData
    Object.entries(this.aggregatedData).forEach(([key, items]) => {
      if (key.toLowerCase().includes(this.currentSearchTerm) ||
        items.some(item =>
          (item.Name && item.Name.toLowerCase().includes(this.currentSearchTerm)) ||
          (item.Location && item.Location.toLowerCase().includes(this.currentSearchTerm))
        )) {
        filtered[key] = items;
      }
    });
    this.filteredData = filtered;
  }

  changeSortOrder(order) {
    this.sortOrder = order;
    this.refreshList();
  }

  refreshList() {
    const container = document.querySelector('.simple-view-wrapper');
    if (container) {
      container.innerHTML = '';
      container.appendChild(this.generateList());
    }
  }

  goToMapWithFilter(value, subFilterKey = null, subFilterValue = null) {
    window.open(createMapUrlWithFilter(this.indexKey, value, subFilterKey, subFilterValue), '_blank');
  }

  // =====================================================
  // COMPONENTI SIDEBAR
  // =====================================================

  generateSearchBar() {
    const container = document.createElement('div');
    container.className = 'mb-6';

    const input = document.createElement('input');
    input.placeholder = 'Cerca...';
    input.className = 'w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500';

    let timeout;
    input.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => this.filterBySearch(e.target.value), 300);
    });

    container.appendChild(input);
    return container;
  }

  generateSortMenu() {
    const container = document.createElement('div');
    container.className = 'mb-6';

    const title = document.createElement('h3');
    title.className = 'text-sm font-medium text-slate-700 mb-2';
    title.textContent = 'Ordinamento';

    const buttons = document.createElement('div');
    buttons.className = 'flex gap-2';

    const alphabetical = this.createButton(
      'Alfabetico',
      this.sortOrder === 'alphabetical',
      () => {
        this.changeSortOrder('alphabetical');
        this.setActiveButton(alphabetical, [alphabetical, occurrences]);
      }
    );

    const occurrences = this.createButton(
      'Occorrenze',
      this.sortOrder === 'occurrences',
      () => {
        this.changeSortOrder('occurrences');
        this.setActiveButton(occurrences, [alphabetical, occurrences]);
      }
    );

    buttons.appendChild(alphabetical);
    buttons.appendChild(occurrences);

    container.appendChild(title);
    container.appendChild(buttons);
    return container;
  }

  generateInitialsFilter() {
    const container = document.createElement('div');
    container.className = 'mb-6';

    const title = document.createElement('h3');
    title.className = 'text-sm font-medium text-slate-700 mb-2';
    title.textContent = 'Filtri';

    const buttons = document.createElement('div');
    buttons.className = 'flex flex-wrap gap-1';

    const allButton = this.createButton('Tutti', true, () => {
      this.filterByInitial('Tutti');
      this.setActiveButton(allButton, buttons.children);
    });
    buttons.appendChild(allButton);

    this.getInitials().forEach(initial => {
      const button = this.createButton(initial, false, () => {
        this.filterByInitial(initial);
        this.setActiveButton(button, buttons.children);
      });
      buttons.appendChild(button);
    });

    container.appendChild(title);
    container.appendChild(buttons);
    return container;
  }

  // =====================================================
  // CONTENUTO PRINCIPALE - CON ViewComponents
  // =====================================================

  generateList() {
    const entries = Object.entries(this.filteredData);

    if (entries.length === 0) {
      return this.createEmptyState('Nessun risultato trovato');
    }

    const wrapper = document.createElement("div");
    wrapper.className = "bg-white rounded-lg shadow-sm";

    const sorted = this.sortOrder === 'alphabetical'
      ? entries.sort(([a], [b]) => a.localeCompare(b))
      : entries.sort(([a, itemsA], [b, itemsB]) => itemsB.length - itemsA.length);
    let modal = null
    if (this.showWork) {
      modal = new ModalRenderer(() => { });
      modal.setConfig(this.config || null);
      const itemsRestored = sorted.flat(2).filter(i => typeof (i) === "object");
      const groupedItems = modal.groupByIdOpera(itemsRestored);
      const allWorks = Object.values(groupedItems);
      // Keep same order (alphabetical)
      modal.setData(allWorks.sort((a, b) => a.Title.localeCompare(b.Title)), itemsRestored)
    }

    sorted.forEach(([key, items], index) => {
      // Crea solo l'header dell'accordion senza contenuto interno
      const container = document.createElement('div');
      container.className = 'border-b border-slate-200 last:border-b-0';

      const { header } = this.createAccordionHeader({
        title: key,
        count: items.length,
        indexKey: this.indexKey,
        filterValue: key,
        onMapClick: (val) => this.goToMapWithFilter(val),
        isExpanded: false,
        hasExpandableContent: this.showLocations,
        items: items,
        onToggle: () => { },
        showWorkModal: this.showWork ? modal : null,
        showWorkIndex: index
      });
      container.appendChild(header);
      if (this.showLocations) {
        // Children wrapper for expandable content
        const childrenWrapper = document.createElement("div");
        childrenWrapper.className = 'hidden'; // start collapsed

        // Locations container (indented)
        const locationsContainer = document.createElement('div');
        locationsContainer.className = 'ml-4';

        const locations = this.groupItemsByLocation(items);

        Object.entries(locations)
          .sort(([a], [b]) => a.localeCompare(b, 'it', { sensitivity: 'base' }))
          .forEach(([location, locationItems]) => {

            const { header: locationHeader } = this.createAccordionHeader({
              title: location,
              subtitle: null,
              count: locationItems.length,
              indexKey: this.indexKey,
              filterValue: location,
              onMapClick: (val) => this.goToMapWithFilter(key, "Location", val),
              isExpanded: false,
              hasExpandableContent: false, // Locations are leaf nodes
              items: locationItems,
              customClasses: 'bg-primary-50 border-l-4 border-primary-400',
              titleClasses: 'text-sm text-primary-700',
              onToggle: () => { }
            });

            locationsContainer.appendChild(locationHeader);
          });
        header.onclick = (e) => {
          if (e.target.closest('button')) return; // don't toggle if map button clicked
          childrenWrapper.classList.toggle('hidden');
          const chevron = header.querySelector('svg'); // assuming the chevron is inside header
          if (chevron) chevron.classList.toggle('rotate-180');
        };

        childrenWrapper.appendChild(locationsContainer);
        container.appendChild(childrenWrapper)
      }
      wrapper.appendChild(container);
    });

    return wrapper;
  }

  createButton(text, active, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = active
      ? 'px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700'
      : 'px-3 py-1 text-sm bg-slate-200 text-slate-700 rounded hover:bg-slate-300';
    button.onclick = onClick;
    return button;
  }

  setActiveButton(activeButton, allButtons) {
    Array.from(allButtons).forEach(btn => {
      btn.className = 'px-3 py-1 text-sm bg-slate-200 text-slate-700 rounded hover:bg-slate-300';
    });
    activeButton.className = 'px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700';
  }

  generateViewComponents() {
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'simple-view-wrapper';
    contentWrapper.appendChild(this.generateList());

    return {
      sidebar: [
        this.generateHeader('Indice'),
        this.generateSearchBar(),
        this.generateSortMenu(),
        this.generateInitialsFilter()
      ],
      content: [contentWrapper]
    };
  }
}