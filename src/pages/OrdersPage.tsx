import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrencyLanguage } from '../context/CurrencyLanguageContext';
import { supabase } from '../lib/supabase';
import { Package, ArrowRight, ShoppingBag, ChevronLeft, XCircle, CheckCircle, Truck, CreditCard } from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  products?: { name: string; image_url: string } | null;
  product?: { name: string; image_url: string } | null;
}

interface Order {
  id: string;
  total_amount: number;
  currency: string;
  status: string;
  shipping_stage?: string;
  created_at: string;
  shipping_address?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  } | null;
  payment_info?: {
    cardLast4?: string;
    cardBrand?: string;
    subtotal?: number;
    shipping?: number;
    tax?: number;
  } | null;
  order_items?: OrderItem[];
}

interface OrdersPageProps {
  onNavigate: (page: string) => void;
  selectedOrderId?: string | null;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate }) => {
  const { orderId: urlOrderId } = useParams<{ orderId?: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useCart();
  const { formatPrice } = useCurrencyLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(urlOrderId || null);

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
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          currency,
          status,
          shipping_stage,
          created_at,
          shipping_address,
          payment_info,
          order_items (
            id,
            quantity,
            price,
            product:products(name, image_url)
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data as Order[]);
        if (urlOrderId && data.some((o: Order) => o.id === urlOrderId)) {
          setSelectedOrderId(urlOrderId);
        }
      }
    } catch (err) {
      console.error('Orders fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedOrderId(urlOrderId || null);
  }, [urlOrderId]);

  useEffect(() => {
    fetchOrders();
  }, [isAuthenticated, urlOrderId]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  const formatOrderId = (id: string) => {
    if (!id) return '—';
    return `#${id.replace(/-/g, '').toUpperCase().slice(0, 8)}`;
  };

  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'completed') return { label: 'Completed', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', Icon: CheckCircle };
    if (s === 'processing') return { label: 'Processing', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', Icon: Truck };
    if (s === 'cancelled') return { label: 'Canceled', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', Icon: XCircle };
    if (s === 'refunded') return { label: 'Refunded', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', Icon: XCircle };
    return { label: 'Pending', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-800/50', Icon: Package };
  };

  const SHIPPING_STAGES = [
    { key: 'ordered', label: 'Order Placed', icon: Package },
    { key: 'preparing', label: 'Preparing', icon: Truck },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const getShippingProgress = (order: Order) => {
    const stage = order.shipping_stage || 'ordered';
    const idx = SHIPPING_STAGES.findIndex((s) => s.key === stage);
    const currentIdx = idx >= 0 ? idx : 0;
    const filledSegments = currentIdx + 1;
    const percent = (filledSegments / SHIPPING_STAGES.length) * 100;
    if (order.status === 'cancelled' || order.status === 'refunded') return { percent: 0, currentIdx: -1, filledSegments: 0 };
    return { percent, currentIdx, filledSegments };
  };

  const getOrderItemProduct = (item: OrderItem) => item.product || item.products || null;

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
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-[rgb(var(--color-foreground))] mb-3">No orders found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">You haven&apos;t placed any orders yet. Start shopping to see your orders here.</p>
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

  // Detail view for a single order (Selkie-style)
  const selectedOrder = selectedOrderId ? orders.find((o) => o.id === selectedOrderId) : null;
  if (selectedOrder) {
    const statusCfg = getStatusConfig(selectedOrder.status);
    const addr = selectedOrder.shipping_address;
    const pay = selectedOrder.payment_info;
    const subtotal = pay?.subtotal ?? selectedOrder.total_amount;
    const shipping = pay?.shipping ?? 0;
    const tax = pay?.tax ?? 0;

    return (
      <div className="min-h-screen py-16 bg-gray-50 dark:bg-gray-950">
        <div className="section-store max-w-3xl mx-auto">
          <button
            onClick={() => { setSelectedOrderId(null); navigate('/orders'); }}
            className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[rgb(var(--color-foreground))] transition-colors"
          >
            <ChevronLeft size={20} />
            Back to orders
          </button>

          <div className="mb-6">
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-[rgb(var(--color-foreground))]">
              Order {formatOrderId(selectedOrder.id)}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Confirmed {new Date(selectedOrder.created_at).toLocaleDateString()}
            </p>
          </div>

          {(selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'refunded') && (
            <div className="mb-6 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-[var(--border-subtle)] shadow-store">
              <h3 className="font-semibold text-[rgb(var(--color-foreground))] mb-4">Shipping progress</h3>
              <div className="flex items-center justify-between gap-2 mb-3">
                {SHIPPING_STAGES.map((s, i) => (
                  <span
                    key={s.key}
                    className={`text-xs font-medium flex items-center gap-1 ${
                      i <= getShippingProgress(selectedOrder).currentIdx
                        ? 'text-primary'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    <s.icon size={14} />
                    {s.label}
                  </span>
                ))}
              </div>
              {/* Segmented progress bar: fills one segment at a time */}
              <div className="flex gap-0.5 rounded-full overflow-hidden h-2.5 bg-gray-200 dark:bg-gray-700">
                {SHIPPING_STAGES.map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-full rounded-sm transition-all duration-500 ease-out"
                    style={{
                      backgroundColor: i < getShippingProgress(selectedOrder).filledSegments
                        ? 'rgb(var(--color-accent))'
                        : 'transparent',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status card */}
            <div className={`rounded-2xl p-6 border ${statusCfg.bg} border-[var(--border-subtle)]`}>
              <div className="flex items-center gap-3 mb-2">
                <statusCfg.Icon size={28} className={statusCfg.color} />
                <span className={`font-bold text-lg ${statusCfg.color}`}>{statusCfg.label}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedOrder.status === 'processing' && 'Your order is being prepared for shipment.'}
                {selectedOrder.status === 'completed' && 'Your order has been delivered.'}
                {selectedOrder.status === 'cancelled' && 'Your order has been canceled.'}
                {selectedOrder.status === 'refunded' && 'You received a full refund for this order.'}
                {selectedOrder.status === 'pending' && 'Your order is awaiting processing.'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {new Date(selectedOrder.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Order summary receipt */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-[var(--border-subtle)] shadow-store">
              <h3 className="font-semibold text-[rgb(var(--color-foreground))] mb-4">Order summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Tax</span><span>{formatPrice(tax)}</span></div>
                <div className="flex justify-between font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-[rgb(var(--color-foreground))]">Total</span>
                  <span>{formatPrice(selectedOrder.total_amount)} {selectedOrder.currency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order items with images */}
          <div className="mt-6 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-[var(--border-subtle)] shadow-store">
            <h3 className="font-semibold text-[rgb(var(--color-foreground))] mb-4">Items</h3>
            <div className="space-y-4">
              {selectedOrder.order_items?.map((item) => {
                const product = getOrderItemProduct(item);
                return (
                  <div key={item.id} className="flex gap-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                      {product?.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Package size={24} className="text-gray-400" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[rgb(var(--color-foreground))]">{product?.name || 'Product'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                    <div className="font-semibold text-right">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact & Payment */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {addr && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-[var(--border-subtle)] shadow-store">
                <h3 className="font-semibold text-[rgb(var(--color-foreground))] mb-3">Contact & Shipping</h3>
                {addr.email && <p className="text-sm text-gray-600 dark:text-gray-400">{addr.email}</p>}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {addr.firstName} {addr.lastName}<br />
                  {addr.address}<br />
                  {addr.city}, {addr.state} {addr.zipCode}<br />
                  {addr.country}
                </p>
              </div>
            )}
            {pay && (pay.cardLast4 || pay.cardBrand) && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-[var(--border-subtle)] shadow-store">
                <h3 className="font-semibold text-[rgb(var(--color-foreground))] mb-3 flex items-center gap-2">
                  <CreditCard size={18} />
                  Payment
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {pay.cardBrand || 'Card'} •••• {pay.cardLast4}
                </p>
                <p className="text-sm font-medium mt-2">{formatPrice(selectedOrder.total_amount)} {selectedOrder.currency}</p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={() => onNavigate('products')}
              className="btn-store-primary inline-flex items-center gap-2 px-6 py-3"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Orders list view
  return (
    <div className="min-h-screen py-16 bg-gray-50 dark:bg-gray-950">
      <div className="section-store max-w-3xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-[rgb(var(--color-foreground))] mb-8">Your orders</h1>
        <div className="space-y-4">
          {orders.map((order) => {
            const statusCfg = getStatusConfig(order.status);
            const itemCount = order.order_items?.length ?? 0;

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-store border border-[var(--border-subtle)] overflow-hidden"
              >
                <button
                  onClick={() => { setSelectedOrderId(order.id); navigate(`/orders/${order.id}`); }}
                  className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusCfg.bg}`}>
                        <statusCfg.Icon size={24} className={statusCfg.color} />
                      </div>
                      <div>
                        <p className="font-semibold text-[rgb(var(--color-foreground))]">{formatOrderId(order.id)}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Confirmed {new Date(order.created_at).toLocaleDateString()} · {itemCount} item{itemCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-medium capitalize ${statusCfg.color}`}>{statusCfg.label}</span>
                      <span className="font-bold text-lg">{formatPrice(order.total_amount)}</span>
                      <ArrowRight size={20} className="text-gray-400" />
                    </div>
                  </div>
                  {(order.status !== 'cancelled' && order.status !== 'refunded') && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        {SHIPPING_STAGES.map((s, i) => (
                          <span
                            key={s.key}
                            className={`text-xs font-medium flex items-center gap-1 ${
                              i <= getShippingProgress(order).currentIdx
                                ? 'text-primary'
                                : 'text-gray-400 dark:text-gray-500'
                            }`}
                          >
                            <s.icon size={12} />
                            {s.label}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-0.5 rounded-full overflow-hidden h-1.5 bg-gray-200 dark:bg-gray-700">
                        {SHIPPING_STAGES.map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 h-full rounded-sm transition-all duration-500 ease-out"
                            style={{
                              backgroundColor: i < getShippingProgress(order).filledSegments
                                ? 'rgb(var(--color-accent))'
                                : 'transparent',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
