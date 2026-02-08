import React from 'react';
import { ArrowRight, Shirt, Layers, Package, Award, ShoppingBag, Coffee, Sparkles, Gift, LucideIcon } from 'lucide-react';
import { ProductCategory } from '../Types/categories';

const ICON_MAP: Record<string, LucideIcon> = {
  Shirt, Layers, Package, Award, ShoppingBag, Coffee, Sparkles, Gift,
};

interface CategoryCardProps {
  category: ProductCategory;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  const IconComponent = ICON_MAP[category.icon] || Package;
  return (
    <div
      onClick={onClick}
      className="group card-product overflow-hidden cursor-pointer"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity`} />
        
        <div className="absolute top-4 right-4 w-12 h-12 rounded-store bg-white/95 dark:bg-gray-900/95 flex items-center justify-center shadow-store">
          <IconComponent size={24} className="text-[rgb(var(--color-foreground))]" />
        </div>

        <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-semibold">
          {category.itemCount} Items
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-[rgb(var(--color-foreground))] mb-2 group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {category.description}
        </p>
        
        <span className="inline-flex items-center gap-2 font-semibold text-primary text-sm group-hover:gap-3 transition-all">
          Shop Now
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
};
