import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../../data/mockData';
import { 
  Filter, 
  Search, 
  X, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Tag, 
  RotateCcw,
  LayoutGrid,
  List,
  Check
} from 'lucide-react';

export const CatalogView: React.FC = () => {
  const { 
    productsWithPrices, 
    supermarkets, 
    filterState, 
    updateFilters, 
    resetFilters,
    setSelectedProductId,
    addToShoppingList,
    isInShoppingList
  } = useApp();

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return productsWithPrices
      .filter((prod) => {
        // Search query filter (matches name, brand, or category)
        if (filterState.searchQuery) {
          const q = filterState.searchQuery.toLowerCase().trim();
          const matchesName = prod.name.toLowerCase().includes(q);
          const matchesBrand = prod.brand.toLowerCase().includes(q);
          const matchesCategory = prod.category.toLowerCase().includes(q);
          const matchesBarcode = prod.barcode.includes(q);
          if (!matchesName && !matchesBrand && !matchesCategory && !matchesBarcode) {
            return false;
          }
        }

        // Category filter
        if (filterState.category && prod.category !== filterState.category) {
          return false;
        }

        // Supermarket filter: product must have a price record in that supermarket
        if (filterState.supermarketId) {
          const hasInSupermarket = prod.prices.some(
            (pr) => pr.supermarketId === filterState.supermarketId
          );
          if (!hasInSupermarket) return false;
        }

        // Only discounts filter
        if (filterState.onlyDiscounts) {
          const hasDiscount = prod.prices.some((pr) => pr.isOnDiscount);
          if (!hasDiscount) return false;
        }

        // Max price filter
        if (prod.minPrice > filterState.maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filterState.sortBy) {
          case 'cheapest':
            return a.minPrice - b.minPrice;
          case 'expensive':
            return b.minPrice - a.minPrice;
          case 'name-asc':
            return a.name.localeCompare(b.name, 'sq');
          case 'savings':
            return b.savingsAmount - a.savingsAmount;
          default:
            return 0;
        }
      });
  }, [productsWithPrices, filterState]);

  const activeFiltersCount = [
    Boolean(filterState.searchQuery),
    Boolean(filterState.category),
    Boolean(filterState.supermarketId),
    Boolean(filterState.onlyDiscounts),
    filterState.maxPrice < 20,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Katalogu i Produkteve
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {filteredProducts.length} artikuj
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kërkoni, filtroni dhe krahasoni çmimet e ushqimeve sipas marketeve në Kosovë
          </p>
        </div>

        {/* View Switcher & Mobile Filter Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs cursor-pointer shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span>Filtrat</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Grid / List toggle */}
          <div className="hidden sm:flex items-center border border-slate-200 rounded-xl bg-white p-1 shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Pamje në rrjetë"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Pamje në listë"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={filterState.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
              className="appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
            >
              <option value="cheapest">Rendit: Çmimi më i ulët</option>
              <option value="expensive">Rendit: Çmimi më i lartë</option>
              <option value="savings">Rendit: Kursimi më i madh</option>
              <option value="name-asc">Rendit: Emri (A - Z)</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <aside
          className={`lg:block ${
            showMobileFilters ? 'block' : 'hidden'
          } bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-6 lg:sticky lg:top-24`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Filter className="w-4 h-4 text-emerald-600" />
              <span>Filtrat e Kërkimit</span>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Pastro ({activeFiltersCount})
              </button>
            )}
          </div>

          {/* Search filter input in sidebar */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Kërkim me Emër / Markë
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="p.sh. Vita, Floil, Djathë..."
                value={filterState.searchQuery}
                onChange={(e) => updateFilters({ searchQuery: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {filterState.searchQuery && (
                <button
                  onClick={() => updateFilters({ searchQuery: '' })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Kategoria
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => updateFilters({ category: '' })}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                  !filterState.category
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Të gjitha kategoritë</span>
                <span className="text-[11px] text-slate-400">{productsWithPrices.length}</span>
              </button>
              {CATEGORIES.map((cat) => {
                const count = productsWithPrices.filter((p) => p.category === cat).length;
                const isSelected = filterState.category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => updateFilters({ category: cat })}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    <span className="text-[11px] text-slate-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Supermarket Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Supermarketi
            </label>
            <select
              value={filterState.supermarketId}
              onChange={(e) => updateFilters({ supermarketId: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="">Të gjitha supermarketet</option>
              {supermarkets.map((sm) => (
                <option key={sm.id} value={sm.id}>
                  {sm.name}
                </option>
              ))}
            </select>
          </div>

          {/* Discounts Checkbox */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filterState.onlyDiscounts}
                onChange={(e) => updateFilters({ onlyDiscounts: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-rose-500" />
                Vetëm artikujt me zbritje
              </span>
            </label>
          </div>

          {/* Price Range Slider */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Çmimi maksimal:</span>
              <span className="font-extrabold text-emerald-700 text-sm">
                €{filterState.maxPrice.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="20"
              step="0.5"
              value={filterState.maxPrice}
              onChange={(e) => updateFilters({ maxPrice: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>€0.50</span>
              <span>€10.00</span>
              <span>€20.00+</span>
            </div>
          </div>
        </aside>

        {/* Product Grid / List Display */}
        <main className="lg:col-span-3">
          {/* Active Filter Tags */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              <span className="text-xs text-slate-400 mr-1">Filtrat aktivë:</span>
              {filterState.searchQuery && (
                <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">
                  Kërkimi: "{filterState.searchQuery}"
                  <button onClick={() => updateFilters({ searchQuery: '' })} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filterState.category && (
                <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
                  Kategoria: {filterState.category}
                  <button onClick={() => updateFilters({ category: '' })} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filterState.supermarketId && (
                <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-lg">
                  {supermarkets.find((s) => s.id === filterState.supermarketId)?.name}
                  <button onClick={() => updateFilters({ supermarketId: '' })} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filterState.onlyDiscounts && (
                <span className="inline-flex items-center gap-1 text-xs bg-rose-100 text-rose-800 px-2.5 py-1 rounded-lg">
                  Vetëm zbritje
                  <button onClick={() => updateFilters({ onlyDiscounts: false })} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filterState.maxPrice < 20 && (
                <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg">
                  Nën €{filterState.maxPrice.toFixed(2)}
                  <button onClick={() => updateFilters({ maxPrice: 20 })} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Product Items */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-900">Nuk u gjet asnjë produkt</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Nuk ka artikuj që përputhen me kriteret e përzgjedhura të filtrimit. Provoni të pastroni filtrat ose të kërkoni me fjalë të tjera.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Rivendos të gjithë filtrat
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-3">
              {filteredProducts.map((product) => {
                const isAdded = isInShoppingList(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProductId(product.id)}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-xl p-1.5 shrink-0 flex items-center justify-center border border-slate-100">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-emerald-700 uppercase">
                            {product.brand}
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                            {product.packageSize}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                          {product.name}
                        </h4>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Kategoria: {product.category} • E disponueshme në {product.prices.length} markete
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-slate-400 block">Fillon nga:</span>
                        <div className="text-xl font-black text-emerald-600">
                          €{product.minPrice.toFixed(2)}
                        </div>
                        {product.cheapestSupermarket && (
                          <span className="text-xs font-semibold text-slate-600">
                            në {product.cheapestSupermarket.name}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToShoppingList(product.id, 1, product.cheapestSupermarket?.id);
                        }}
                        className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {isAdded ? <Check className="w-4 h-4" /> : null}
                        <span>{isAdded ? 'Në Shportë' : 'Shto'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
