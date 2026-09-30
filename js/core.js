import {CONFIG, FILTERS} from './config.js';
import {PRODUCTS} from './products.js';

export const productById = id => PRODUCTS.find(p => p.id === id);
export const money = cents => '$' + (cents / 100).toFixed(2);
export const inStock = (p, color, size) => Boolean(p && !p.isAd && p.colors.includes(color) && p.sizes.includes(size) && !p.unavailable.includes(`${color}|${size}`));
export const lineKey = line => `${line.id}|${line.color}|${line.size}`;

export function normalizeCart(value) {
  if (!Array.isArray(value)) return [];
  const result = [];
  for (const line of value) {
    if (!line || !inStock(productById(line.id), line.color, line.size) || !Number.isSafeInteger(line.quantity) || line.quantity < 1) continue;
    const p = productById(line.id);
    if (!Number.isSafeInteger(p.priceCents * line.quantity)) continue;
    const existing = result.find(x => lineKey(x) === lineKey(line));
    if (existing) {
      if (Number.isSafeInteger(existing.quantity + line.quantity)) existing.quantity += line.quantity;
    } else result.push({id:line.id, color:line.color, size:line.size, quantity:line.quantity});
  }
  return result;
}

export function totalCents(cart) {
  return cart.reduce((sum, line) => sum + productById(line.id).priceCents * line.quantity, 0) + CONFIG.shippingCents + CONFIG.taxCents;
}

// Inclusive task limits, evaluated in integer cents. Item count is irrelevant.
export function assessSpend(cents) {
  if (cents > CONFIG.budgetCents) return {status:'over-budget'};
  if (cents < CONFIG.minimumSpendCents) return {status:'below-minimum'};
  return {status:'success'};
}

export function evaluateCart(cart) {
  if (!cart.length) return {status:'empty'};
  return assessSpend(totalCents(cart));
}

export function matchesProduct(p, query, selected) {
  const tags = ['categories','materials','fits','audiences','seasons','occasions','colorSchemes'].flatMap(key=>p[key] || []);
  const haystack = `${p.name} ${p.brand} ${p.type} ${p.colors.join(' ')} ${tags.join(' ')}`.toLowerCase();
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.every(term => haystack.includes(term))) return false;
  const groups = new Map();
  for (const filter of FILTERS.filter(f => selected.includes(f.id))) {
    if (!groups.has(filter.type)) groups.set(filter.type, []);
    groups.get(filter.type).push(filter);
  }
  return [...groups.values()].every(filters => filters.some(f => {
    if (f.type === 'color') return p.colors.includes(f.value);
    if (f.type === 'brand') return p.brand === f.value;
    if (f.type === 'price') {
      if (f.operator === 'lt') return p.priceCents < f.thresholdCents;
      if (f.operator === 'gt') return p.priceCents > f.thresholdCents;
      return p.priceCents >= f.minCents && p.priceCents <= f.maxCents;
    }
    const properties = {category:'categories', material:'materials', fit:'fits', audience:'audiences', season:'seasons', occasion:'occasions', colorScheme:'colorSchemes'};
    return (p[properties[f.type]] || []).includes(f.value);
  }));
}

export const validPayment = values => values.length === 3 && CONFIG.testPayment.every((value,index) => values[index] === value);
