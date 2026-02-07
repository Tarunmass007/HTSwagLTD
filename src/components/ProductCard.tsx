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
      <div className="card-product group">
        <div className="relative overflow-hidden aspect-square bg-gray-100 dark:bg-gray-800/30">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            loading="lazy"
          />
          
          {discountPercent > 0 && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-white text-xs font-semibold">
              -{discountPercent}%
            </span>
          )}

          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold flex items-center gap-1">
              <Zap size={12} />
              {product.stock} left
            </span>
          )}
          
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <span className="px-4 py-2 rounded-store bg-[rgb(var(--color-foreground))] text-[rgb(var(--color-background))] text-sm font-semibold">
                Out of Stock
              </span>
            </div>
          )}

          {product.stock > 0 && (
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={handleQuickView}
                className="w-full min-h-[44px] bg-white hover:bg-gray-50 dark:hover:bg-gray-800/50 text-[rgb(var(--color-foreground))] font-semibold py-2.5 px-4 rounded-store flex items-center justify-center gap-2 text-sm"
              >
                <Eye size={16} />
                Quick View
              </button>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-display text-base font-semibold text-[rgb(var(--color-foreground))] mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-[rgb(var(--color-foreground))]">
              {formatPrice(product.price)}
            </span>
            {discountPercent > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0 || showSuccess}
            className={`
              w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-store font-semibold text-sm transition-all
              ${showSuccess
                ? 'bg-emerald-600 text-white'
                : product.stock === 0
                ? 'bg-gray-200 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'btn-store-primary'
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

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Free Shipping
            </span>
            {product.stock > 0 && (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">In Stock</span>
            )}
          </div>
        </div>
      </div>

      {showQuickView && (
        <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
};
