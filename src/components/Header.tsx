// src/components/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, User, ChevronDown, Moon, Sun, Menu, X, Home, Package, Gift, Flame, Grid } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeProvider';
import { useCurrencyLanguage, languages, currencies } from '../context/CurrencyLanguageContext';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  onNavigate: (page: string, category?: string) => void;
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onSearch }) => {
  const { cartCount, isAuthenticated } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, currency, setCurrency } = useCurrencyLanguage();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const currMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
      if (currMenuRef.current && !currMenuRef.current.contains(event.target as Node)) {
        setShowCurrencyMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Account created! Please check your email to verify.');
        setAuthMode('login');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setShowAuthModal(false);
        setEmail('');
        setPassword('');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <>
      {/* Top Bar - Black with white text */}
      <div className="bg-black text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs md:text-sm">
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">📧 support@htswag.com</span>
            <span className="hidden md:inline">📞 1-800-921-0183</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => {
                  setShowLanguageMenu(!showLanguageMenu);
                  setShowCurrencyMenu(false);
                }}
                className="flex items-center gap-1 hover:text-gray-300 transition-colors"
              >
                <span>{language.flag}</span>
                <span className="hidden sm:inline">{language.code.toUpperCase()}</span>
                <ChevronDown size={14} />
              </button>
              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang);
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 ${
                        language.code === lang.code ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-medium' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={currMenuRef}>
              <button
                onClick={() => {
                  setShowCurrencyMenu(!showCurrencyMenu);
                  setShowLanguageMenu(false);
                }}
                className="flex items-center gap-1 hover:text-gray-300 transition-colors"
              >
                <span>{currency.symbol}</span>
                <span className="hidden sm:inline">{currency.code}</span>
                <ChevronDown size={14} />
              </button>
              {showCurrencyMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 z-50">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr);
                        setShowCurrencyMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        currency.code === curr.code ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-medium' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {curr.code} ({curr.symbol}) - {curr.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Light background */}
      <header className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate('home')}>
              <h1
                className="text-2xl md:text-4xl font-black text-black dark:text-white hover:opacity-80 transition-opacity tracking-tight"
                style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
              >
                HTS <span className="text-red-600">SWAG</span>
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Premium Merchandise & Gift Cards</p>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:block flex-1 max-w-xl mx-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Search size={20} />
                </button>
              </form>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2.5 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Toggle theme"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2.5 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <User size={22} />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-2 z-50">
                    {isAuthenticated ? (
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Log out
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setAuthMode('login');
                            setShowAuthModal(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Log in
                        </button>
                        <button
                          onClick={() => {
                            setAuthMode('signup');
                            setShowAuthModal(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Create account
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => onNavigate('cart')}
                className="relative p-2.5 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="lg:hidden mt-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-black dark:text-white"
              >
                <Search size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="hidden lg:flex items-center justify-center gap-8 py-4">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors uppercase tracking-wide"
              >
                <Home size={18} />
                Home
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => onNavigate('categories')}
                className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors uppercase tracking-wide"
              >
                <Package size={18} />
                Shop by Category
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => onNavigate('products')}
                className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors uppercase tracking-wide"
              >
                <Grid size={18} />
                All Products
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => onNavigate('products', 'gift-cards')}
                className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors uppercase tracking-wide"
              >
                <Gift size={18} />
                Gift Cards
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => onNavigate('products', 'deals')}
                className="flex items-center gap-2 text-sm font-black text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-all uppercase tracking-wide"
              >
                <Flame size={18} />
                Hot Deals
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-4 space-y-2">
              <button
                onClick={() => { onNavigate('home'); setShowMobileMenu(false); }}
                className="w-full text-left px-4 py-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-bold uppercase tracking-wide flex items-center gap-2"
              >
                <Home size={18} />
                Home
              </button>
              <button
                onClick={() => { onNavigate('categories'); setShowMobileMenu(false); }}
                className="w-full text-left px-4 py-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-bold uppercase tracking-wide flex items-center gap-2"
              >
                <Package size={18} />
                Shop by Category
              </button>
              <button
                onClick={() => { onNavigate('products'); setShowMobileMenu(false); }}
                className="w-full text-left px-4 py-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-bold uppercase tracking-wide flex items-center gap-2"
              >
                <Grid size={18} />
                All Products
              </button>
              <button
                onClick={() => { onNavigate('products', 'gift-cards'); setShowMobileMenu(false); }}
                className="w-full text-left px-4 py-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-bold uppercase tracking-wide flex items-center gap-2"
              >
                <Gift size={18} />
                Gift Cards
              </button>
              <button
                onClick={() => { onNavigate('products', 'deals'); setShowMobileMenu(false); }}
                className="w-full text-left px-4 py-3 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-black uppercase tracking-wide flex items-center gap-2"
              >
                <Flame size={18} />
                Hot Deals
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-tight">
                {authMode === 'login' ? 'Welcome Back!' : 'Join Us!'}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2 uppercase">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2 uppercase">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 dark:bg-red-600 text-white font-black py-3 rounded-xl hover:bg-red-700 dark:hover:bg-red-700 transition-all disabled:opacity-50 uppercase tracking-wide text-lg shadow-lg"
              >
                {loading ? 'Loading...' : authMode === 'login' ? 'Log In' : 'Sign Up'}
              </button>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="text-red-600 dark:text-red-500 font-bold hover:underline"
                >
                  {authMode === 'login' ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
};