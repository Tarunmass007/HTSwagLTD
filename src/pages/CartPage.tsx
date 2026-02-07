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
      <div className="min-h-[60vh] flex items-center justify-center py-16">
        <div className="section-store max-w-xl">
          <div className="text-center p-12 rounded-store-xl border border-[var(--border-subtle)] bg-white dark:bg-gray-900/20 shadow-store">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-gray-400" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-[rgb(var(--color-foreground))] mb-3">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Looks like you haven&apos;t added anything to your cart yet. Start shopping to fill it up!
            </p>
            <button
              onClick={() => onNavigate('products')}
              className="btn-store-primary inline-flex items-center gap-2 px-8 py-3.5"
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
    <div className="min-h-screen py-8 md:py-12">
      <div className="section-store">
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-[rgb(var(--color-foreground))] mb-1">Shopping Cart</h1>
          <p className="text-gray-600 dark:text-gray-400">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {remainingForFreeShipping > 0 && (
              <div className="rounded-store-lg p-4 border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
                <div className="flex items-center gap-3 mb-2">
                  <Truck className="text-emerald-600 dark:text-emerald-400" size={20} />
                  <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                    Add {formatPrice(remainingForFreeShipping)} more for free shipping!
                  </span>
                </div>
                <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-full h-1.5">
                  <div
                    className="bg-emerald-600 dark:bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
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
                  className="rounded-store-lg p-5 md:p-6 border border-[var(--border-subtle)] bg-white dark:bg-gray-900/20 shadow-store hover:shadow-store-md transition-shadow"
                >
                  <div className="flex gap-5 md:gap-6">
                    <div className="relative flex-shrink-0">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-store border border-[var(--border-subtle)]"
                      />
                      {product.stock < 10 && product.stock > 0 && (
                        <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full bg-amber-500 text-white text-xs font-semibold">
                          Only {product.stock} left
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="font-display text-lg font-semibold text-[rgb(var(--color-foreground))] mb-1 hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                            {product.description}
                          </p>
                          <p className="font-bold text-[rgb(var(--color-foreground))]">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-store transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-4">
                        <div className="flex items-center border border-[var(--border-strong)] rounded-store overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus size={16} className="text-gray-600 dark:text-gray-400" />
                          </button>
                          <span className="px-4 py-2 font-semibold text-[rgb(var(--color-foreground))] min-w-[3rem] text-center border-x border-[var(--border-subtle)]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= product.stock}
                            className="p-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus size={16} className="text-gray-600 dark:text-gray-400" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Subtotal</p>
                          <p className="font-bold text-[rgb(var(--color-foreground))]">
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
            <div className="rounded-store-lg p-6 border border-[var(--border-subtle)] bg-white dark:bg-gray-900/20 shadow-store sticky top-24">
              <h2 className="font-display text-xl font-semibold text-[rgb(var(--color-foreground))] mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[rgb(var(--color-foreground))]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="font-semibold text-[rgb(var(--color-foreground))]">
                    {shipping === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span className="font-semibold text-[rgb(var(--color-foreground))]">{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-[var(--border-subtle)] pt-4 flex justify-between">
                  <span className="font-display text-lg font-semibold text-[rgb(var(--color-foreground))]">Total</span>
                  <span className="text-xl font-bold text-[rgb(var(--color-foreground))]">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('checkout')}
                className="btn-store-primary w-full py-3.5 mb-3 flex items-center justify-center gap-2"
              >
                <Lock size={18} />
                Proceed to Checkout
              </button>

              <button
                onClick={() => onNavigate('products')}
                className="btn-store-secondary w-full py-3"
              >
                Continue Shopping
              </button>

              <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-store bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                    <Truck size={16} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-[rgb(var(--color-foreground))] text-sm">Free Shipping</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-store bg-gray-200 dark:bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                    <Shield size={16} className="text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-[rgb(var(--color-foreground))] text-sm">Secure Checkout</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">256-bit SSL encryption</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-store bg-gray-200 dark:bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                    <RefreshCw size={16} className="text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-[rgb(var(--color-foreground))] text-sm">Easy Returns</p>
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
