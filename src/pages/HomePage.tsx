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
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)`,
            backgroundSize: '10px 10px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <span className="bg-red-600 text-white px-6 py-2 rounded-full font-black text-sm uppercase tracking-wide">
                {t('freeShipping')}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-black dark:text-white mb-6 uppercase tracking-tight leading-none">
              {t('heroTitle1')}<br />
              <span className="text-red-600">{t('heroTitle2')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto font-medium">
              {t('heroSubtitle')}
              <span className="font-bold text-black dark:text-white"> {t('heroSubtitle2')}</span>
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <button
                onClick={() => onNavigate('products')}
                className="bg-black dark:bg-red-600 text-white px-10 py-4 rounded-lg text-lg font-black hover:bg-red-600 dark:hover:bg-red-700 transition-all transform hover:scale-105 uppercase tracking-wide shadow-lg flex items-center justify-center gap-2"
              >
                {t('shopNow')}
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => onNavigate('gift-cards')}
                className="bg-white dark:bg-gray-800 text-black dark:text-white border-4 border-black dark:border-white px-10 py-4 rounded-lg text-lg font-black hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all uppercase tracking-wide shadow-lg"
              >
                {t('giftCards')}
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400 font-bold">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-500" size={20} fill="currentColor" />
                <span>{t('fiveStarReviews')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="text-blue-600" size={20} />
                <span>{t('premiumQuality')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="text-green-600" size={20} />
                <span>{t('fastShipping')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="bg-black dark:bg-gray-950 text-white py-8 border-y-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-red-600 rounded-full p-4 mb-3">
                <ShoppingBag size={32} />
              </div>
              <h3 className="text-xl font-black uppercase mb-2">{t('thousandsOfDesigns')}</h3>
              <p className="text-gray-300 font-medium">{t('thousandsOfDesignsDesc')}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-red-600 rounded-full p-4 mb-3">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-black uppercase mb-2">{t('customOrders')}</h3>
              <p className="text-gray-300 font-medium">{t('customOrdersDesc')}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-red-600 rounded-full p-4 mb-3">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-xl font-black uppercase mb-2">{t('fastTurnaround')}</h3>
              <p className="text-gray-300 font-medium">{t('fastTurnaroundDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-4 uppercase tracking-tight">
              {t('shopByCategory')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
              {t('findWhatYouLooking')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div 
              onClick={() => onNavigate('products')}
              className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-4 border-black dark:border-gray-700 overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-2 font-black text-sm uppercase rounded-bl-xl">
                Hot
              </div>
              <div className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="text-white" size={40} />
                </div>
                <h3 className="text-2xl font-black text-black dark:text-white mb-3 uppercase">
                  {t('premiumMerchandise')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
                  {t('merchandiseDesc')}
                </p>
                <button className="text-red-600 dark:text-red-500 font-black uppercase flex items-center gap-2 group-hover:gap-4 transition-all">
                  {t('shopNow')}
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>

            <div 
              onClick={() => onNavigate('gift-cards')}
              className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-4 border-black dark:border-gray-700 overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-2 font-black text-sm uppercase rounded-bl-xl">
                Popular
              </div>
              <div className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Gift className="text-white" size={40} />
                </div>
                <h3 className="text-2xl font-black text-black dark:text-white mb-3 uppercase">
                  {t('giftCards')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
                  {t('merchandiseDesc')}
                </p>
                <button className="text-green-600 dark:text-green-500 font-black uppercase flex items-center gap-2 group-hover:gap-4 transition-all">
                  {t('buyNow')}
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>

            <div 
              onClick={() => onNavigate('deals')}
              className="group relative bg-gradient-to-br from-red-600 to-orange-600 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-4 border-black dark:border-gray-700 overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 bg-yellow-400 text-black px-4 py-2 font-black text-sm uppercase rounded-bl-xl">
                Sale
              </div>
              <div className="p-8">
                <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="text-white" size={40} />
                </div>
                <h3 className="text-2xl font-black text-white mb-3 uppercase">
                  {t('exclusiveDeals')}
                </h3>
                <p className="text-white/90 mb-6 font-medium">
                  {t('dealsDesc')}
                </p>
                <button className="text-white font-black uppercase flex items-center gap-2 group-hover:gap-4 transition-all">
                  {t('viewDeals')}
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-black via-red-600 to-black dark:from-gray-950 dark:via-red-700 dark:to-gray-950 text-white py-20 px-4 border-y-4 border-black dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight">
            {t('joinCommunity')}
          </h2>
          <p className="text-xl md:text-2xl mb-10 font-medium opacity-90">
            {t('joinDesc')} <span className="font-black text-yellow-400">50% OFF!</span>
          </p>
          <button 
            onClick={() => onNavigate('products')}
            className="bg-white text-black px-12 py-4 rounded-lg text-xl font-black hover:bg-yellow-400 hover:text-black transition-all transform hover:scale-105 uppercase tracking-wide shadow-2xl"
          >
            {t('getStartedFree')}
          </button>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-4 uppercase tracking-tight">
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
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl border-4 border-black dark:border-gray-700 text-center hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-black text-black dark:text-white mb-2 uppercase">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};