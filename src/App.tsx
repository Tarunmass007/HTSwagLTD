import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeProvider';
import { CurrencyLanguageProvider } from './context/CurrencyLanguageContext';
import { Header } from './components/Header';
import { NewsletterPopup } from './components/NewsletterPopup';
import { HomePage } from './pages/HomePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ProductsPage } from './pages/ProductsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { Footer } from './components/footer';
import { AdminPanel } from './pages/adminpanel';

type Page = 'home' | 'categories' | 'products' | 'cart' | 'checkout' | 'terms' | 'privacy' | 'tracking' | 'admin' | 'gift-cards' | 'deals';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewsletter, setShowNewsletter] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNewsletter(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleCloseNewsletter = () => {
    setShowNewsletter(false);
  };

  const handleNavigate = (page: string, category?: string) => {
    setCurrentPage(page as Page);
    setSelectedCategory(category);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (currentPage === 'home' || currentPage === 'categories') {
      setCurrentPage('products');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage searchQuery={searchQuery} onNavigate={handleNavigate} />;
      case 'categories':
        return <CategoriesPage onNavigate={handleNavigate} />;
      case 'products':
        return <ProductsPage searchQuery={searchQuery} category={selectedCategory} />;
      case 'gift-cards':
        return <ProductsPage searchQuery={searchQuery} category="gift-cards" />;
      case 'deals':
        return <ProductsPage searchQuery={searchQuery} category="deals" />;
      case 'cart':
        return <CartPage onNavigate={handleNavigate} />;
      case 'checkout':
        return <CheckoutPage onNavigate={handleNavigate} />;
      case 'terms':
        return <TermsPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'tracking':
        return <TrackingPage />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <HomePage searchQuery={searchQuery} onNavigate={handleNavigate} />;
    }
  };

  return (
    <ThemeProvider>
      <CurrencyLanguageProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Header onNavigate={handleNavigate} onSearch={handleSearch} />
            <main>{renderPage()}</main>
            
            <Footer 
              onNavigate={handleNavigate} 
              onShowNewsletter={() => setShowNewsletter(true)} 
            />

            {showNewsletter && <NewsletterPopup onClose={handleCloseNewsletter} />}
          </div>
        </CartProvider>
      </CurrencyLanguageProvider>
    </ThemeProvider>
  );
}

const TermsPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 space-y-6 border border-gray-200 dark:border-gray-700">
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          By accessing and using HTS Swag, you accept and agree to be bound by the terms and provision of this agreement.
        </p>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">2. Products and Services</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          All products are subject to availability. We reserve the right to discontinue any product at any time. 
          Prices are subject to change without notice.
        </p>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">3. Orders and Payment</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          All orders are subject to acceptance and availability. Payment must be received in full before dispatch. 
          We accept major credit cards and approved payment methods.
        </p>
      </section>
    </div>
  </div>
);

const PrivacyPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 space-y-6 border border-gray-200 dark:border-gray-700">
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Information We Collect</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          We collect information you provide directly to us, including name, email address, shipping address, 
          and payment information when you make a purchase.
        </p>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">How We Use Your Information</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          We use your information to process orders, communicate with you, and improve our services. 
          We do not sell your personal information to third parties.
        </p>
      </section>
    </div>
  </div>
);

const TrackingPage = () => {
  const [orderId, setOrderId] = useState('');
  const [tracking, setTracking] = useState<any>(null);
  
  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setTracking({
      orderId: orderId,
      status: 'In Transit',
      estimatedDelivery: '3-5 business days',
      lastUpdate: new Date().toLocaleDateString()
    });
  };
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">Track Your Order</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleTrack} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Order ID
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your order ID"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
          >
            Track Order
          </button>
        </form>
        
        {tracking && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Order ID:</span>
              <span className="text-sm text-gray-900 dark:text-white font-semibold">{tracking.orderId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
              <span className="text-sm text-green-700 dark:text-green-400 font-semibold">{tracking.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Delivery:</span>
              <span className="text-sm text-gray-900 dark:text-white">{tracking.estimatedDelivery}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;