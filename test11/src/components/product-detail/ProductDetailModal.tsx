import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShoppingBag, 
  Store, 
  Clock, 
  ShieldAlert, 
  TrendingDown, 
  Share2, 
  ExternalLink 
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProductId, 
    setSelectedProductId, 
    productsWithPrices, 
    addToShoppingList, 
    isInShoppingList,
    showToast,
    setCurrentView,
    setSelectedSupermarketId,
    updateFilters
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  if (!selectedProductId) return null;

  const product = productsWithPrices.find((p) => p.id === selectedProductId);
  if (!product) return null;

  const isAdded = isInShoppingList(product.id);

  const handleClose = () => {
    setSelectedProductId(null);
  };

  const handleAddToCart = () => {
    addToShoppingList(product.id, quantity, product.cheapestSupermarket?.id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `Shiko krahasimin e çmimeve për "${product.name}" në Çmimi.ks! Çmimi fillon nga vetëm €${product.minPrice.toFixed(2)}.`
    );
    setCopied(true);
    showToast('Linku dhe teksti u kopjuan në kujtesë!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSupermarketClick = (smId: string) => {
    setSelectedSupermarketId(smId);
    updateFilters({ supermarketId: smId });
    setSelectedProductId(null);
    setCurrentView('supermarkets');
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('sq-AL', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Kohët e fundit';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 relative animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              {product.category}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Kodi/Barkodi: {product.barcode}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              title={copied ? 'U kopjua!' : 'Shpërndaj produktin'}
            >
              <Share2 className={`w-4 h-4 ${copied ? 'text-emerald-600' : ''}`} />
            </button>
            <button
              onClick={handleClose}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              aria-label="Mbyll"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Product Overview: Image + Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-5 bg-slate-50 rounded-2xl p-6 flex items-center justify-center border border-slate-100 relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-56 object-contain"
              />
              <span className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                {product.packageSize}
              </span>
            </div>

            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  {product.brand}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5 leading-snug">
                  {product.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price summary box */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-emerald-800">Çmimi më i volitshëm:</span>
                  <div className="text-3xl font-extrabold text-emerald-700">
                    €{product.minPrice.toFixed(2)}
                  </div>
                  {product.cheapestSupermarket && (
                    <div className="text-xs text-emerald-900 font-medium mt-0.5">
                      në {product.cheapestSupermarket.name}
                    </div>
                  )}
                </div>

                {product.savingsAmount > 0 && (
                  <div className="text-right">
                    <span className="text-xs font-medium text-slate-600 block">Diferenca maksimale:</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-800 text-sm bg-white px-2.5 py-1 rounded-lg shadow-xs mt-0.5">
                      <TrendingDown className="w-4 h-4 text-emerald-600" />
                      Kurseni €{product.savingsAmount.toFixed(2)} ({product.savingsPercentage}%)
                    </span>
                  </div>
                )}
              </div>

              {/* Add to list form */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-slate-700 hover:bg-white transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-9 text-center font-bold text-sm text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-slate-700 hover:bg-white transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.99]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {isAdded ? 'Ndrysho / Shto në Shportë' : 'Shto në Listën e Blerjeve'} {quantity > 1 ? `(${quantity})` : ''}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Price Comparison Table Across All Supermarkets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-600" />
                Krahasimi i çmimeve sipas Supermarketeve në Kosovë
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {product.prices.length} çmime të regjistruara
              </span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white shadow-xs">
              {product.prices.map((record, index) => {
                const isCheapest = record.price === product.minPrice;
                const diffFromMin = record.price - product.minPrice;

                return (
                  <div
                    key={record.id}
                    className={`p-3.5 sm:p-4 flex items-center justify-between transition-colors ${
                      isCheapest ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700 border border-slate-200">
                        {index + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSupermarketClick(record.supermarket.id)}
                            className="font-bold text-sm sm:text-base text-slate-900 hover:text-emerald-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>{record.supermarket.name}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </button>

                          {isCheapest && (
                            <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                              Më e Lira ★
                            </span>
                          )}

                          {record.isOnDiscount && (
                            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              Zbritje
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1 text-[11px] text-slate-600">
                            <strong>Burimi:</strong> 
                            {record.sourceUrl ? (
                              <a
                                href={record.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-700 hover:underline inline-flex items-center gap-0.5 font-medium"
                              >
                                {record.sourceName || record.supermarket.name}
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ) : (
                              <span>{record.sourceName || record.supermarket.name}</span>
                            )}
                          </span>

                          <span className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Verifikuar: {formatDate(record.verifiedAt || record.lastUpdated)}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-1.5">
                        {record.isOnDiscount && record.oldPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            €{record.oldPrice.toFixed(2)}
                          </span>
                        )}
                        <span className={`text-xl font-extrabold ${isCheapest ? 'text-emerald-600' : 'text-slate-900'}`}>
                          €{record.price.toFixed(2)}
                        </span>
                      </div>

                      {diffFromMin > 0 ? (
                        <div className="text-[11px] text-rose-600 font-semibold">
                          +€{diffFromMin.toFixed(2)} më shtrenjtë
                        </div>
                      ) : (
                        <div className="text-[11px] text-emerald-700 font-semibold">
                          Ofertë optimale
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transparency Disclaimer Footer */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-500 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Shënim orientues:</strong> Të gjitha çmimet janë të vlefshme për qëllime krahasimi dhe testimi të këtij aplikacioni. Për çmimet e sakta në ditën e sotme, ju lutemi konsultoni fletushkat zyrtare të supermarketeve në Kosovë.
            </p>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Kthehu
          </button>

          <button
            onClick={() => {
              handleClose();
              setCurrentView('compare');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-emerald-700 hover:text-emerald-800 text-xs sm:text-sm font-bold inline-flex items-center gap-1 cursor-pointer"
          >
            Shiko tabelën e plotë të krahasimit →
          </button>
        </div>
      </div>
    </div>
  );
};
