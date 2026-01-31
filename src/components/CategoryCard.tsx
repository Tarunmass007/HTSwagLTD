// src/components/CategoryCard.tsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCategory } from '../Types/categories';

interface CategoryCardProps {
  category: ProductCategory;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-transparent transform hover:-translate-y-2"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-40 group-hover:opacity-60 transition-opacity`} />
        
        <div className="absolute top-4 right-4 w-14 h-14 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
          {category.icon}
        </div>

        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold">
          {category.itemCount} Items
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
          {category.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {category.description}
        </p>
        
        <button className="flex items-center gap-2 text-red-600 dark:text-red-500 font-bold text-sm group-hover:gap-3 transition-all">
          Shop Now
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500 rounded-2xl transition-all pointer-events-none" />
    </div>
  );
};