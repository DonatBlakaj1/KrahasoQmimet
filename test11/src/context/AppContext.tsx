import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type { 
  Product, 
  Supermarket, 
  PriceRecord, 
  ShoppingListItem, 
  ProductWithPrices, 
  ViewMode, 
  FilterState, 
  ToastMessage,
  SupermarketSource,
  PriceHistoryRecord,
  SyncAuditLog
} from '../types';
import { storageService } from '../services/storageService';
import { syncEngine } from '../services/syncEngine';

interface AppContextType {
  // Data
  products: Product[];
  supermarkets: Supermarket[];
  priceRecords: PriceRecord[];
  shoppingList: ShoppingListItem[];
  productsWithPrices: ProductWithPrices[];
  
  // Navigation & selection
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedSupermarketId: string | null;
  setSelectedSupermarketId: (id: string | null) => void;

  // Search & Filter
  filterState: FilterState;
  updateFilters: (updates: Partial<FilterState>) => void;
  resetFilters: () => void;

  // Shopping List
  addToShoppingList: (productId: string, quantity?: number, preferredSupermarketId?: string) => void;
  removeFromShoppingList: (productId: string) => void;
  updateShoppingListQuantity: (productId: string, quantity: number) => void;
  clearShoppingList: () => void;
  isInShoppingList: (productId: string) => boolean;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;

  // Admin CRUD
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addSupermarket: (sm: Omit<Supermarket, 'id'>) => void;
  updateSupermarket: (sm: Supermarket) => void;
  deleteSupermarket: (smId: string) => void;
  savePriceRecord: (record: Omit<PriceRecord, 'id'> & { id?: string }) => void;
  deletePriceRecord: (recordId: string) => void;
  resetToDemoData: () => void;

  // Synchronization & Sources
  sources: SupermarketSource[];
  priceHistory: PriceHistoryRecord[];
  auditLogs: SyncAuditLog[];
  isSyncing: boolean;
  triggerSync: (sourceId: string) => Promise<void>;
  syncAllSources: () => Promise<void>;
}

const initialFilterState: FilterState = {
  searchQuery: '',
  category: '',
  supermarketId: '',
  onlyDiscounts: false,
  maxPrice: 20,
  sortBy: 'cheapest',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>(() => storageService.getSupermarkets());
  const [priceRecords, setPriceRecords] = useState<PriceRecord[]>(() => storageService.getPrices());
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>(() => storageService.getShoppingList());

  // Sources & Sync state
  const [sources, setSources] = useState<SupermarketSource[]>(() => syncEngine.getSources());
  const [priceHistory, setPriceHistory] = useState<PriceHistoryRecord[]>(() => syncEngine.getHistory());
  const [auditLogs, setAuditLogs] = useState<SyncAuditLog[]>(() => syncEngine.getAuditLogs());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedSupermarketId, setSelectedSupermarketId] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Persist state changes
  useEffect(() => {
    storageService.saveProducts(products);
  }, [products]);

  useEffect(() => {
    storageService.saveSupermarkets(supermarkets);
  }, [supermarkets]);

  useEffect(() => {
    storageService.savePrices(priceRecords);
  }, [priceRecords]);

  useEffect(() => {
    storageService.saveShoppingList(shoppingList);
  }, [shoppingList]);

  // Combine products with price records and supermarkets
  const productsWithPrices = useMemo<ProductWithPrices[]>(() => {
    const smMap = new Map(supermarkets.map((sm) => [sm.id, sm]));

    return products.map((prod) => {
      const records = priceRecords
        .filter((pr) => pr.productId === prod.id && pr.isAvailable && smMap.has(pr.supermarketId))
        .map((pr) => {
          const sm = smMap.get(pr.supermarketId)!;
          return {
            ...pr,
            sourceName: pr.sourceName || sm.name,
            sourceUrl: pr.sourceUrl || sm.website,
            sourceType: pr.sourceType || (sm.id === 'maxi' ? 'online_shop' : (sm.id === 'interex' || sm.id === 'meridian' ? 'promotional_pdf' : 'manual_verification')),
            verifiedAt: pr.verifiedAt || pr.lastUpdated,
            supermarket: sm,
          };
        })
        .sort((a, b) => a.price - b.price);

      const minPrice = records.length > 0 ? records[0].price : 0;
      const maxPrice = records.length > 0 ? records[records.length - 1].price : 0;
      const cheapestSupermarket = records.length > 0 ? records[0].supermarket : null;
      const savingsAmount = maxPrice > minPrice ? Number((maxPrice - minPrice).toFixed(2)) : 0;
      const savingsPercentage = maxPrice > 0 ? Math.round(((maxPrice - minPrice) / maxPrice) * 100) : 0;

      return {
        ...prod,
        prices: records,
        minPrice,
        maxPrice,
        cheapestSupermarket,
        savingsAmount,
        savingsPercentage,
      };
    });
  }, [products, supermarkets, priceRecords]);

  // Filter actions
  const updateFilters = (updates: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
  };

  const resetFilters = () => {
    setFilterState(initialFilterState);
  };

  // Shopping list actions
  const addToShoppingList = (productId: string, quantity = 1, preferredSupermarketId?: string) => {
    const prod = products.find((p) => p.id === productId);
    setShoppingList((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity, preferredSupermarketId: preferredSupermarketId || item.preferredSupermarketId }
            : item
        );
      }
      return [...prev, { productId, quantity, preferredSupermarketId, addedAt: new Date().toISOString() }];
    });
    showToast(
      prod ? `"${prod.name}" u shtua në listën e blerjeve.` : 'Produkti u shtua në listën e blerjeve.',
      'success'
    );
  };

  const removeFromShoppingList = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setShoppingList((prev) => prev.filter((item) => item.productId !== productId));
    showToast(prod ? `"${prod.name}" u largua nga lista.` : 'Produkti u largua nga lista.', 'info');
  };

  const updateShoppingListQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromShoppingList(productId);
      return;
    }
    setShoppingList((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const clearShoppingList = () => {
    setShoppingList([]);
    showToast('Lista e blerjeve u zbraz.', 'info');
  };

  const isInShoppingList = (productId: string) => {
    return shoppingList.some((item) => item.productId === productId);
  };

  // Admin CRUD operations
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = { ...prodData, id: newId };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Produkti "${newProduct.name}" u krijua me sukses!`, 'success');
  };

  const updateProduct = (prod: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === prod.id ? prod : p)));
    showToast(`Produkti "${prod.name}" u përditësua me sukses!`, 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setPriceRecords((prev) => prev.filter((pr) => pr.productId !== productId));
    setShoppingList((prev) => prev.filter((item) => item.productId !== productId));
    showToast('Produkti dhe çmimet përkatëse u fshinë.', 'warning');
  };

  const addSupermarket = (smData: Omit<Supermarket, 'id'>) => {
    const newId = `sm-${Date.now()}`;
    const newSm: Supermarket = { ...smData, id: newId };
    setSupermarkets((prev) => [...prev, newSm]);
    showToast(`Supermarketi "${newSm.name}" u shtua!`, 'success');
  };

  const updateSupermarket = (sm: Supermarket) => {
    setSupermarkets((prev) => prev.map((item) => (item.id === sm.id ? sm : item)));
    showToast(`Supermarketi "${sm.name}" u përditësua!`, 'success');
  };

  const deleteSupermarket = (smId: string) => {
    setSupermarkets((prev) => prev.filter((item) => item.id !== smId));
    setPriceRecords((prev) => prev.filter((pr) => pr.supermarketId !== smId));
    showToast('Supermarketi u fshi nga sistemi.', 'warning');
  };

  const savePriceRecord = (record: Omit<PriceRecord, 'id'> & { id?: string }) => {
    if (record.id) {
      setPriceRecords((prev) =>
        prev.map((pr) =>
          pr.id === record.id
            ? { ...record, id: record.id, lastUpdated: new Date().toISOString() }
            : pr
        )
      );
      showToast('Çmimi u përditësua me sukses!', 'success');
    } else {
      const newId = `pr-${Date.now()}`;
      const newRec: PriceRecord = {
        ...record,
        id: newId,
        lastUpdated: new Date().toISOString(),
      };
      setPriceRecords((prev) => [...prev, newRec]);
      showToast('Regjistrimi i ri i çmimit u ruajt me sukses!', 'success');
    }
  };

  const deletePriceRecord = (recordId: string) => {
    setPriceRecords((prev) => prev.filter((pr) => pr.id !== recordId));
    showToast('Regjistrimi i çmimit u hoq.', 'info');
  };

  const resetToDemoData = () => {
    storageService.resetAllToDefault();
    setProducts(storageService.getProducts());
    setSupermarkets(storageService.getSupermarkets());
    setPriceRecords(storageService.getPrices());
    setShoppingList(storageService.getShoppingList());
    setSources(syncEngine.getSources());
    setPriceHistory(syncEngine.getHistory());
    setAuditLogs(syncEngine.getAuditLogs());
    showToast('Të gjitha të dhënat u rivendosën në vlerat fillestare.', 'info');
  };

  // Synchronization actions
  const triggerSync = async (sourceId: string) => {
    setIsSyncing(true);
    try {
      const { updatedProducts, updatedPrices, result } = await syncEngine.syncSource(
        sourceId,
        products,
        priceRecords
      );
      setProducts(updatedProducts);
      setPriceRecords(updatedPrices);
      setSources([...syncEngine.getSources()]);
      setPriceHistory([...syncEngine.getHistory()]);
      setAuditLogs([...syncEngine.getAuditLogs()]);

      if (result.status === 'success') {
        showToast(`Sinkronizimi me ${result.sourceName} përfundoi: ${result.message}`, 'success');
      } else if (result.status === 'warning' || result.status === 'pending_auth') {
        showToast(result.message, 'warning');
      } else {
        showToast(`Sinkronizimi hasi vështirësi: ${result.message}`, 'error');
      }
    } catch (err: any) {
      showToast(`Gabim gjatë sinkronizimit: ${err.message}`, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const syncAllSources = async () => {
    setIsSyncing(true);
    showToast('Nisi sinkronizimi me të gjitha burimet e të dhënave...', 'info');
    try {
      let currentProducts = products;
      let currentPrices = priceRecords;
      for (const src of sources) {
        try {
          const { updatedProducts, updatedPrices } = await syncEngine.syncSource(
            src.id,
            currentProducts,
            currentPrices
          );
          currentProducts = updatedProducts;
          currentPrices = updatedPrices;
        } catch {}
      }
      setProducts(currentProducts);
      setPriceRecords(currentPrices);
      setSources([...syncEngine.getSources()]);
      setPriceHistory([...syncEngine.getHistory()]);
      setAuditLogs([...syncEngine.getAuditLogs()]);
      showToast('Sinkronizimi global përfundoi me sukses me të gjitha burimet.', 'success');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        supermarkets,
        priceRecords,
        shoppingList,
        productsWithPrices,
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        selectedSupermarketId,
        setSelectedSupermarketId,
        filterState,
        updateFilters,
        resetFilters,
        addToShoppingList,
        removeFromShoppingList,
        updateShoppingListQuantity,
        clearShoppingList,
        isInShoppingList,
        toasts,
        showToast,
        dismissToast,
        addProduct,
        updateProduct,
        deleteProduct,
        addSupermarket,
        updateSupermarket,
        deleteSupermarket,
        savePriceRecord,
        deletePriceRecord,
        resetToDemoData,
        sources,
        priceHistory,
        auditLogs,
        isSyncing,
        triggerSync,
        syncAllSources,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// oxlint-disable-next-line react/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
