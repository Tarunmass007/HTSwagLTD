import React from 'react';
import { useCart } from '../context/CartContext';
import { useCurrencyLanguage } from '../context/CurrencyLanguageContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Lock, Truck, Shield, RefreshCw } from 'lucide-react';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { formatPrice } = useCurrencyLanguage();

  const subtotal = cart.reduce((sum, item) => {
    const product = item.product;
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const freeShippingThreshold = 50;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 border border-gray-200 dark:border-gray-700">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={48} className="text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <button
              onClick={() => onNavigate('products')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Continue Shopping
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Shopping Cart</h1>
          <p className="text-gray-600 dark:text-gray-400">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {/* Free Shipping Progress */}
            {remainingForFreeShipping > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-2">
                  <Truck className="text-blue-600 dark:text-blue-400" size={20} />
                  <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                    Add {formatPrice(remainingForFreeShipping)} more for free shipping!
                  </span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                  <div 
                    className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {cart.map((item) => {
              const product = item.product;
              if (!product) return null;

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
                >
                  <div className="flex gap-6">
                    <div className="relative flex-shrink-0">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                      {product.stock < 10 && product.stock > 0 && (
                        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Only {product.stock} left
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 hover:text-red-600 dark:hover:text-red-500 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                            {product.description}
                          </p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          title="Remove item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} className="text-gray-600 dark:text-gray-400" />
                          </button>
                          <span className="px-4 py-2 font-semibold text-gray-900 dark:text-white min-w-[3rem] text-center border-x border-gray-300 dark:border-gray-600">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= product.stock}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus size={16} className="text-gray-600 dark:text-gray-400" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Subtotal</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatPrice(product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-24 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {shipping === 0 ? (
                      <span className="text-green-600 dark:text-green-400">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('checkout')}
                className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] mb-3 flex items-center justify-center gap-2"
              >
                <Lock size={18} />
                Proceed to Checkout
              </button>

              <button
                onClick={() => onNavigate('products')}
                className="w-full py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-all"
              >
                Continue Shopping
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck size={16} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Free Shipping</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">On orders over {formatPrice(50)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Secure Checkout</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">256-bit SSL encryption</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <RefreshCw size={16} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Easy Returns</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
