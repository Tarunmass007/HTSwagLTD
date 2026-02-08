import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, ChevronDown, Moon, Sun, Menu, X, Home, Package, Gift, Flame, Grid, ShoppingBag } from 'lucide-react';
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

  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const currMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setShowUserMenu(false);
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) setShowLanguageMenu(false);
      if (currMenuRef.current && !currMenuRef.current.contains(event.target as Node)) setShowCurrencyMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowUserMenu(false);
    await supabase.auth.signOut({ scope: 'local' });
    navigate('/', { replace: true });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const openAuth = (mode: 'login' | 'signup') => {
    setShowUserMenu(false);
    onNavigate(mode === 'signup' ? 'signup' : 'login');
  };

  return (
    <>
      {/* Announcement bar - fixed dark for visibility in both themes */}
      <div className="bg-[rgb(var(--footer-bg))] text-[rgb(var(--footer-text))] py-2.5 px-4">
        <div className="section-store flex items-center justify-between text-xs md:text-sm">
          <div className="flex items-center gap-6">
            <span className="hidden md:inline text-[rgb(var(--footer-text))]">Free shipping on orders over $50</span>
            <span className="hidden md:inline text-[rgb(var(--footer-text-muted))]">support@htswag.com</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => { setShowLanguageMenu(!showLanguageMenu); setShowCurrencyMenu(false); }}
                className="flex items-center gap-1.5 text-[rgb(var(--footer-text))] hover:text-white transition-colors"
              >
                <span>{language.flag}</span>
                <span className="hidden sm:inline">{language.code.toUpperCase()}</span>
                <ChevronDown size={14} />
              </button>
              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[rgb(var(--color-background))] border border-[var(--border-subtle)] rounded-store shadow-store-lg py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang); setShowLanguageMenu(false); }}
                      className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 ${
                        language.code === lang.code ? 'font-semibold' : 'text-gray-600 dark:text-gray-400'
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
                onClick={() => { setShowCurrencyMenu(!showCurrencyMenu); setShowLanguageMenu(false); }}
                className="flex items-center gap-1.5 text-[rgb(var(--footer-text))] hover:text-white transition-colors"
              >
                <span>{currency.symbol}</span>
                <span className="hidden sm:inline">{currency.code}</span>
                <ChevronDown size={14} />
              </button>
              {showCurrencyMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[rgb(var(--color-background))] border border-[var(--border-subtle)] rounded-store shadow-store-lg py-2 z-50">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => { setCurrency(curr); setShowCurrencyMenu(false); }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-black/5 dark:hover:bg-white/5 ${
                        currency.code === curr.code ? 'font-semibold' : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {curr.code} ({curr.symbol}) — {curr.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 bg-[rgb(var(--color-background))]/95 backdrop-blur-md border-b border-[var(--border-subtle)]">
        <div className="section-store py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-store text-[rgb(var(--color-foreground))] hover:bg-black/5 dark:hover:bg-white/5"
            >
              {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="flex-shrink-0 text-left"
            >
              <h1 className="font-display text-xl md:text-2xl font-bold text-[rgb(var(--color-foreground))] tracking-tight">
                HTS <span className="text-primary">SWAG</span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block">Premium Merchandise & Gift Cards</p>
            </button>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden lg:block flex-1 max-w-md mx-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-store pl-11 py-2.5 text-sm"
                />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-store text-gray-600 dark:text-gray-400 hover:text-[rgb(var(--color-foreground))] hover:bg-black/5 dark:hover:bg-white/5"
                title="Toggle theme"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2.5 rounded-store text-gray-600 dark:text-gray-400 hover:text-[rgb(var(--color-foreground))] hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <User size={20} />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-[rgb(var(--color-background))] border border-[var(--border-subtle)] rounded-store shadow-store-lg py-2 z-50">
                    {isAuthenticated ? (
                      <>
                        <button
                          onClick={() => { onNavigate('orders'); setShowUserMenu(false); }}
                          className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2"
                        >
                          <ShoppingBag size={16} />
                          Your orders
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          Sign out
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => openAuth('login')} className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5">
                          Sign in
                        </button>
                        <button onClick={() => openAuth('signup')} className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5">
                          Create account
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => onNavigate('cart')}
                className="relative p-2.5 rounded-store text-gray-600 dark:text-gray-400 hover:text-[rgb(var(--color-foreground))] hover:bg-black/5 dark:hover:bg-white/5"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="lg:hidden mt-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-store pl-11"
              />
            </form>
          </div>
        </div>

        {/* Nav */}
        <nav className="border-t border-[var(--border-subtle)] bg-[rgb(var(--color-background))]/50">
          <div className="section-store">
            <div className="hidden lg:flex items-center justify-center gap-1 py-3">
              {[
                { page: 'home' as const, label: 'Home', icon: Home },
                { page: 'categories' as const, label: 'Categories', icon: Package },
                { page: 'products' as const, label: 'All Products', icon: Grid },
                { page: 'products', category: 'gift-cards', label: 'Gift Cards', icon: Gift },
                { page: 'products', category: 'deals', label: 'Deals', icon: Flame },
                { page: 'orders' as const, label: 'Your orders', icon: ShoppingBag },
              ].map(({ page, category, label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => onNavigate(page, category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-store text-sm font-medium transition-colors ${
                    page === 'products' && category === 'deals'
                      ? 'text-primary hover:bg-primary/10'
                      : 'text-gray-600 dark:text-gray-400 hover:text-[rgb(var(--color-foreground))] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-[var(--border-subtle)] bg-[rgb(var(--color-background))]">
            <div className="section-store py-4 space-y-1">
              {[
                { page: 'home', label: 'Home', icon: Home },
                { page: 'categories', label: 'Categories', icon: Package },
                { page: 'products', label: 'All Products', icon: Grid },
                { page: 'products', category: 'gift-cards', label: 'Gift Cards', icon: Gift },
                { page: 'products', category: 'deals', label: 'Deals', icon: Flame },
                { page: 'orders', label: 'Your orders', icon: ShoppingBag },
              ].map(({ page, category, label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => { onNavigate(page, category); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-store font-medium hover:bg-black/5 dark:hover:bg-white/5 text-left"
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
