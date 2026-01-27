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
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
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
            <div className="flex-shrink-0 cursor-pointer group" onClick={() => onNavigate('home')}>
              <h1
                className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors tracking-tight"
              >
                HTS <span className="text-red-600 dark:text-red-500">SWAG</span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Premium Merchandise & Gift Cards</p>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:block flex-1 max-w-xl mx-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-1">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Toggle theme"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <User size={20} />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-50">
                    {isAuthenticated ? (
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                          className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Log in
                        </button>
                        <button
                          onClick={() => {
                            setAuthMode('signup');
                            setShowAuthModal(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
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
        <nav className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="hidden lg:flex items-center justify-center gap-6 py-3">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700"
              >
                <Home size={16} />
                Home
              </button>
              <button
                onClick={() => onNavigate('categories')}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700"
              >
                <Package size={16} />
                Categories
              </button>
              <button
                onClick={() => onNavigate('products')}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700"
              >
                <Grid size={16} />
                All Products
              </button>
              <button
                onClick={() => onNavigate('products', 'gift-cards')}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700"
              >
                <Gift size={16} />
                Gift Cards
              </button>
              <button
                onClick={() => onNavigate('products', 'deals')}
                className="flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Flame size={16} />
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-8 border border-gray-200 dark:border-gray-700 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
              >
                {loading ? 'Loading...' : authMode === 'login' ? 'Log In' : 'Sign Up'}
              </button>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="text-gray-900 dark:text-white font-semibold hover:underline"
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