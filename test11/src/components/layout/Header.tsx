import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, 
  Search, 
  BarChart3, 
  Store, 
  Layers, 
  Settings, 
  Sparkles,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    shoppingList, 
    filterState, 
    updateFilters 
  } = useApp();

  const [localSearch, setLocalSearch] = useState(filterState.searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ searchQuery: localSearch });
    if (currentView !== 'catalog') {
      setCurrentView('catalog');
    }
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    updateFilters({ searchQuery: '' });
  };

  const totalItemsCount = shoppingList.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* Logo */}
          <div 
            onClick={() => { setCurrentView('home'); }}
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0 group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                  Çmimi<span className="text-emerald-600">.ks</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Kosovë
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Krahasimi i çmimeve në supermarkete
              </p>
            </div>
          </div>

          {/* Search bar in header (desktop & tablet) */}
          <form 
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-md hidden md:block"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Kërko produkte (p.sh. Qumësht Vita, Floil, Miell, Kafe)..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {localSearch && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Navigation links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentView === 'home'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Ballina
            </button>
            <button
              onClick={() => setCurrentView('catalog')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentView === 'catalog'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              Katalogu
            </button>
            <button
              onClick={() => setCurrentView('compare')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentView === 'compare'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Krahasimi
            </button>
            <button
              onClick={() => setCurrentView('supermarkets')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentView === 'supermarkets'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Store className="w-4 h-4" />
              Supermarketet
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Shopping List Button */}
            <button
              onClick={() => setCurrentView('shopping-list')}
              className={`relative flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                currentView === 'shopping-list'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
              title="Shiko listën e blerjeve"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Shporta</span>
              {totalItemsCount > 0 && (
                <span className={`px-1.5 py-0.5 text-xs font-bold rounded-full ${
                  currentView === 'shopping-list' ? 'bg-white text-emerald-700' : 'bg-emerald-600 text-white'
                }`}>
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Admin button */}
            <button
              onClick={() => setCurrentView('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
                currentView === 'admin'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Paneli Administrativ (Menaxho produktet dhe çmimet)"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
