import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  Search, 
  Check, 
  ShoppingBag, 
  X, 
  Award
} from 'lucide-react';

export const ComparisonView: React.FC = () => {
  const { 
    productsWithPrices, 
    supermarkets, 
    selectedProductId, 
    setSelectedProductId, 
    addToShoppingList,
    isInShoppingList 
  } = useApp();

  // Multi-product compare list: default to the currently selected product or first 2 items
  const [comparedProductIds, setComparedProductIds] = useState<string[]>(() => {
    if (selectedProductId) {
      const other = productsWithPrices.find((p) => p.id !== selectedProductId);
      return other ? [selectedProductId, other.id] : [selectedProductId];
    }
    return productsWithPrices.slice(0, 2).map((p) => p.id);
  });

  const [tableSearch, setTableSearch] = useState('');

  const handleAddProductToCompare = (prodId: string) => {
    if (!comparedProductIds.includes(prodId) && comparedProductIds.length < 4) {
      setComparedProductIds([...comparedProductIds, prodId]);
    }
  };

  const handleRemoveProductFromCompare = (prodId: string) => {
    if (comparedProductIds.length > 1) {
      setComparedProductIds(comparedProductIds.filter((id) => id !== prodId));
    }
  };

  // Filtered products for full comparison table
  const tableFilteredProducts = productsWithPrices.filter((prod) => {
    if (!tableSearch) return true;
    const q = tableSearch.toLowerCase();
    return prod.name.toLowerCase().includes(q) || prod.brand.toLowerCase().includes(q) || prod.category.toLowerCase().includes(q);
  });

  const comparedProducts = productsWithPrices.filter((p) => comparedProductIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
            <BarChart3 className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Krahasimi i Detajuar
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Krahaso Çmimet mes Supermarketeve
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Krahasoni çmimet e sakta për të njëjtin artikull në të gjitha rrjetet kryesore tregtare në Kosovë dhe dalloni menjëherë ku ia vlen të blini.
        </p>
      </div>

      {/* Interactive Side-by-Side Product Comparison Cards */}
      <section className="bg-slate-50/80 rounded-3xl border border-slate-200/80 p-5 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Krahasim Direkt mes Artikujve ({comparedProducts.length}/4)
            </h2>
            <p className="text-xs text-slate-500">
              Shtoni deri në 4 artikuj për t'i analizuar krah për krah
            </p>
          </div>

          {/* Add product dropdown */}
          {comparedProductIds.length < 4 && (
            <div className="relative">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddProductToCompare(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm font-semibold bg-white border border-slate-300 rounded-xl text-slate-700 hover:border-emerald-500 focus:outline-none cursor-pointer shadow-xs"
              >
                <option value="">+ Shto produkt për krahasim...</option>
                {productsWithPrices
                  .filter((p) => !comparedProductIds.includes(p.id))
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.packageSize})
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {/* Side-by-side columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {comparedProducts.map((product) => {
            const isAdded = isInShoppingList(product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-5 relative"
              >
                {/* Remove button if multiple */}
                {comparedProductIds.length > 1 && (
                  <button
                    onClick={() => handleRemoveProductFromCompare(product.id)}
                    className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Hiq nga krahasimi"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Product info banner */}
                <div className="flex items-center gap-4 pr-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-xl p-2 shrink-0 border border-slate-100 flex items-center justify-center">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 uppercase">
                      {product.brand} • {product.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                        Paketimi: {product.packageSize}
                      </span>
                      {product.savingsAmount > 0 && (
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                          Kurseni deri €{product.savingsAmount.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Breakdown by supermarket */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Çmimet sipas Supermarketeve:
                  </span>

                  <div className="space-y-1.5">
                    {product.prices.map((record) => {
                      const isCheapest = record.price === product.minPrice;
                      const diff = record.price - product.minPrice;

                      return (
                        <div
                          key={record.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm transition-colors ${
                            isCheapest
                              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-semibold'
                              : 'bg-slate-50/60 border-slate-200/80 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-2.5 h-2.5 rounded-full" 
                              style={{ backgroundColor: record.supermarket.color }} 
                            />
                            <span className="font-bold">{record.supermarket.name}</span>
                            {isCheapest && (
                              <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full inline-flex items-center gap-0.5">
                                <Award className="w-3 h-3" />
                                Më e Lira
                              </span>
                            )}
                            {record.isOnDiscount && (
                              <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                                Zbritje
                              </span>
                            )}
                          </div>

                          <div className="flex items-baseline gap-2">
                            {record.isOnDiscount && record.oldPrice && (
                              <span className="text-xs text-slate-400 line-through">
                                €{record.oldPrice.toFixed(2)}
                              </span>
                            )}
                            <span className={`text-base font-extrabold ${isCheapest ? 'text-emerald-700' : 'text-slate-900'}`}>
                              €{record.price.toFixed(2)}
                            </span>
                            {diff > 0 && (
                              <span className="text-[11px] text-rose-600 font-semibold">
                                (+€{diff.toFixed(2)})
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Add button */}
                <div className="pt-2">
                  <button
                    onClick={() => addToShoppingList(product.id, 1, product.cheapestSupermarket?.id)}
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {isAdded ? <Check className="w-4 h-4 text-emerald-700" /> : <ShoppingBag className="w-4 h-4" />}
                    <span>{isAdded ? 'Artikulli është në Shportë' : 'Shto këtë artikull në Shportë'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comprehensive Supermarket Price Matrix Table */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Tabela e Plotë e Krahasimit të Çmimeve
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Shihni të gjitha çmimet në një tabelë të unifikuar me shënimin e çmimit më të ulët
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Filtro në tabelë (p.sh. Kafe, Miell)..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Responsive Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-3.5 px-4 min-w-[200px]">Artikulli</th>
                  <th className="py-3.5 px-3 min-w-[90px]">Madhësia</th>
                  {supermarkets.map((sm) => (
                    <th key={sm.id} className="py-3.5 px-3 min-w-[105px] text-center">
                      <span className="block truncate">{sm.name}</span>
                    </th>
                  ))}
                  <th className="py-3.5 px-4 min-w-[100px] text-right">Më e Lira</th>
                  <th className="py-3.5 px-4 min-w-[100px] text-center">Veprim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tableFilteredProducts.map((prod) => {
                  const isAdded = isInShoppingList(prod.id);

                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Product Name & Brand */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedProductId(prod.id)}
                          className="text-left font-bold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer block"
                        >
                          {prod.name}
                        </button>
                        <span className="text-[11px] text-slate-400 block font-medium">
                          {prod.brand} • {prod.category}
                        </span>
                      </td>

                      {/* Package Size */}
                      <td className="py-3 px-3 text-slate-600 font-medium">
                        {prod.packageSize}
                      </td>

                      {/* Supermarket Columns */}
                      {supermarkets.map((sm) => {
                        const rec = prod.prices.find((p) => p.supermarketId === sm.id);
                        if (!rec) {
                          return (
                            <td key={sm.id} className="py-3 px-3 text-center text-slate-300">
                              -
                            </td>
                          );
                        }

                        const isCheapest = rec.price === prod.minPrice;

                        return (
                          <td
                            key={sm.id}
                            className={`py-3 px-3 text-center font-semibold ${
                              isCheapest
                                ? 'bg-emerald-50/70 text-emerald-700 font-bold'
                                : 'text-slate-800'
                            }`}
                          >
                            <div className="flex flex-col items-center justify-center">
                              <span>€{rec.price.toFixed(2)}</span>
                              {isCheapest && (
                                <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-tight">
                                  Më e lira
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}

                      {/* Cheapest Supermarket info */}
                      <td className="py-3 px-4 text-right">
                        <div className="font-extrabold text-emerald-700 text-sm">
                          €{prod.minPrice.toFixed(2)}
                        </div>
                        <span className="text-[11px] text-slate-500 truncate block">
                          {prod.cheapestSupermarket?.name}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => addToShoppingList(prod.id, 1, prod.cheapestSupermarket?.id)}
                          className={`p-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700'
                          }`}
                          title={isAdded ? 'Në shportë' : 'Shto në shportë'}
                        >
                          {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
