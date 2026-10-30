import React, { useState } from 'react';
import type { ProductWithPrices } from '../../types';
import { useApp } from '../../context/AppContext';

import { ShoppingBag, Check, BarChart2, Tag } from 'lucide-react';


interface ProductCardProps {
  product: ProductWithPrices;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    addToShoppingList, 
    isInShoppingList, 
    setSelectedProductId, 
    setCurrentView 
  } = useApp();

  const [imgError, setImgError] = useState(false);
  const isAdded = isInShoppingList(product.id);

  const hasDiscount = product.prices.some((p) => p.isOnDiscount);
  const discountRecord = product.prices.find((p) => p.isOnDiscount && p.oldPrice);

  const handleOpenDetail = () => {
    setSelectedProductId(product.id);
  };

  const handleQuickCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProductId(product.id);
    setCurrentView('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToShoppingList(product.id, 1, product.cheapestSupermarket?.id);
  };

  return (
    <div 
      onClick={handleOpenDetail}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/40 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <span className="bg-white/90 backdrop-blur-md text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-200/60 shadow-xs">
          {product.category}
        </span>

        {hasDiscount && (
          <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 animate-pulse">
            <Tag className="w-3 h-3" />
            Zbritje
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative w-full h-48 sm:h-52 bg-slate-50 flex items-center justify-center p-4 overflow-hidden border-b border-slate-100">
        {!imgError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <ShoppingBag className="w-12 h-12 stroke-1 text-slate-300 mb-2" />
            <span className="text-xs font-medium text-slate-400">{product.name}</span>
          </div>
        )}

        {/* Package size pill */}
        <span className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
          {product.packageSize}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand */}
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            {product.brand}
          </div>

          {/* Product Name */}
          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Pricing Box */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[11px] font-medium text-slate-500 block">Çmimi më i ulët:</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                  €{product.minPrice.toFixed(2)}
                </span>
                {discountRecord && (
                  <span className="text-xs text-slate-400 line-through">
                    €{discountRecord.oldPrice?.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {product.savingsAmount > 0 && (
              <div className="text-right">
                <span className="text-[11px] font-medium text-slate-500 block">Kursimi:</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Deri në -€{product.savingsAmount.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Cheapest Supermarket Tag */}
          {product.cheapestSupermarket && (
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium">Më e lira në:</span>
              <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                {product.cheapestSupermarket.name}
              </span>
            </div>
          )}

          {/* Supermarket count badge */}
          <div className="text-[11px] text-slate-400">
            E disponueshme në {product.prices.length} supermarkete
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              isAdded
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-700/20 active:scale-[0.98]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Në Shportë</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Shto</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleQuickCompare}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            title="Krahaso çmimet mes supermarketeve"
          >
            <BarChart2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
