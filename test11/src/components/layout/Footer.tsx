import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Shield, Info, Heart, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, supermarkets, setSelectedSupermarketId, updateFilters } = useApp();

  const handleSupermarketClick = (smId: string) => {
    setSelectedSupermarketId(smId);
    updateFilters({ supermarketId: smId });
    setCurrentView('supermarkets');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 lg:pb-12 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Çmimi<span className="text-emerald-400">.ks</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Platforma e pavarur për krahasimin e çmimeve të supermarketeve në Kosovë. Zbuloni ofertat më të lira, krahasoni artikujt bazë dhe kurseni në çdo blerje ditore.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Transparencë dhe kursim për konsumatorin kosovar.</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3.5 tracking-wide uppercase text-xs">
              Lidhje të Shpejta
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Ballina Kryesore
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentView('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Katalogu i Produkteve
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentView('compare'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Tabela e Krahasimit
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentView('shopping-list'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Lista e Blerjeve dhe Kursimet
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentView('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Paneli Administrativ
                </button>
              </li>
            </ul>
          </div>

          {/* Supermarket Directory Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3.5 tracking-wide uppercase text-xs">
              Supermarketet në Kosovë
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              {supermarkets.map((sm) => (
                <li key={sm.id}>
                  <button
                    onClick={() => handleSupermarketClick(sm.id)}
                    className="hover:text-emerald-400 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>{sm.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities and Disclaimers */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm mb-3.5 tracking-wide uppercase text-xs">
              Mbulimi në Kosovë
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Krahasojmë çmimet në qytetet kryesore:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['Prishtinë', 'Prizren', 'Pejë', 'Ferizaj', 'Gjilan', 'Gjakovë', 'Mitrovicë'].map((city) => (
                <span
                  key={city}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium"
                >
                  {city}
                </span>
              ))}
            </div>
            <div className="pt-2 text-xs text-slate-500 flex items-start gap-1.5">
              <Info className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
              <span>
                Çmimet në këtë version janë demonstrative. Të gjitha të drejtat e emrave tregtarë u takojnë pronarëve përkatës.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Çmimi.ks - Të gjitha të drejtat e rezervuara.</p>
          <div className="flex items-center gap-1">
            <span>Krijuar për konsumatorët në Kosovë me</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
