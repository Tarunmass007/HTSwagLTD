// src/pages/CategoriesPage.tsx
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-full text-sm font-bold mb-4">
            <Sparkles size={18} />
            <span>EXPLORE OUR COLLECTION</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse through our extensive collection of premium merchandise. From custom apparel to exclusive accessories, we have everything you need.
          </p>
        </div>

        <div
          onClick={() => onNavigate('products')}
          className="group relative bg-gradient-to-r from-red-600 via-orange-500 to-red-600 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer mb-12 transform hover:scale-[1.02]"
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Package size={40} className="text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              ALL PRODUCTS
            </h2>
            <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              View our complete collection of {totalItems}+ premium items
            </p>
            <button className="bg-white text-red-600 px-8 py-4 rounded-xl font-black text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
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

        <div className="mt-16 text-center bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
            Can't Find What You're Looking For?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            We offer custom design services! Contact us to create unique merchandise tailored to your needs.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Contact Us for Custom Orders
          </button>
        </div>
      </div>
    </div>
  );
};