import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export const DemoNoticeBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-medium">
            Version Demonstrativ: Çmimet e shfaqura janë orientuese për qëllime testimi dhe zhvillimi të platformës në Kosovë.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-amber-800 hover:text-amber-950 underline font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            {isExpanded ? 'Më pak hollësi' : 'Më shumë hollësi'}
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-amber-100/70 border-t border-amber-200/80 px-4 py-3 text-xs sm:text-sm text-amber-950">
          <div className="max-w-7xl mx-auto space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-amber-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Politika e Transparencës së Çmimeve:
            </div>
            <p className="text-amber-900/90 leading-relaxed">
              Kjo platformë demonstron funksionalitetin e plotë për krahasimin e çmimeve ndërmjet supermarketeve në Kosovë (Viva Fresh Store, ETC, Super Viva, Interex, Meridian Express, Maxi Market). Të dhënat aktuale janë shembuj realistë zhvillimi dhe nuk përfaqësojnë çmimet zyrtare të garantuara të supermarketeve në kohë reale. Mund të përdorni Panelin Administrativ për të përditësuar ose shtuar çmime sipas dëshirës.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
