import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Sparkles, 
  Share2, 
  Printer, 
  Check, 
  Store, 
  TrendingDown, 
  Award,
  AlertCircle
} from 'lucide-react';

export const ShoppingListView: React.FC = () => {
  const { 
    shoppingList, 
    productsWithPrices, 
    supermarkets, 
    updateShoppingListQuantity, 
    removeFromShoppingList, 
    clearShoppingList, 
    setCurrentView,
    addToShoppingList,
    showToast
  } = useApp();

  const [copied, setCopied] = useState(false);

  // Map shopping list items with product details
  const itemsWithDetails = shoppingList.map((item) => {
    const product = productsWithPrices.find((p) => p.id === item.productId);
    return {
      ...item,
      product,
    };
  }).filter((item) => item.product !== undefined);

  // Compute basket totals per supermarket
  const supermarketTotals = supermarkets.map((sm) => {
    let total = 0;
    let missingItemsCount = 0;

    itemsWithDetails.forEach((item) => {
      const priceRec = item.product?.prices.find((pr) => pr.supermarketId === sm.id);
      if (priceRec) {
        total += priceRec.price * item.quantity;
      } else {
        missingItemsCount += 1;
        // fallback to min price if not stocked
        total += (item.product?.minPrice || 0) * item.quantity;
      }
    });

    return {
      supermarket: sm,
      total: Number(total.toFixed(2)),
      missingItemsCount,
    };
  }).sort((a, b) => a.total - b.total);

  // Compute optimal split basket (buying each item at its cheapest store)
  const optimalTotal = Number(
    itemsWithDetails.reduce((sum, item) => {
      return sum + (item.product?.minPrice || 0) * item.quantity;
    }, 0).toFixed(2)
  );

  const highestSingleTotal = supermarketTotals.length > 0 
    ? supermarketTotals[supermarketTotals.length - 1].total 
    : 0;

  const lowestSingleTotal = supermarketTotals.length > 0 
    ? supermarketTotals[0].total 
    : 0;

  const cheapestSingleSupermarket = supermarketTotals[0]?.supermarket;
  const potentialSavings = Number((highestSingleTotal - optimalTotal).toFixed(2));
  const savingsPercent = highestSingleTotal > 0 ? Math.round((potentialSavings / highestSingleTotal) * 100) : 0;

  // Quick add basic pantry bundle if empty
  const handleAddBasics = () => {
    addToShoppingList('prod-1', 2); // Qumësht Vita
    addToShoppingList('prod-2', 1); // Vaj Floil
    addToShoppingList('prod-3', 1); // Miell Finnesa
    addToShoppingList('prod-4', 1); // Vezë Konsumi
    showToast('Artikujt bazë u shtuan në listën tuaj!', 'success');
  };

  // WhatsApp share
  const handleShareList = () => {
    let text = `🛒 *Lista ime e blerjeve në Çmimi.ks:*\n\n`;
    itemsWithDetails.forEach((item) => {
      const p = item.product!;
      text += `• ${item.quantity}x ${p.name} (${p.packageSize}) - €${(p.minPrice * item.quantity).toFixed(2)} (Më e lira: ${p.cheapestSupermarket?.name})\n`;
    });
    text += `\n*Totali i optimizuar:* €${optimalTotal.toFixed(2)}\n`;
    if (cheapestSingleSupermarket) {
      text += `*Dyqani i vetëm më i lirë:* ${cheapestSingleSupermarket.name} (€${lowestSingleTotal.toFixed(2)})\n`;
    }
    text += `\nLlogaritur me Çmimi.ks - Krahasimi i çmimeve në Kosovë`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Lista u formatua dhe u kopjua në kujtesë për WhatsApp / Mesazh!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (itemsWithDetails.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-100 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Lista juaj e blerjeve është e zbrazët
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Nuk keni shtuar ende asnjë artikull. Shtoni produktet e nevojshme për të llogaritur koston totale dhe për të zbuluar ku i gjeni më lirë.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setCurrentView('catalog')}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Eksploro Katalogun e Produkteve
          </button>
          <button
            onClick={handleAddBasics}
            className="w-full sm:w-auto bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-sm px-6 py-3 rounded-xl transition-all border border-emerald-200 cursor-pointer"
          >
            + Shto Artikujt Bazë Familjarë
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Lista e Blerjeve & Kursimet
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {itemsWithDetails.length} artikuj
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Llogaritësi inteligjent i shportës tregon koston e plotë sipas çdo supermarketi në Kosovë
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleShareList}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Kopjo listën për WhatsApp"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-500" />}
            <span>{copied ? 'U Kopjua!' : 'Dërgo / WhatsApp'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Printo listën"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Printo</span>
          </button>

          <button
            onClick={clearShoppingList}
            className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Pastro</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Product List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {itemsWithDetails.map((item) => {
              const product = item.product!;
              const itemTotalMin = product.minPrice * item.quantity;

              return (
                <div
                  key={item.productId}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl p-2 shrink-0 border border-slate-100 flex items-center justify-center">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-emerald-700 uppercase">
                        {product.brand}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {product.name}
                      </h4>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Paketimi: {product.packageSize} • Çmimi: €{product.minPrice.toFixed(2)}/copë
                      </div>
                      {product.cheapestSupermarket && (
                        <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                          Më e lira në: {product.cheapestSupermarket.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                      <button
                        onClick={() => updateShoppingListQuantity(product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-700 hover:bg-white transition-colors cursor-pointer"
                        title="Zvogëlo"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateShoppingListQuantity(product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-700 hover:bg-white transition-colors cursor-pointer"
                        title="Rrit"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-base font-extrabold text-slate-900 block">
                        €{itemTotalMin.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        (min total)
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromShoppingList(product.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Hiq nga lista"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentView('catalog')}
              className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer"
            >
              + Shto artikuj të tjerë nga katalogu
            </button>
          </div>
        </div>

        {/* Right: Price Comparison Breakdown Across Supermarkets (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Smart Savings Card */}
          <div className="bg-gradient-to-tr from-emerald-700 to-teal-800 rounded-2xl p-6 text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Shporta Inteligjente e Optimizuar
              </span>
              {potentialSavings > 0 && (
                <span className="bg-white text-emerald-900 text-xs font-black px-2.5 py-0.5 rounded-full">
                  -{savingsPercent}% Kursim
                </span>
              )}
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight">
                €{optimalTotal.toFixed(2)}
              </div>
              <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                Nëse blini secilin artikull në supermarketin ku ai ofrohet me çmimin më të ulët.
              </p>
            </div>

            {potentialSavings > 0 && (
              <div className="bg-white/10 rounded-xl p-3 border border-white/15 flex items-center gap-2.5 text-xs">
                <TrendingDown className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>
                  Kurseni deri në <strong>€{potentialSavings.toFixed(2)}</strong> krahasuar me alternativën më të shtrenjtë!
                </span>
              </div>
            )}
          </div>

          {/* Single Store Basket Totals Comparison */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-600" />
                Totali nëse blini të gjitha në NJË supermarket
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Krahasoni faturën totale për të zgjedhur dyqanin e vetëm më të leverdisshëm
              </p>
            </div>

            <div className="space-y-2">
              {supermarketTotals.map((item, index) => {
                const isCheapestStore = index === 0;
                const diffFromLowest = item.total - lowestSingleTotal;

                return (
                  <div
                    key={item.supermarket.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                      isCheapestStore
                        ? 'bg-emerald-50/80 border-emerald-300'
                        : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.supermarket.color }}
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs sm:text-sm text-slate-900">
                            {item.supermarket.name}
                          </span>
                          {isCheapestStore && (
                            <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full inline-flex items-center gap-0.5">
                              <Award className="w-3 h-3" />
                              Më e Lira
                            </span>
                          )}
                        </div>
                        {diffFromLowest > 0 && (
                          <span className="text-[11px] text-rose-600 font-semibold block">
                            +€{diffFromLowest.toFixed(2)} diferencë
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-base font-extrabold ${isCheapestStore ? 'text-emerald-700' : 'text-slate-900'}`}>
                        €{item.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-400 flex items-start gap-1.5 pt-2 border-t border-slate-100">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Llogaritja bazohet në çmimet shembull të regjistruara në sistem për secilin produkt në listë.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
