import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../catalog/ProductCard';
import { CATEGORIES } from '../../data/mockData';
import { 
  Search, 
  Sparkles, 
  TrendingDown, 
  Store, 
  ArrowRight, 
  ListPlus,
  Flame
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    productsWithPrices, 
    supermarkets, 
    setCurrentView, 
    updateFilters,
    setSelectedSupermarketId,
    setSelectedProductId
  } = useApp();

  const [searchInput, setSearchInput] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      updateFilters({ searchQuery: searchInput });
      setCurrentView('catalog');
    }
  };

  const handleCategoryClick = (category: string) => {
    updateFilters({ category, searchQuery: '' });
    setCurrentView('catalog');
  };

  const handleQuickTag = (query: string) => {
    updateFilters({ searchQuery: query });
    setCurrentView('catalog');
  };

  const handleSupermarketClick = (smId: string) => {
    setSelectedSupermarketId(smId);
    updateFilters({ supermarketId: smId });
    setCurrentView('supermarkets');
  };

  // Filter popular products and discounted products
  const popularProducts = productsWithPrices.filter((p) => p.isPopular).slice(0, 8);
  const discountProducts = productsWithPrices
    .filter((p) => p.prices.some((pr) => pr.isOnDiscount))
    .slice(0, 4);

  // Category icons mapping
  const categoryMeta: Record<string, { icon: string; count: number }> = {
    'Qumësht & Vezë': { icon: '🥛', count: productsWithPrices.filter(p => p.category === 'Qumësht & Vezë').length },
    'Bukë & Brumëra': { icon: '🍞', count: productsWithPrices.filter(p => p.category === 'Bukë & Brumëra').length },
    'Vaj & Ushqim Bazik': { icon: '🌾', count: productsWithPrices.filter(p => p.category === 'Vaj & Ushqim Bazik').length },
    'Fruta & Perime': { icon: '🍎', count: productsWithPrices.filter(p => p.category === 'Fruta & Perime').length },
    'Mish & Delikatesë': { icon: '🥩', count: productsWithPrices.filter(p => p.category === 'Mish & Delikatesë').length },
    'Pije & Lëngje': { icon: '🧃', count: productsWithPrices.filter(p => p.category === 'Pije & Lëngje').length },
    'Ëmbëlsira & Snack': { icon: '🍫', count: productsWithPrices.filter(p => p.category === 'Ëmbëlsira & Snack').length },
    'Higjienë & Pastrim': { icon: '🧼', count: productsWithPrices.filter(p => p.category === 'Higjienë & Pastrim').length },
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-slate-50/40 to-transparent pt-8 sm:pt-14 pb-12 sm:pb-16 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Platforma #1 e Kursimeve në Kosovë</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none">
              Krahaso çmimet. <br />
              <span className="text-emerald-600">Zgjidh më të lirën.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-600 leading-relaxed font-normal">
              Gjeni artikujt ushqimorë me çmimin më të leverdisshëm mes supermarketeve kryesore në Kosovë: Viva Fresh, ETC, Super Viva, Interex, Meridian dhe Maxi.
            </p>

            {/* Main Hero Search Bar */}
            <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto pt-2">
              <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 p-1.5 sm:p-2 focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-500 transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Kërkoni artikuj: qumësht, miell, vaj, kafe, vezë..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm sm:text-base bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm sm:text-base px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-95 cursor-pointer shrink-0"
                >
                  Kërko
                </button>
              </div>

              {/* Quick suggestions pills */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-4 text-xs">
                <span className="text-slate-400 font-medium mr-1">Shpesh kërkohen:</span>
                {['Qumësht Vita', 'Floil', 'Miell Finnesa', 'Vezë Konsumi', 'Devolli Prince', 'Djathë Sharri'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleQuickTag(tag)}
                    className="bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200/80 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* Quick 3 Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">6 Rrjete të Krahasuara</h4>
                <p className="text-xs text-slate-500">Mbi 260 pika shitjeje në mbarë Kosovën</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Kursime deri në 28%</h4>
                <p className="text-xs text-slate-500">Optimizim i zgjuar i shportës suaj</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                <ListPlus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Shportë e Integruar</h4>
                <p className="text-xs text-slate-500">Llogaritje automatike e totalit më të lirë</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Kategoritë Kryesore
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Eksploroni produktet sipas departamenteve të supermarketit
            </p>
          </div>
          <button
            onClick={() => { updateFilters({ category: '' }); setCurrentView('catalog'); }}
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer"
          >
            Të gjitha ({productsWithPrices.length}) <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const meta = categoryMeta[cat] || { icon: '🛒', count: 0 };
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="bg-white hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-300 rounded-2xl p-3.5 sm:p-4 text-center transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer group flex flex-col items-center justify-center"
              >
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {meta.icon}
                </span>
                <span className="font-bold text-xs text-slate-800 group-hover:text-emerald-900 line-clamp-1">
                  {cat}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 font-medium">
                  {meta.count} artikuj
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Daily Deals & Best Discounts Section */}
      {discountProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
            {/* Background shapes */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      Ofertat & Zbritjet e Ditës
                    </h2>
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Aktive
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                    Çmimet më të volitshme me zbritje të konfirmuara në supermarkete
                  </p>
                </div>
              </div>

              <button
                onClick={() => { updateFilters({ onlyDiscounts: true }); setCurrentView('catalog'); }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer shrink-0 self-start sm:self-auto"
              >
                Shiko të gjitha zbritjet →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {discountProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProductId(prod.id)}
                  className="bg-white rounded-2xl p-4 text-slate-900 border border-white/20 shadow-lg hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                      Zbritje Aktive
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {prod.packageSize}
                    </span>
                  </div>

                  <div className="h-32 flex items-center justify-center p-2 mb-2 bg-slate-50 rounded-xl">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-emerald-700 uppercase">
                      {prod.brand}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {prod.name}
                    </h4>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Fillon nga:</span>
                        <div className="text-lg font-black text-emerald-600">
                          €{prod.minPrice.toFixed(2)}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">
                        {prod.cheapestSupermarket?.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Products Comparison Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Produktet më të Kërkuara
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Artikujt më të konsumuar në amvisëritë kosovare me krahasimin e çmimeve
            </p>
          </div>
          <button
            onClick={() => setCurrentView('catalog')}
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer"
          >
            Hap Katalogun e Plotë <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Supermarkets Directory Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/70 border border-slate-200/80 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Supermarketet e Monitoruara në Kosovë
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Krahasoni çmimet sipas rrjeteve tregtare ku bëni pazar rregullisht
              </p>
            </div>
            <button
              onClick={() => setCurrentView('supermarkets')}
              className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer"
            >
              Shiko detajet e rrjeteve <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {supermarkets.map((sm) => (
              <button
                key={sm.id}
                onClick={() => handleSupermarketClick(sm.id)}
                className="bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-center transition-all hover:shadow-md cursor-pointer flex flex-col items-center justify-between group"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-sm mb-3 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: sm.color }}
                >
                  {sm.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {sm.name}
                  </h4>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {sm.totalStores} pika shitjeje
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Calculator Promo Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-emerald-700/15">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Dëshironi të shihni kursimin e plotë të shportës tuaj?
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Shtoni produktet që blini zakonisht dhe llogaritësi ynë inteligjent ju tregon menjëherë se cili supermarket del më i lirë për gjithë listën, ose si mund të kurseni deri në 28% duke i ndarë blerjet.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('shopping-list')}
            className="bg-white hover:bg-slate-100 text-emerald-800 font-extrabold text-sm sm:text-base px-6 sm:px-8 py-3.5 rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer shrink-0"
          >
            Hap Listën e Blerjeve
          </button>
        </div>
      </section>
    </div>
  );
};
