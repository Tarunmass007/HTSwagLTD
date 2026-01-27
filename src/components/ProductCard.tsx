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

  const originalPrice = product.price * 1.3;
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <>
      <div
        className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 product-card-shadow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="relative overflow-hidden aspect-square bg-gray-50 dark:bg-gray-900">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg">
              -{discountPercent}%
            </div>
          )}

          {/* Stock Badge */}
          {product.stock < 10 && product.stock > 0 && (
            <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1">
              <Zap size={12} />
              {product.stock} left
            </div>
          )}
          
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-lg">
                Out of Stock
              </div>
            </div>
          )}

          {/* Quick View Button - Appears on Hover */}
          {isHovered && product.stock > 0 && (
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
              <button
                onClick={handleQuickView}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg text-sm"
              >
                <Eye size={16} />
                Quick View
              </button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors min-h-[3rem]">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {discountPercent > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0 || showSuccess}
            className={`
              w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all text-sm
              ${showSuccess
                ? 'bg-green-600 text-white'
                : product.stock === 0
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 active:scale-95 shadow-sm hover:shadow-md'
              }
              disabled:opacity-50
            `}
          >
            {showSuccess ? (
              <>
                <Check size={16} />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </>
            )}
          </button>

          {/* Trust Indicators */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Free Shipping</span>
            </div>
            {product.stock > 0 && (
              <span className="text-green-600 dark:text-green-400 font-medium">In Stock</span>
            )}
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