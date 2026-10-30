import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Store, 
  MapPin, 
  Phone, 
  ExternalLink, 
  ShoppingBag, 
  Check, 
  ArrowLeft, 
  Award,
  Search
} from 'lucide-react';

export const SupermarketsView: React.FC = () => {
  const { 
    supermarkets, 
    productsWithPrices, 
    selectedSupermarketId, 
    setSelectedSupermarketId, 
    setSelectedProductId,
    addToShoppingList,
    isInShoppingList
  } = useApp();

  const [searchInMarket, setSearchInMarket] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const activeSupermarket = supermarkets.find((sm) => sm.id === selectedSupermarketId);

  // Products available at selected supermarket
  const supermarketProducts = productsWithPrices
    .map((prod) => {
      const priceRecord = prod.prices.find(
        (p) => p.supermarketId === (activeSupermarket?.id || '')
      );
      return {
        ...prod,
        currentRecord: priceRecord,
      };
    })
    .filter((item) => item.currentRecord !== undefined)
    .filter((item) => {
      if (selectedCategory && item.category !== selectedCategory) return false;
      if (searchInMarket) {
        const q = searchInMarket.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.brand.toLowerCase().includes(q);
      }
      return true;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* If a supermarket is selected, show its full profile and products */}
      {activeSupermarket ? (
        <div className="space-y-8 animate-in fade-in">
          {/* Back button */}
          <button
            onClick={() => setSelectedSupermarketId(null)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kthehu te lista e të gjitha supermarketeve</span>
          </button>

          {/* Supermarket Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-5">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-md shrink-0"
                  style={{ backgroundColor: activeSupermarket.color }}
                >
                  {activeSupermarket.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {activeSupermarket.name}
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                    {activeSupermarket.description}
                  </p>
                </div>
              </div>

              {/* Quick Contact & Info */}
              <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Store className="w-4 h-4 text-emerald-600" />
                  <span>{activeSupermarket.totalStores} pika shitjeje në Kosovë</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>Kujdesi ndaj klientit: {activeSupermarket.hotline}</span>
                </div>
                <a
                  href={activeSupermarket.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold underline"
                >
                  <span>Faqja zyrtare</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* City coverage tags */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 mr-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Qytetet:</span>
              </div>
              {activeSupermarket.cities.map((city) => (
                <span
                  key={city}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>

          {/* Product list header & search */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Produktet e Regjistruara në {activeSupermarket.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Duke shfaqur {supermarketProducts.length} artikuj me çmimet përkatëse
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-emerald-500 shadow-xs cursor-pointer"
                >
                  <option value="">Të gjitha kategoritë</option>
                  {Array.from(new Set(productsWithPrices.map((p) => p.category))).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Kërko artikull në këtë market..."
                    value={searchInMarket}
                    onChange={(e) => setSearchInMarket(e.target.value)}
                    className="pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 shadow-xs"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {supermarketProducts.map((prod) => {
                const rec = prod.currentRecord!;
                const isCheapestInMarket = rec.price === prod.minPrice;
                const isAdded = isInShoppingList(prod.id);

                return (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProductId(prod.id)}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500/40 p-4 flex flex-col justify-between transition-all hover:shadow-md cursor-pointer relative"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {prod.category}
                        </span>
                        {isCheapestInMarket && (
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <Award className="w-3 h-3" />
                            Më e Lira
                          </span>
                        )}
                        {rec.isOnDiscount && (
                          <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            Zbritje
                          </span>
                        )}
                      </div>

                      {/* Image */}
                      <div className="w-full h-36 bg-slate-50 rounded-xl p-2 flex items-center justify-center mb-3">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <span className="text-[11px] font-bold text-emerald-700 uppercase">
                        {prod.brand}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                        {prod.name}
                      </h4>
                      <span className="text-xs text-slate-400 block mt-0.5">
                        Madhësia: {prod.packageSize}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Çmimi këtu:</span>
                        <div className="flex items-baseline gap-1.5">
                          {rec.isOnDiscount && rec.oldPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              €{rec.oldPrice.toFixed(2)}
                            </span>
                          )}
                          <span className="text-xl font-black text-slate-900">
                            €{rec.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToShoppingList(prod.id, 1, activeSupermarket.id);
                        }}
                        className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                        <span>{isAdded ? 'Në Shportë' : 'Shto'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Supermarket Directory Grid (When no specific supermarket is selected) */
        <div className="space-y-8">
          <div className="border-b border-slate-200 pb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Zinxhirët Tregtarë
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Supermarketet në Kosovë
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Zbuloni rrjetet e supermarketeve më të njohura në Kosovë, shikoni numrin e pikave të shitjes, qytetet ku operojnë dhe shfletoni katalogun e tyre të çmimeve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supermarkets.map((sm) => {
              const productCount = productsWithPrices.filter((p) =>
                p.prices.some((pr) => pr.supermarketId === sm.id)
              ).length;

              const cheapestCount = productsWithPrices.filter((p) =>
                p.cheapestSupermarket?.id === sm.id
              ).length;

              return (
                <div
                  key={sm.id}
                  onClick={() => setSelectedSupermarketId(sm.id)}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-500/40 shadow-xs hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer group"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-md group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: sm.color }}
                      >
                        {sm.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        {sm.totalStores} dyqane
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {sm.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                        {sm.description}
                      </p>
                    </div>

                    {/* Stats pills */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <div className="bg-slate-50 rounded-xl p-2.5 text-center">
                        <span className="text-[10px] text-slate-400 block font-medium">Artikuj të monitoruar</span>
                        <span className="text-sm font-bold text-slate-800">{productCount} artikuj</span>
                      </div>
                      <div className="bg-emerald-50/70 rounded-xl p-2.5 text-center">
                        <span className="text-[10px] text-emerald-800 block font-medium">Më e lira për</span>
                        <span className="text-sm font-bold text-emerald-700">{cheapestCount} artikuj</span>
                      </div>
                    </div>

                    {/* Cities */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        Prani kryesore në:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {sm.cities.slice(0, 5).map((city) => (
                          <span
                            key={city}
                            className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                          >
                            {city}
                          </span>
                        ))}
                        {sm.cities.length > 5 && (
                          <span className="text-[11px] text-slate-400 font-semibold px-1 py-0.5">
                            +{sm.cities.length - 5} të tjera
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                    <span>Shiko artikujt & çmimet</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
