import React from 'react';
import { CategoryCard } from '../components/CategoryCard';
import { productCategories } from '../Types/categories';
import { Package, Sparkles } from 'lucide-react';

interface CategoriesPageProps {
  onNavigate: (page: string, category?: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate }) => {
  const totalItems = productCategories.reduce((sum, cat) => sum + cat.itemCount, 0);

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="section-store">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={16} />
            Explore our collection
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-semibold text-[rgb(var(--color-foreground))] mb-4">
            Shop by Category
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse through our extensive collection of premium merchandise. From custom apparel to exclusive accessories, we have everything you need.
          </p>
        </div>

        <div
          onClick={() => onNavigate('products')}
          className="group relative rounded-store-lg overflow-hidden bg-gradient-to-r from-[rgb(var(--color-foreground))] to-gray-800 mb-12 cursor-pointer shadow-store-product hover:shadow-store-product-hover transition-all"
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative p-10 md:p-14 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-store-lg bg-white/10 backdrop-blur-sm mb-6">
              <Package size={36} className="text-white" />
            </div>
            <h2 className="font-display text-2xl md:text-4xl font-semibold text-white mb-4">
              All Products
            </h2>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              View our complete collection of {totalItems}+ premium items
            </p>
            <button className="btn-store bg-white text-[rgb(var(--color-foreground))] px-8 py-3.5 font-semibold hover:bg-white/90">
              Browse All Products →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => onNavigate('products', category.id)}
            />
          ))}
        </div>

        <div className="mt-16 text-center p-10 md:p-12 rounded-store-lg border border-[var(--border-subtle)] bg-white dark:bg-gray-900/20">
          <h3 className="font-display text-2xl md:text-3xl font-semibold text-[rgb(var(--color-foreground))] mb-4">
            Can&apos;t find what you&apos;re looking for?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            We offer custom design services! Contact us to create unique merchandise tailored to your needs.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="btn-store-accent px-8 py-3.5"
          >
            Contact Us for Custom Orders
          </button>
        </div>
      </div>
    </div>
  );
};
