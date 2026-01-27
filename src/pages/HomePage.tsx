import React from 'react';
import { Gift, ShoppingBag, Sparkles, ArrowRight, Star, TrendingUp, Award, Zap } from 'lucide-react';
import { useCurrencyLanguage } from '../context/CurrencyLanguageContext';

interface HomePageProps {
  searchQuery?: string;
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t } = useCurrencyLanguage();

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <span className="bg-red-600 text-white px-4 py-1.5 rounded-full font-semibold text-xs uppercase tracking-wide shadow-lg">
                {t('freeShipping')}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
              {t('heroTitle1')}<br />
              <span className="text-red-600 dark:text-red-500">{t('heroTitle2')}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto font-medium">
              {t('heroSubtitle')}
              <span className="font-semibold text-gray-900 dark:text-white"> {t('heroSubtitle2')}</span>
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
              <button
                onClick={() => onNavigate('products')}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {t('shopNow')}
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => onNavigate('gift-cards')}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md"
              >
                {t('giftCards')}
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-500" size={18} fill="currentColor" />
                <span className="font-semibold">{t('fiveStarReviews')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="text-blue-600 dark:text-blue-400" size={18} />
                <span className="font-semibold">{t('premiumQuality')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="text-green-600 dark:text-green-400" size={18} />
                <span className="font-semibold">{t('fastShipping')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="bg-gray-900 dark:bg-gray-950 text-white py-12 border-y border-gray-800 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-red-600 rounded-xl p-4 mb-4 shadow-lg">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-lg font-bold mb-2">{t('thousandsOfDesigns')}</h3>
              <p className="text-gray-400 text-sm">{t('thousandsOfDesignsDesc')}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-red-600 rounded-xl p-4 mb-4 shadow-lg">
                <Sparkles size={28} />
              </div>
              <h3 className="text-lg font-bold mb-2">{t('customOrders')}</h3>
              <p className="text-gray-400 text-sm">{t('customOrdersDesc')}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-red-600 rounded-xl p-4 mb-4 shadow-lg">
                <TrendingUp size={28} />
              </div>
              <h3 className="text-lg font-bold mb-2">{t('fastTurnaround')}</h3>
              <p className="text-gray-400 text-sm">{t('fastTurnaroundDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 md:py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              {t('shopByCategory')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('findWhatYouLooking')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div 
              onClick={() => onNavigate('products')}
              className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
            >
              <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 font-semibold text-xs rounded-lg shadow-lg z-10">
                Hot
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('premiumMerchandise')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">
                  {t('merchandiseDesc')}
                </p>
                <button className="text-red-600 dark:text-red-500 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  {t('shopNow')}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div 
              onClick={() => onNavigate('gift-cards')}
              className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
            >
              <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 font-semibold text-xs rounded-lg shadow-lg z-10">
                Popular
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Gift className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('giftCards')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">
                  {t('merchandiseDesc')}
                </p>
                <button className="text-green-600 dark:text-green-500 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  {t('buyNow')}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div 
              onClick={() => onNavigate('deals')}
              className="group relative bg-gradient-to-br from-red-600 to-orange-600 rounded-xl shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 border border-red-700 overflow-hidden cursor-pointer"
            >
              <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 font-semibold text-xs rounded-lg shadow-lg z-10">
                Sale
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {t('exclusiveDeals')}
                </h3>
                <p className="text-white/90 mb-4 text-sm line-clamp-2">
                  {t('dealsDesc')}
                </p>
                <button className="text-white font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  {t('viewDeals')}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-white py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            {t('joinCommunity')}
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            {t('joinDesc')} <span className="font-bold text-yellow-400">50% OFF!</span>
          </p>
          <button 
            onClick={() => onNavigate('products')}
            className="bg-white text-gray-900 px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {t('getStartedFree')}
          </button>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              {t('whyChooseUs')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎨', title: t('customDesigns'), desc: t('customDesignsDesc') },
              { icon: '⚡', title: t('fastShipping'), desc: t('fastShippingDesc') },
              { icon: '💯', title: t('qualityGuaranteed'), desc: t('qualityDesc') },
              { icon: '💬', title: t('support247'), desc: t('supportDesc') }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg transition-all">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};