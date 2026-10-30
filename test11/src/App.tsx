import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoNoticeBanner } from './components/common/DemoNoticeBanner';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/layout/ToastContainer';
import { HomeView } from './components/home/HomeView';
import { CatalogView } from './components/catalog/CatalogView';
import { ComparisonView } from './components/comparison/ComparisonView';
import { ShoppingListView } from './components/shopping-list/ShoppingListView';
import { SupermarketsView } from './components/supermarkets/SupermarketsView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProductDetailModal } from './components/product-detail/ProductDetailModal';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  // Scroll to top whenever view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Transparency Disclaimer Notice */}
      <DemoNoticeBanner />

      {/* Main Navigation Header */}
      <Header />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'catalog' && <CatalogView />}
        {currentView === 'compare' && <ComparisonView />}
        {currentView === 'shopping-list' && <ShoppingListView />}
        {currentView === 'supermarkets' && <SupermarketsView />}
        {currentView === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Product Detail Modal */}
      <ProductDetailModal />

      {/* Toasts / Notifications */}
      <ToastContainer />

      {/* Sticky Mobile Navigation Bar */}
      <MobileNav />

      {/* Comprehensive Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
