import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeProvider';
import { CurrencyLanguageProvider } from './context/CurrencyLanguageContext';
import { Header } from './components/Header';
import { BroadcastBanner } from './components/BroadcastBanner';
import { NewsletterPopup } from './components/NewsletterPopup';
import { HomePage } from './pages/HomePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ProductsPage } from './pages/ProductsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { Footer } from './components/footer';
import { AdminPanel } from './pages/adminpanel';
import { LoginPage } from './pages/LoginPage';
import { OrdersPage } from './pages/OrdersPage';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q') || '';
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
    const pathMap: Record<string, string> = {
      home: '/',
      categories: '/categories',
      products: '/products',
      cart: '/cart',
      checkout: '/checkout',
      terms: '/terms',
      privacy: '/privacy',
      tracking: '/tracking',
      admin: '/admin',
      login: '/login',
      signup: '/signup',
      orders: '/orders',
    };
    const categoryPaths: Record<string, string> = {
      'gift-cards': '/products/gift-cards',
      deals: '/products/deals',
    };
    if (page === 'products' && category && categoryPaths[category]) {
      navigate(categoryPaths[category]);
    } else {
      const path = pathMap[page] ?? '/';
      navigate(path);
    }
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    if (location.pathname === '/' || location.pathname === '/categories' || location.pathname.startsWith('/products')) {
      navigate(`/products${query ? `?q=${encodeURIComponent(query)}` : ''}`);
    }
  };

  return (
    <ThemeProvider>
      <CurrencyLanguageProvider>
        <CartProvider>
          <div className="min-h-screen min-h-[100dvh] bg-gray-50 dark:bg-gray-900 transition-colors duration-200 overflow-x-hidden w-full max-w-[100vw]">
            <BroadcastBanner />
            <Header onNavigate={handleNavigate} onSearch={handleSearch} />
            <main>
              <Routes>
                <Route path="/" element={<HomePage searchQuery={searchQuery} onNavigate={handleNavigate} />} />
                <Route path="/categories" element={<CategoriesPage onNavigate={handleNavigate} />} />
                <Route path="/products" element={<ProductsPage searchQuery={searchQuery} category={undefined} />} />
                <Route path="/products/gift-cards" element={<ProductsPage searchQuery={searchQuery} category="gift-cards" />} />
                <Route path="/products/deals" element={<ProductsPage searchQuery={searchQuery} category="deals" />} />
                <Route path="/cart" element={<CartPage onNavigate={handleNavigate} />} />
                <Route path="/checkout" element={<CheckoutPage onNavigate={handleNavigate} />} />
                <Route path="/orders" element={<OrdersPage onNavigate={handleNavigate} />} />
                <Route path="/orders/:orderId" element={<OrdersPage onNavigate={handleNavigate} />} />
                <Route path="/login" element={<LoginPage onNavigate={handleNavigate} initialMode="login" />} />
                <Route path="/signup" element={<LoginPage onNavigate={handleNavigate} initialMode="signup" />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/tracking" element={<TrackingPage />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="*" element={<HomePage searchQuery={searchQuery} onNavigate={handleNavigate} />} />
              </Routes>
            </main>

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
  <div className="section-store py-16 max-w-store-narrow mx-auto">
    <h1 className="font-display text-3xl md:text-4xl font-semibold text-[rgb(var(--color-foreground))] mb-8">Terms of Service</h1>
    <div className="bg-white dark:bg-gray-900/30 rounded-store-xl shadow-store p-8 space-y-6 border border-[var(--border-subtle)]">
      <section>
        <h2 className="font-display text-xl font-semibold text-[rgb(var(--color-foreground))] mb-3">1. Acceptance of Terms</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
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
  <div className="section-store py-16 max-w-store-narrow mx-auto">
    <h1 className="font-display text-3xl md:text-4xl font-semibold text-[rgb(var(--color-foreground))] mb-8">Privacy Policy</h1>
    <div className="bg-white dark:bg-gray-900/30 rounded-store-xl shadow-store p-8 space-y-6 border border-[var(--border-subtle)]">
      <section>
        <h2 className="font-display text-xl font-semibold text-[rgb(var(--color-foreground))] mb-3">Information We Collect</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
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
    <div className="section-store py-16 max-w-store-narrow mx-auto">
      <h1 className="font-display text-3xl md:text-4xl font-semibold text-[rgb(var(--color-foreground))] mb-8 text-center">Track Your Order</h1>
      <div className="bg-white dark:bg-gray-900/30 rounded-store-xl shadow-store p-8 border border-[var(--border-subtle)]">
        <form onSubmit={handleTrack} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">Order ID</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your order ID"
              required
              className="input-store"
            />
          </div>
          <button type="submit" className="btn-store-primary w-full py-3.5">
            Track Order
          </button>
        </form>

        {tracking && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-store p-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
              <span className="font-semibold">{tracking.orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">{tracking.status}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Estimated Delivery:</span>
              <span>{tracking.estimatedDelivery}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
