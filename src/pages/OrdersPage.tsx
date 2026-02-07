import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrencyLanguage } from '../context/CurrencyLanguageContext';
import { supabase } from '../lib/supabase';
import { Package, ArrowRight, ShoppingBag } from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string; image_url: string } | null;
}

interface Order {
  id: string;
  total_amount: number;
  currency: string;
  status: string;
  created_at: string;
  order_items?: OrderItem[];
}

interface OrdersPageProps {
  onNavigate: (page: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate }) => {
  const { isAuthenticated } = useCart();
  const { formatPrice } = useCurrencyLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          currency,
          status,
          created_at,
          order_items (
            id,
            quantity,
            price,
            product (name, image_url)
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data as Order[]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [isAuthenticated]);

  const formatOrderId = (id: string) => {
    if (!id) return '—';
    return `#${id.replace(/-/g, '').toUpperCase().slice(0, 8)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-green-600 dark:text-green-400';
      case 'processing': return 'text-blue-600 dark:text-blue-400';
      case 'cancelled': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-16">
        <div className="section-store max-w-xl mx-auto">
          <div className="text-center rounded-store-xl shadow-store p-12 border border-[var(--border-subtle)] bg-white dark:bg-gray-900/20">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={40} className="text-gray-400" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-[rgb(var(--color-foreground))] mb-3">Sign in to view orders</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Please log in to see your order history</p>
            <button
              onClick={() => onNavigate('login')}
              className="btn-store-primary inline-flex items-center gap-2 px-8 py-3.5"
            >
              Sign in
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="section-store max-w-xl mx-auto">
          <div className="text-center rounded-store-xl shadow-store p-12 border border-[var(--border-subtle)] bg-white dark:bg-gray-900/20">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={40} className="text-gray-400" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-[rgb(var(--color-foreground))] mb-3">No orders yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Start shopping to see your orders here</p>
            <button
              onClick={() => onNavigate('products')}
              className="btn-store-primary inline-flex items-center gap-2 px-8 py-3.5"
            >
              <ShoppingBag size={20} />
              Shop now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="section-store max-w-3xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-[rgb(var(--color-foreground))] mb-8">Your orders</h1>
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-store p-6 border border-[var(--border-subtle)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <p className="font-semibold text-[rgb(var(--color-foreground))]">{formatOrderId(order.id)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-medium capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-lg">{formatPrice(order.total_amount)}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.order_items?.length || 0} item(s)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
