import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Product, Supermarket, PriceRecord, Category } from '../../types';

import { CATEGORIES } from '../../data/mockData';
import { 
  Settings, 
  Layers, 
  Store, 
  Coins, 
  Plus, 
  Edit2, 
  Trash2, 
  RotateCcw, 
  X, 
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  ArrowDownRight,
  ArrowUpRight,
  History,
  Clock
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    supermarkets, 
    priceRecords, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    addSupermarket,
    updateSupermarket,
    deleteSupermarket,
    savePriceRecord,
    deletePriceRecord,
    resetToDemoData,
    sources,
    priceHistory,
    auditLogs,
    isSyncing,
    triggerSync,
    syncAllSources
  } = useApp();

  const [activeTab, setActiveTab] = useState<'products' | 'supermarkets' | 'prices' | 'sync'>('products');
  const [syncingSourceId, setSyncingSourceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [supermarketModalOpen, setSupermarketModalOpen] = useState(false);
  const [editingSupermarket, setEditingSupermarket] = useState<Supermarket | null>(null);

  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<PriceRecord | null>(null);

  // Product Form state
  const [prodForm, setProdForm] = useState({
    name: '',
    brand: '',
    category: CATEGORIES[0] as Category,
    packageSize: '',
    unitPriceMeasure: 'kg' as 'kg' | 'L' | 'copë',
    barcode: '',
    imageUrl: '',
    description: '',
    isPopular: false,
  });

  // Supermarket Form state
  const [smForm, setSmForm] = useState({
    name: '',
    color: '#059669',
    cities: 'Prishtinë, Prizren, Pejë',
    totalStores: 10,
    description: '',
    website: 'https://',
    hotline: '038 123 456',
  });

  // Price Record Form state
  const [priceForm, setPriceForm] = useState({
    productId: products[0]?.id || '',
    supermarketId: supermarkets[0]?.id || '',
    price: 1.00,
    oldPrice: 1.20,
    isOnDiscount: false,
    isAvailable: true,
  });

  // Open Product Modal
  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProdForm({
        name: product.name,
        brand: product.brand,
        category: product.category,
        packageSize: product.packageSize,
        unitPriceMeasure: product.unitPriceMeasure || 'kg',
        barcode: product.barcode,
        imageUrl: product.imageUrl,
        description: product.description,
        isPopular: !!product.isPopular,
      });
    } else {
      setEditingProduct(null);
      setProdForm({
        name: '',
        brand: '',
        category: CATEGORIES[0],
        packageSize: '1 kg',
        unitPriceMeasure: 'kg',
        barcode: `3838600${Math.floor(100000 + Math.random() * 900000)}`,
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        description: '',
        isPopular: false,
      });
    }
    setProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...prodForm,
      });
    } else {
      addProduct(prodForm);
    }
    setProductModalOpen(false);
  };

  // Open Supermarket Modal
  const openSupermarketModal = (sm?: Supermarket) => {
    if (sm) {
      setEditingSupermarket(sm);
      setSmForm({
        name: sm.name,
        color: sm.color,
        cities: sm.cities.join(', '),
        totalStores: sm.totalStores,
        description: sm.description,
        website: sm.website,
        hotline: sm.hotline,
      });
    } else {
      setEditingSupermarket(null);
      setSmForm({
        name: '',
        color: '#059669',
        cities: 'Prishtinë, Prizren, Pejë, Ferizaj',
        totalStores: 15,
        description: '',
        website: 'https://',
        hotline: '038 000 000',
      });
    }
    setSupermarketModalOpen(true);
  };

  const handleSupermarketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cityList = smForm.cities.split(',').map((c) => c.trim()).filter(Boolean);
    const slug = smForm.name.toLowerCase().replace(/\s+/g, '-');

    if (editingSupermarket) {
      updateSupermarket({
        ...editingSupermarket,
        name: smForm.name,
        slug,
        color: smForm.color,
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        badgeText: smForm.name,
        cities: cityList,
        totalStores: Number(smForm.totalStores),
        description: smForm.description,
        website: smForm.website,
        hotline: smForm.hotline,
      });
    } else {
      addSupermarket({
        name: smForm.name,
        slug,
        color: smForm.color,
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        badgeText: smForm.name,
        cities: cityList,
        totalStores: Number(smForm.totalStores),
        description: smForm.description,
        website: smForm.website,
        hotline: smForm.hotline,
      });
    }
    setSupermarketModalOpen(false);
  };

  // Open Price Record Modal
  const openPriceModal = (rec?: PriceRecord) => {
    if (rec) {
      setEditingPrice(rec);
      setPriceForm({
        productId: rec.productId,
        supermarketId: rec.supermarketId,
        price: rec.price,
        oldPrice: rec.oldPrice || Number((rec.price * 1.15).toFixed(2)),
        isOnDiscount: !!rec.isOnDiscount,
        isAvailable: rec.isAvailable,
      });
    } else {
      setEditingPrice(null);
      setPriceForm({
        productId: products[0]?.id || '',
        supermarketId: supermarkets[0]?.id || '',
        price: 1.25,
        oldPrice: 1.45,
        isOnDiscount: false,
        isAvailable: true,
      });
    }
    setPriceModalOpen(true);
  };

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePriceRecord({
      id: editingPrice?.id,
      productId: priceForm.productId,
      supermarketId: priceForm.supermarketId,
      price: Number(priceForm.price),
      oldPrice: priceForm.isOnDiscount ? Number(priceForm.oldPrice) : undefined,
      isOnDiscount: priceForm.isOnDiscount,
      isAvailable: priceForm.isAvailable,
      lastUpdated: new Date().toISOString(),
    });
    setPriceModalOpen(false);
  };

  const totalDiscountCount = priceRecords.filter((p) => p.isOnDiscount).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Paneli Administrativ
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Menaxhoni produktet, rrjetet e supermarketeve dhe regjistrimet e çmimeve
          </p>
        </div>

        {/* Reset to Demo Data Button */}
        <button
          onClick={() => {
            if (window.confirm('A jeni të sigurt që dëshironi të rivendosni të dhënat fillestare demonstruese?')) {
              resetToDemoData();
            }
          }}
          className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl inline-flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <RotateCcw className="w-4 h-4 text-amber-700" />
          <span>Rivendos Të Dhënat Fillestare</span>
        </button>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block">Produkte Gjithsej</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{products.length}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Në {CATEGORIES.length} kategori</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block">Supermarkete</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{supermarkets.length}</div>
          <span className="text-[11px] text-slate-500 font-medium">Rrjete të monitoruara</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block">Çmime të Regjistruara</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{priceRecords.length}</div>
          <span className="text-[11px] text-blue-600 font-medium">Pika të krahasimit</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block">Zbritje Aktive</span>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">{totalDiscountCount}</div>
          <span className="text-[11px] text-rose-500 font-medium">Ofertat e ditës</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => { setActiveTab('products'); setSearchQuery(''); }}
          className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'products'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Produktet ({products.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('supermarkets'); setSearchQuery(''); }}
          className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'supermarkets'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Supermarketet ({supermarkets.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('prices'); setSearchQuery(''); }}
          className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'prices'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Çmimet ({priceRecords.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('sync'); setSearchQuery(''); }}
          className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'sync'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
          <span>Sinkronizimi & Burimet ({sources.length})</span>
        </button>
      </div>

      {/* TAB 1: PRODUKTET */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <input
                type="text"
                placeholder="Filtro produktet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={() => openProductModal()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Shto Produkt të Ri</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="py-3 px-4">Artikulli</th>
                    <th className="py-3 px-3">Kategoria</th>
                    <th className="py-3 px-3">Paketimi</th>
                    <th className="py-3 px-3">Barkodi</th>
                    <th className="py-3 px-4 text-right">Veprime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products
                    .filter((p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.imageUrl}
                              alt=""
                              className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-100 p-1"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">{prod.name}</span>
                              <span className="text-[11px] text-slate-400">{prod.brand}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">
                            {prod.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{prod.packageSize}</td>
                        <td className="py-3 px-3 text-slate-500 font-mono text-xs">{prod.barcode}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openProductModal(prod)}
                              className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Ndrysho"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Dëshironi të fshini produktin "${prod.name}"?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Fshi"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUPERMARKETET */}
      {activeTab === 'supermarkets' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => openSupermarketModal()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Shto Supermarket të Ri</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {supermarkets.map((sm) => (
              <div
                key={sm.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base"
                      style={{ backgroundColor: sm.color }}
                    >
                      {sm.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                      {sm.totalStores} dyqane
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mt-3">{sm.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{sm.description}</p>

                  <div className="text-xs text-slate-500 mt-3 space-y-1">
                    <div>
                      <strong>Tel:</strong> {sm.hotline}
                    </div>
                    <div>
                      <strong>Qytetet:</strong> {sm.cities.slice(0, 3).join(', ')}...
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={sm.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    Faqja e Internetit
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openSupermarketModal(sm)}
                      className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Dëshironi të fshini supermarketin "${sm.name}"?`)) {
                          deleteSupermarket(sm.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ÇMIMET */}
      {activeTab === 'prices' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <input
                type="text"
                placeholder="Filtro sipas produktit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={() => openPriceModal()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Regjistro Çmim të Ri</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="py-3 px-4">Artikulli</th>
                    <th className="py-3 px-4">Supermarketi</th>
                    <th className="py-3 px-3 text-right">Çmimi Aktuar</th>
                    <th className="py-3 px-3 text-center">Zbritje</th>
                    <th className="py-3 px-4 text-right">Veprime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {priceRecords
                    .filter((pr) => {
                      if (!searchQuery) return true;
                      const prod = products.find((p) => p.id === pr.productId);
                      return prod?.name.toLowerCase().includes(searchQuery.toLowerCase());
                    })
                    .map((rec) => {
                      const prod = products.find((p) => p.id === rec.productId);
                      const sm = supermarkets.find((s) => s.id === rec.supermarketId);

                      return (
                        <tr key={rec.id} className="hover:bg-slate-50/70">
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 block">{prod?.name || rec.productId}</span>
                            <span className="text-[11px] text-slate-400">{prod?.brand}</span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-700">
                            {sm?.name || rec.supermarketId}
                          </td>
                          <td className="py-3 px-3 text-right font-extrabold text-slate-900 text-sm">
                            €{rec.price.toFixed(2)}
                            {rec.isOnDiscount && rec.oldPrice && (
                              <span className="block text-[10px] text-slate-400 line-through">
                                €{rec.oldPrice.toFixed(2)}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {rec.isOnDiscount ? (
                              <span className="bg-rose-100 text-rose-700 font-bold text-[10px] px-2 py-0.5 rounded-full">
                                Po
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs">Jo</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openPriceModal(rec)}
                                className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                                title="Ndrysho çmimin"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('Dëshironi të hiqni këtë çmim?')) {
                                    deletePriceRecord(rec.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                title="Fshi"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SINKRONIZIMI DHE BURIMET */}
      {activeTab === 'sync' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Top Banner & Global Action */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Politika e Transparencës dhe Integrimit të Autorizuar</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Paneli i Sinkronizimit të Supermarketeve
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Të gjitha burimet e të dhënave monitorohen me përshtatës të veçantë (adapters). Çmimet merren nga kanalet e autorizuara ose shënohen me statusin e saktë të verifikimit për të garantuar transparencë maksimale për konsumatorët në Kosovë.
              </p>
            </div>

            <button
              onClick={async () => {
                await syncAllSources();
              }}
              disabled={isSyncing}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl inline-flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer self-start md:self-auto shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Duke sinkronizuar...' : 'Sinkronizo Të Gjitha Burimet'}</span>
            </button>
          </div>

          {/* Table of 6 Data Sources */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Store className="w-5 h-5 text-emerald-600" />
                  Gjendja e 6 Burimeve të Supermarketeve në Kosovë
                </h3>
                <p className="text-xs text-slate-500">
                  Statusi i verifikuar i secilit kanal të të dhënave dhe mënyra e lidhjes
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                      <th className="py-3.5 px-4">Supermarketi & URL</th>
                      <th className="py-3.5 px-3">Formati i të Dhënave</th>
                      <th className="py-3.5 px-3">Statusi i Integrimit</th>
                      <th className="py-3.5 px-3 text-center">Artikuj</th>
                      <th className="py-3.5 px-3">Përditësimi i Fundit</th>
                      <th className="py-3.5 px-4 text-right">Veprim</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sources.map((src) => {
                      const isCurrentlySyncing = syncingSourceId === src.id;

                      const statusBadges = {
                        active_public_catalog: {
                          label: 'E Autorizuar & Aktive',
                          className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                          icon: CheckCircle2,
                        },
                        partially_authorized_pdf: {
                          label: 'Pjesërisht (Fletushkë PDF)',
                          className: 'bg-amber-100 text-amber-800 border-amber-200',
                          icon: AlertTriangle,
                        },
                        pending_authorization: {
                          label: 'Në Pritje të Autorizimit',
                          className: 'bg-purple-100 text-purple-800 border-purple-200',
                          icon: Clock,
                        },
                        unreachable_dev_host: {
                          label: 'Host Dev i Paarritshëm',
                          className: 'bg-rose-100 text-rose-800 border-rose-200',
                          icon: AlertTriangle,
                        },
                        error: {
                          label: 'Gabim Lidhjeje',
                          className: 'bg-rose-100 text-rose-800 border-rose-200',
                          icon: AlertTriangle,
                        },
                      };

                      const badge = statusBadges[src.status] || statusBadges.pending_authorization;
                      const BadgeIcon = badge.icon;

                      return (
                        <tr key={src.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 block">{src.name}</span>
                            <a
                              href={src.officialUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-emerald-700 hover:underline inline-flex items-center gap-1 mt-0.5"
                            >
                              <span className="truncate max-w-[220px]">{src.officialUrl}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 max-w-sm">
                              {src.notes}
                            </p>
                          </td>

                          <td className="py-3.5 px-3">
                            <span className="font-semibold text-slate-700 block">{src.dataFormat}</span>
                            <span className="text-[11px] text-slate-400 capitalize">
                              Tipi: {src.authType.replace('_', ' ')}
                            </span>
                          </td>

                          <td className="py-3.5 px-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${badge.className}`}>
                              <BadgeIcon className="w-3.5 h-3.5 shrink-0" />
                              <span>{badge.label}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-3 text-center font-bold text-slate-800">
                            {src.importedCount}
                          </td>

                          <td className="py-3.5 px-3 text-slate-500 text-xs">
                            {src.lastSyncAt ? (
                              <div>
                                <span className="block font-medium text-slate-700">
                                  {new Date(src.lastSyncAt).toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(src.lastSyncAt).toLocaleDateString('sq-AL', { day: 'numeric', month: 'short' })}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">E papërditësuar</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={async () => {
                                setSyncingSourceId(src.id);
                                try {
                                  await triggerSync(src.id);
                                } finally {
                                  setSyncingSourceId(null);
                                }
                              }}
                              disabled={isCurrentlySyncing || isSyncing}
                              className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:border-emerald-500 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${isCurrentlySyncing ? 'animate-spin text-emerald-600' : ''}`} />
                              <span>{isCurrentlySyncing ? 'Sinkronizon...' : 'Sinkronizo'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section: Price Change History & Audit Logs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Price Change History */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Historiku i Ndryshimit të Çmimeve
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {priceHistory.length} ndryshime të regjistruara
                </span>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {priceHistory.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center">Nuk ka ende ndryshime çmimesh.</p>
                ) : (
                  priceHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{item.productName}</span>
                        <span className="text-[11px] text-slate-500">
                          {item.supermarketName} • {item.sourceName}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {new Date(item.recordedAt).toLocaleString('sq-AL', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1 font-bold">
                          <span className="text-slate-400 line-through">€{item.oldPrice.toFixed(2)}</span>
                          <span className="text-sm text-slate-900">→ €{item.newPrice.toFixed(2)}</span>
                        </div>
                        <span className={`inline-flex items-center gap-0.5 font-bold text-[10px] px-1.5 py-0.2 rounded ${
                          item.changeType === 'decrease'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {item.changeType === 'decrease' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          {item.changeType === 'decrease' ? 'Zbritje' : 'Rritje'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Audit Logs */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Regjistri i Auditimit të Sinkronizimit
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {auditLogs.length} regjistrime
                </span>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{log.sourceName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.status === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {log.message}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Artikuj të importuar: {log.itemsImported} | Të përditësuar: {log.itemsUpdated}</span>
                      <span>
                        {new Date(log.timestamp).toLocaleTimeString('sq-AL', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT MODAL FORM */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingProduct ? 'Modifiko Produktin' : 'Shto Produkt të Ri'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Emri i Artikullit</label>
                <input
                  type="text"
                  required
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  placeholder="p.sh. Qumësht UHT 3.2%"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Marka</label>
                  <input
                    type="text"
                    required
                    value={prodForm.brand}
                    onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })}
                    placeholder="p.sh. Vita"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kategoria</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value as Category })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Madhësia e Paketimit</label>
                  <input
                    type="text"
                    required
                    value={prodForm.packageSize}
                    onChange={(e) => setProdForm({ ...prodForm, packageSize: e.target.value })}
                    placeholder="p.sh. 1 L ose 500 g"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Barkodi</label>
                  <input
                    type="text"
                    required
                    value={prodForm.barcode}
                    onChange={(e) => setProdForm({ ...prodForm, barcode: e.target.value })}
                    placeholder="3838600..."
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">URL e Fotos</label>
                <input
                  type="url"
                  required
                  value={prodForm.imageUrl}
                  onChange={(e) => setProdForm({ ...prodForm, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Përshkrimi</label>
                <textarea
                  rows={2}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  placeholder="Përshkrim i shkurtër i produktit..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 cursor-pointer shadow-sm"
                >
                  {editingProduct ? 'Ruaj Ndryshimet' : 'Krijo Produktin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUPERMARKET MODAL FORM */}
      {supermarketModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingSupermarket ? 'Modifiko Supermarketin' : 'Shto Supermarket'}
              </h3>
              <button onClick={() => setSupermarketModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSupermarketSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Emri i Rrjetit</label>
                <input
                  type="text"
                  required
                  value={smForm.name}
                  onChange={(e) => setSmForm({ ...smForm, name: e.target.value })}
                  placeholder="p.sh. Maxi Market"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ngjyra e Identitetit</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={smForm.color}
                      onChange={(e) => setSmForm({ ...smForm, color: e.target.value })}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <span className="font-mono text-xs">{smForm.color}</span>
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nr. i Dyqaneve</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={smForm.totalStores}
                    onChange={(e) => setSmForm({ ...smForm, totalStores: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Qytetet e Mbuluara (me presje)</label>
                <input
                  type="text"
                  required
                  value={smForm.cities}
                  onChange={(e) => setSmForm({ ...smForm, cities: e.target.value })}
                  placeholder="Prishtinë, Prizren, Pejë, Ferizaj"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Përshkrimi</label>
                <textarea
                  rows={2}
                  value={smForm.description}
                  onChange={(e) => setSmForm({ ...smForm, description: e.target.value })}
                  placeholder="Informata mbi rrjetin e dyqaneve..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setSupermarketModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 cursor-pointer shadow-sm"
                >
                  {editingSupermarket ? 'Ruaj Ndryshimet' : 'Krijo Supermarketin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRICE RECORD MODAL FORM */}
      {priceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingPrice ? 'Përditëso Çmimin' : 'Regjistro Çmim të Ri'}
              </h3>
              <button onClick={() => setPriceModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePriceSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Zgjidh Produktin</label>
                <select
                  value={priceForm.productId}
                  onChange={(e) => setPriceForm({ ...priceForm, productId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.packageSize}) - {p.brand}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Zgjidh Supermarketin</label>
                <select
                  value={priceForm.supermarketId}
                  onChange={(e) => setPriceForm({ ...priceForm, supermarketId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                >
                  {supermarkets.map((sm) => (
                    <option key={sm.id} value={sm.id}>
                      {sm.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Çmimi Aktuar (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.05"
                    required
                    value={priceForm.price}
                    onChange={(e) => setPriceForm({ ...priceForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Çmimi i Vjetër (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.05"
                    disabled={!priceForm.isOnDiscount}
                    value={priceForm.oldPrice}
                    onChange={(e) => setPriceForm({ ...priceForm, oldPrice: parseFloat(e.target.value) || 0 })}
                    className={`w-full px-3 py-2 border rounded-xl ${
                      !priceForm.isOnDiscount ? 'bg-slate-100 text-slate-400' : ''
                    }`}
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={priceForm.isOnDiscount}
                    onChange={(e) => setPriceForm({ ...priceForm, isOnDiscount: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-700">Artikulli është në zbritje / aksion</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setPriceModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 cursor-pointer shadow-sm"
                >
                  Ruaj Çmimin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
