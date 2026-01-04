// utils/urlHelper.js

const base = import.meta.env.BASE_URL

export function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

export function createMapUrlWithFilter(indexKey, categoryValue, subFilterKey = null, subFilterValue = null) {
  const baseUrl = window.location.origin + base + 'pages/mappa.html';
  const params = new URLSearchParams();
  params.set('filter', indexKey);
  params.set('value', categoryValue);
  if (subFilterKey != null) {
    params.set('subfilter', subFilterKey);
    params.set('subvalue', subFilterValue);
  }
  return `${baseUrl}?${params.toString()}`;
}