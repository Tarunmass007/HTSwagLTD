import React, { useState } from 'react';
import { ShoppingCart, Check, Zap, Eye } from 'lucide-react';
import { Product } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useCurrencyLanguage } from '../context/CurrencyLanguageContext';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrencyLanguage();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    try {
      await addToCart(product);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <>
      <div
        className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 overflow-hidden transform hover:-translate-y-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="relative overflow-hidden aspect-square bg-gray-100 dark:bg-gray-900">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Stock Badge */}
          {product.stock < 10 && product.stock > 0 && (
            <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-full uppercase shadow-lg flex items-center gap-1">
              <Zap size={12} />
              Only {product.stock} left
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="bg-red-600 text-white text-lg font-black px-6 py-3 rounded-xl uppercase">
                Out of Stock
              </div>
            </div>
          )}

          {/* Quick View Button - Appears on Hover */}
          {isHovered && product.stock > 0 && (
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent animate-slide-up">
              <button
                onClick={handleQuickView}
                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Eye size={18} />
                Quick View
              </button>
            </div>
          )}

          {/* Discount Badge */}
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-full">
            23% OFF
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Price and Cart Button */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500 font-bold line-through">
                {formatPrice(product.price * 1.3)}
              </span>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0 || showSuccess}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all transform text-sm
                ${showSuccess
                  ? 'bg-green-500 text-white scale-105'
                  : product.stock === 0
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 dark:bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-700 active:scale-95 hover:scale-105 shadow-lg hover:shadow-xl'
                }
                disabled:opacity-50
              `}
            >
              {showSuccess ? (
                <>
                  <Check size={18} />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  {isAdding ? 'Adding...' : 'Add'}
                </>
              )}
            </button>
          </div>

          {/* Free Shipping Badge */}
          <div className="mt-3 text-xs text-green-600 dark:text-green-500 font-bold flex items-center gap-1">
            <span>✓</span>
            Free Shipping
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal
          product={product}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
};