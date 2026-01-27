// src/components/QuickViewModal.tsx
import React, { useState } from 'react';
import { X, ShoppingCart, Plus, Minus, Check, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import { Product } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useCurrencyLanguage } from '../context/CurrencyLanguageContext';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrencyLanguage();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product);
      }
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const originalPrice = product.price * 1.3;
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Quick View</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Product Details</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-900">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
              
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="bg-red-600 text-white text-sm font-black px-4 py-2 rounded-full shadow-lg">
                  {discountPercent}% OFF
                </div>
              </div>

              {product.stock < 10 && product.stock > 0 && (
                <div className="absolute top-4 right-4 bg-orange-500 text-white text-sm font-black px-4 py-2 rounded-full shadow-lg animate-pulse">
                  Only {product.stock} left!
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3 leading-tight">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">(127 reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-black text-red-600 dark:text-red-500">
                {formatPrice(product.price)}
              </span>
              <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold px-3 py-1 rounded-full">
                Save {formatPrice(originalPrice - product.price)}
              </span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Availability:</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={`text-sm font-bold ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="px-8 py-3 font-black text-xl text-gray-900 dark:text-white min-w-[80px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Maximum: {product.stock}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0 || showSuccess}
              className={`
                w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-lg
                ${showSuccess
                  ? 'bg-green-500 text-white'
                  : product.stock === 0
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-xl transform hover:scale-105 active:scale-95'
                }
              `}
            >
              {showSuccess ? (
                <>
                  <Check size={24} />
                  Added to Cart Successfully!
                </>
              ) : (
                <>
                  <ShoppingCart size={24} />
                  {isAdding 
                    ? 'Adding to Cart...' 
                    : product.stock === 0 
                    ? 'Out of Stock' 
                    : `Add ${quantity} to Cart - ${formatPrice(product.price * quantity)}`
                  }
                </>
              )}
            </button>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Truck size={16} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Free Shipping</p>
                  <p className="text-xs">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <RefreshCw size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">30-Day Returns</p>
                  <p className="text-xs">Easy return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Shield size={16} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Premium Quality</p>
                  <p className="text-xs">100% quality guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};