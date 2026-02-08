import React, { useState, useEffect, useCallback } from 'react';
import { Gift, ShoppingBag, Sparkles, ArrowRight, Star, TrendingUp, Award, Zap, ChevronLeft, ChevronRight, Truck, Lock, DollarSign, MessageCircle, Palette, BadgeCheck } from 'lucide-react';
import { useCurrencyLanguage } from '../context/CurrencyLanguageContext';
import { testimonialsData } from '../data/testimonials';

interface HomePageProps {
  searchQuery?: string;
  onNavigate: (page: string) => void;
}

const AUTO_SLIDE_INTERVAL_MS = 4500;

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t } = useCurrencyLanguage();
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const goNext = useCallback(() => {
    setTestimonialIndex((prev) => (prev + 1) % testimonialsData.length);
  }, []);

  const goPrev = useCallback(() => {
    setTestimonialIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(goNext, AUTO_SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [goNext]);

  return (
    <div className="bg-[rgb(var(--color-background))]">
      {/* Trust badges - Cartzilla style */}
      <section className="border-b border-[var(--border-subtle)] bg-gray-50 dark:bg-gray-900/50 py-4">
        <div className="section-store">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Truck, title: 'Free Shipping & Returns', desc: 'For all orders over $50' },
              { icon: Lock, title: 'Secure Payment', desc: 'We ensure secure payment' },
              { icon: DollarSign, title: 'Money Back Guarantee', desc: 'Returning money 30 days' },
              { icon: MessageCircle, title: '24/7 Customer Support', desc: 'Friendly customer support' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-store-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Icon size={22} className="text-primary" />
                </div>
                <h3 className="font-semibold text-[rgb(var(--color-foreground))] text-sm">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="relative py-12 md:py-20 px-4 overflow-hidden">
        <div className="section-store max-w-store relative z-10">
          {/* Testimonials carousel */}
          <div className="mb-12 md:mb-16">
            <p className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
              What customers received
            </p>
            <div className="relative flex items-center justify-center gap-2 md:gap-4">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous"
                className="absolute left-0 z-20 p-2.5 rounded-full bg-white dark:bg-gray-900/50 shadow-store border border-[var(--border-subtle)] text-[rgb(var(--color-foreground))] hover:bg-black/5 dark:hover:bg-white/5 transition-colors -translate-x-1 md:translate-x-0"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="overflow-hidden w-full max-w-2xl mx-2 md:mx-4 rounded-store-lg border border-[var(--border-subtle)] shadow-store bg-white dark:bg-gray-900/30">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${testimonialIndex * 100}%)` }}
                >
                  {testimonialsData.map((item) => (
                    <div key={item.id} className="w-full flex-shrink-0 flex flex-col items-center p-6 md:p-8">
                      <div className="w-full aspect-square max-h-56 md:max-h-72 rounded-store overflow-hidden bg-gray-100 dark:bg-gray-800/50">
                        <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                      </div>
                      <p className="mt-4 font-semibold text-[rgb(var(--color-foreground))]">{item.productName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-1">&ldquo;{item.quote}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next"
                className="absolute right-0 z-20 p-2.5 rounded-full bg-white dark:bg-gray-900/50 shadow-store border border-[var(--border-subtle)] text-[rgb(var(--color-foreground))] hover:bg-black/5 dark:hover:bg-white/5 transition-colors translate-x-1 md:translate-x-0"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            <div className="flex justify-center gap-1.5 mt-4">
              {testimonialsData.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTestimonialIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === testimonialIndex ? 'w-6 bg-primary' : 'w-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide mb-6">
              {t('freeShipping')}
            </span>
            
            <h1 className="font-display text-store-hero font-semibold text-[rgb(var(--color-foreground))] mb-6 leading-tight">
              {t('heroTitle1')}<br />
              <span className="text-primary">{t('heroTitle2')}</span>
            </h1>
            
            <p className="text-store-subtitle text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              {t('heroSubtitle')}
              <span className="font-semibold text-[rgb(var(--color-foreground))]"> {t('heroSubtitle2')}</span>
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
              <button
                onClick={() => onNavigate('products')}
                className="btn-store-primary px-8 py-3.5 flex items-center justify-center gap-2"
              >
                {t('shopNow')}
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => onNavigate('gift-cards')}
                className="btn-store-secondary px-8 py-3.5 flex items-center justify-center gap-2"
              >
                {t('giftCards')}
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Star className="text-amber-500" size={18} fill="currentColor" />
                <span className="font-medium">{t('fiveStarReviews')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="text-gray-600 dark:text-gray-400" size={18} />
                <span className="font-medium">{t('premiumQuality')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="text-emerald-600 dark:text-emerald-400" size={18} />
                <span className="font-medium">{t('fastShipping')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features banner */}
      <section className="bg-[rgb(var(--color-foreground))] text-[rgb(var(--color-background))] py-14 border-y border-white/10">
        <div className="section-store">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              { icon: ShoppingBag, title: t('thousandsOfDesigns'), desc: t('thousandsOfDesignsDesc') },
              { icon: Sparkles, title: t('customOrders'), desc: t('customOrdersDesc') },
              { icon: TrendingUp, title: t('fastTurnaround'), desc: t('fastTurnaroundDesc') },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-store-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Icon size={26} className="text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{title}</h3>
                <p className="text-white/70 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-20">
        <div className="section-store">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-[rgb(var(--color-foreground))] mb-3">
              {t('shopByCategory')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{t('findWhatYouLooking')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div
              onClick={() => onNavigate('products')}
              className="group relative card-product p-6 cursor-pointer"
            >
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold">
                Hot
              </span>
              <div className="w-14 h-14 rounded-store-lg bg-gray-200 dark:bg-gray-700/50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShoppingBag size={28} className="text-[rgb(var(--color-foreground))]" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[rgb(var(--color-foreground))] mb-2">
                {t('premiumMerchandise')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{t('merchandiseDesc')}</p>
              <span className="inline-flex items-center gap-2 font-semibold text-primary text-sm group-hover:gap-3 transition-all">
                {t('shopNow')}
                <ArrowRight size={16} />
              </span>
            </div>

            <div
              onClick={() => onNavigate('gift-cards')}
              className="group relative card-product p-6 cursor-pointer"
            >
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold">
                Popular
              </span>
              <div className="w-14 h-14 rounded-store-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Gift size={28} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[rgb(var(--color-foreground))] mb-2">
                {t('giftCards')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{t('merchandiseDesc')}</p>
              <span className="inline-flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400 text-sm group-hover:gap-3 transition-all">
                {t('buyNow')}
                <ArrowRight size={16} />
              </span>
            </div>

            <div
              onClick={() => onNavigate('deals')}
              className="group relative p-6 rounded-store-lg overflow-hidden bg-gradient-to-br from-primary to-primary-dark cursor-pointer shadow-store-product hover:shadow-store-product-hover transition-all"
            >
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 text-primary text-xs font-semibold">
                Sale
              </span>
              <div className="w-14 h-14 rounded-store-lg bg-white/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Sparkles size={28} className="text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-2">{t('exclusiveDeals')}</h3>
              <p className="text-white/90 text-sm mb-4 line-clamp-2">{t('dealsDesc')}</p>
              <span className="inline-flex items-center gap-2 font-semibold text-white text-sm group-hover:gap-3 transition-all">
                {t('viewDeals')}
                <ArrowRight size={16} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[rgb(var(--color-foreground))] text-[rgb(var(--color-background))] py-16 md:py-20">
        <div className="section-store text-center max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4">
            {t('joinCommunity')}
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-8">
            {t('joinDesc')} <span className="font-bold text-primary">50% OFF!</span>
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="btn-store bg-white text-[rgb(var(--color-foreground))] px-8 py-3.5 font-semibold hover:bg-white/90"
          >
            {t('getStartedFree')}
          </button>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-16 md:py-20">
        <div className="section-store">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-[rgb(var(--color-foreground))]">
              {t('whyChooseUs')}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Palette, title: t('customDesigns'), desc: t('customDesignsDesc') },
              { icon: Zap, title: t('fastShipping'), desc: t('fastShippingDesc') },
              { icon: BadgeCheck, title: t('qualityGuaranteed'), desc: t('qualityDesc') },
              { icon: MessageCircle, title: t('support247'), desc: t('supportDesc') },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-store-lg border border-[var(--border-subtle)] bg-white dark:bg-gray-900/20 text-center hover:shadow-store transition-shadow">
                <div className="w-14 h-14 rounded-store-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon size={28} className="text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-[rgb(var(--color-foreground))] mb-2">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
