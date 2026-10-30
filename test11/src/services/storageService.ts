import type { Product, Supermarket, PriceRecord, ShoppingListItem } from '../types';

import { INITIAL_PRODUCTS, INITIAL_SUPERMARKETS, INITIAL_PRICES } from '../data/mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'km_products_v2',
  SUPERMARKETS: 'km_supermarkets_v2',
  PRICES: 'km_prices_v2',
  SHOPPING_LIST: 'km_shopping_list_v2',
};

export const storageService = {
  getProducts: (): Product[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts: (products: Product[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  },

  getSupermarkets: (): Supermarket[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUPERMARKETS);
      return data ? JSON.parse(data) : INITIAL_SUPERMARKETS;
    } catch {
      return INITIAL_SUPERMARKETS;
    }
  },

  saveSupermarkets: (supermarkets: Supermarket[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUPERMARKETS, JSON.stringify(supermarkets));
    } catch (e) {
      console.error('Failed to save supermarkets', e);
    }
  },

  getPrices: (): PriceRecord[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRICES);
      return data ? JSON.parse(data) : INITIAL_PRICES;
    } catch {
      return INITIAL_PRICES;
    }
  },

  savePrices: (prices: PriceRecord[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRICES, JSON.stringify(prices));
    } catch (e) {
      console.error('Failed to save prices', e);
    }
  },

  getShoppingList: (): ShoppingListItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST);
      return data ? JSON.parse(data) : [
        { productId: 'prod-1', quantity: 2, addedAt: new Date().toISOString() },
        { productId: 'prod-2', quantity: 1, addedAt: new Date().toISOString() },
        { productId: 'prod-4', quantity: 1, addedAt: new Date().toISOString() },
      ];
    } catch {
      return [];
    }
  },

  saveShoppingList: (items: ShoppingListItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save shopping list', e);
    }
  },

  resetAllToDefault: () => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem(STORAGE_KEYS.SUPERMARKETS, JSON.stringify(INITIAL_SUPERMARKETS));
      localStorage.setItem(STORAGE_KEYS.PRICES, JSON.stringify(INITIAL_PRICES));
      localStorage.removeItem(STORAGE_KEYS.SHOPPING_LIST);
    } catch (e) {
      console.error('Failed to reset data', e);
    }
  }
};
