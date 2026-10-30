import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Layers, BarChart3, Store, ShoppingBag } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView, shoppingList } = useApp();

  const totalCount = shoppingList.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { id: 'home', label: 'Ballina', icon: Home },
    { id: 'catalog', label: 'Katalogu', icon: Layers },
    { id: 'compare', label: 'Krahaso', icon: BarChart3 },
    { id: 'supermarkets', label: 'Markete', icon: Store },
    { 
      id: 'shopping-list', 
      label: 'Shporta', 
      icon: ShoppingBag, 
      badge: totalCount > 0 ? totalCount : null 
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as any)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative cursor-pointer min-w-[56px] ${
                isActive ? 'text-emerald-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
