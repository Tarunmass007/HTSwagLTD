// src/pages/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Plus, Edit, Trash2, Save, X, Upload, Search, Filter, Download, Package, Megaphone, ShoppingBag, XCircle, LogOut } from 'lucide-react';

const ADMIN_EMAIL = 'tarunmass932007@gmail.com';

interface Broadcast {
  id: string;
  message: string;
  active: boolean;
  created_at: string;
}

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  featured: boolean;
  created_at?: string;
}

interface AdminOrder {
  id: string;
  user_id: string;
  total_amount: number;
  currency: string;
  status: string;
  shipping_stage?: string;
  created_at: string;
  shipping_address?: { email?: string; firstName?: string; lastName?: string } | null;
}

export const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'broadcast'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category: 'tops',
    stock: 0,
    featured: false
  });

  const categories = [
    { value: 'tops', label: 'Tops & T-Shirts' },
    { value: 'hoodies', label: 'Hoodies & Sweatshirts' },
    { value: 'bottoms', label: 'Bottoms' },
    { value: 'headwear', label: 'Hats & Caps' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'drinkware', label: 'Drinkware' },
    { value: 'stickers', label: 'Stickers & Decals' },
    { value: 'gift-cards', label: 'Gift Cards' }
  ];

  const getAdminSession = async () => {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error || !session) return null;
    if (session.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) return null;
    return session;
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      if (session.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        navigate('/');
        return;
      }
      fetchProducts();
      fetchOrders();
      fetchBroadcasts();
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, filterCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data);
      setFilteredProducts(data);
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    const session = await getAdminSession();
    if (!session) return;

    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/api/admin-orders`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const json = await res.json();
      if (res.ok && json.orders) {
        setOrders(json.orders);
      } else {
        setOrdersError(json.error || 'Failed to load orders');
      }
    } catch (err) {
      setOrdersError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, shipping_stage?: string) => {
    const session = await getAdminSession();
    if (!session) {
      alert('❌ Session expired. Please sign in again.');
      navigate('/login');
      return;
    }

    const apiBase = import.meta.env.VITE_API_URL || '';
    const res = await fetch(`${apiBase}/api/admin-update-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ orderId, status, shipping_stage }),
    });
    const json = await res.json();
    if (res.ok) {
      alert('✅ Order updated! Changes will reflect for the user.');
      fetchOrders();
    } else {
      alert('❌ ' + (json.error || 'Failed to update'));
    }
  };

  const fetchBroadcasts = async () => {
    const { data, error } = await supabase
      .from('broadcasts')
      .select('id, message, active, created_at')
      .order('created_at', { ascending: false });
    if (!error && data) setBroadcasts(data as Broadcast[]);
  };

  const sendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    const { error } = await supabase.from('broadcasts').insert({
      message: broadcastMessage.trim(),
      active: true,
    });
    if (!error) {
      alert('✅ Broadcast sent! All users will see it.');
      setBroadcastMessage('');
      fetchBroadcasts();
    } else {
      alert('❌ ' + error.message);
    }
  };

  const cancelBroadcast = async (id: string) => {
    if (!confirm('Cancel this broadcast? It will stop showing for all users.')) return;
    const session = await getAdminSession();
    if (!session) {
      alert('❌ Session expired. Please sign in again.');
      navigate('/login');
      return;
    }
    const apiBase = import.meta.env.VITE_API_URL || '';
    const res = await fetch(`${apiBase}/api/admin-cancel-broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ id }),
    });
    const json = await res.json();
    if (res.ok) {
      alert('✅ Broadcast cancelled.');
      fetchBroadcasts();
    } else {
      if (res.status === 401) {
        alert('❌ Session expired. Please sign in again.');
        navigate('/login');
      } else {
        alert('❌ ' + (json.error || 'Failed to cancel'));
      }
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('products')
      .insert([formData])
      .select();

    if (!error && data) {
      setProducts([...data, ...products]);
      setShowAddForm(false);
      resetForm();
      alert('✅ Product added successfully!');
    } else {
      alert('❌ Error: ' + error?.message);
    }
  };

  const handleUpdate = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const { error } = await supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: product.image_url,
        category: product.category,
        stock: product.stock,
        featured: product.featured
      })
      .eq('id', id);

    if (!error) {
      setEditingId(null);
      alert('✅ Product updated successfully!');
      fetchProducts();
    } else {
      alert('❌ Error: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('⚠️ Are you sure you want to delete this product? This action cannot be undone.')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (!error) {
      setProducts(products.filter(p => p.id !== id));
      alert('✅ Product deleted successfully!');
    } else {
      alert('❌ Error: ' + error.message);
    }
  };

  const updateProduct = (id: string, field: string, value: any) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      image_url: '',
      category: 'tops',
      stock: 0,
      featured: false
    });
  };

  // Quick add 50+ sample products
  const addAllSampleProducts = async () => {
    if (!confirm('This will add 50+ sample products. Continue?')) return;

    const sampleProducts: Product[] = [
      // TOPS & T-SHIRTS
      { name: 'Classic Cotton Tee - Black', description: 'Premium 100% cotton t-shirt in classic black. Soft, breathable, and perfect for everyday wear.', price: 29.99, image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', category: 'tops', stock: 150, featured: true },
      { name: 'Vintage Graphic Tee', description: 'Retro-inspired graphic t-shirt with distressed print.', price: 34.99, image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500', category: 'tops', stock: 120, featured: false },
      { name: 'Premium V-Neck Tee', description: 'Elegant v-neck t-shirt in premium fabric.', price: 32.99, image_url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500', category: 'tops', stock: 100, featured: false },
      { name: 'Athletic Performance Tee', description: 'Moisture-wicking performance tee perfect for workouts.', price: 39.99, image_url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500', category: 'tops', stock: 80, featured: true },
      { name: 'Striped Polo Shirt', description: 'Classic striped polo shirt with collar.', price: 44.99, image_url: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500', category: 'tops', stock: 90, featured: false },
      { name: 'Long Sleeve Henley', description: 'Comfortable long sleeve henley with button placket.', price: 42.99, image_url: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=500', category: 'tops', stock: 70, featured: false },
      { name: 'Pocket Tee - Navy', description: 'Classic pocket t-shirt in navy blue.', price: 31.99, image_url: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=500', category: 'tops', stock: 110, featured: false },
      { name: 'Raglan Baseball Tee', description: 'Sporty raglan sleeve baseball tee.', price: 36.99, image_url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500', category: 'tops', stock: 95, featured: false },
      { name: 'Premium Tank Top', description: 'Lightweight tank top perfect for summer.', price: 24.99, image_url: 'https://images.unsplash.com/photo-1618333452239-5ad6f2b6c2a2?w=500', category: 'tops', stock: 130, featured: false },
      { name: 'Designer Logo Tee', description: 'Premium designer t-shirt with embroidered logo.', price: 49.99, image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500', category: 'tops', stock: 60, featured: true },

      // HOODIES
      { name: 'Classic Pullover Hoodie', description: 'Cozy fleece pullover hoodie with kangaroo pocket.', price: 59.99, image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', category: 'hoodies', stock: 85, featured: true },
      { name: 'Zip-Up Hoodie - Grey', description: 'Full zip hoodie with side pockets.', price: 64.99, image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500', category: 'hoodies', stock: 75, featured: false },
      { name: 'Oversized Hoodie', description: 'Trendy oversized hoodie with dropped shoulders.', price: 69.99, image_url: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500', category: 'hoodies', stock: 65, featured: true },
      { name: 'Tech Fleece Hoodie', description: 'Premium tech fleece hoodie with modern fit.', price: 89.99, image_url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500', category: 'hoodies', stock: 50, featured: false },
      { name: 'Crew Neck Sweatshirt', description: 'Classic crew neck sweatshirt in premium cotton blend.', price: 49.99, image_url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500', category: 'hoodies', stock: 90, featured: false },
      { name: 'Graphic Print Hoodie', description: 'Bold graphic print hoodie with unique artwork.', price: 72.99, image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', category: 'hoodies', stock: 55, featured: false },
      { name: 'Quarter Zip Sweatshirt', description: 'Sporty quarter zip sweatshirt.', price: 54.99, image_url: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=500', category: 'hoodies', stock: 70, featured: false },
      { name: 'Premium Cashmere Hoodie', description: 'Luxury cashmere blend hoodie.', price: 129.99, image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', category: 'hoodies', stock: 35, featured: true },

      // BOTTOMS
      { name: 'Classic Joggers', description: 'Comfortable cotton joggers with elastic waistband.', price: 44.99, image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500', category: 'bottoms', stock: 100, featured: true },
      { name: 'Athletic Shorts', description: 'Lightweight athletic shorts with moisture-wicking fabric.', price: 34.99, image_url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500', category: 'bottoms', stock: 120, featured: false },
      { name: 'Cargo Pants - Olive', description: 'Utility cargo pants with multiple pockets.', price: 64.99, image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500', category: 'bottoms', stock: 70, featured: false },
      { name: 'Sweatpants - Grey', description: 'Classic sweatpants with drawstring waist.', price: 42.99, image_url: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500', category: 'bottoms', stock: 95, featured: false },
      { name: 'Track Pants', description: 'Sporty track pants with side stripes.', price: 52.99, image_url: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=500', category: 'bottoms', stock: 80, featured: false },
      { name: 'Denim Jeans - Blue', description: 'Classic fit denim jeans.', price: 69.99, image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', category: 'bottoms', stock: 85, featured: true },

      // HEADWEAR
      { name: 'Baseball Cap - Black', description: 'Classic baseball cap with embroidered logo.', price: 24.99, image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500', category: 'headwear', stock: 150, featured: true },
      { name: 'Snapback Hat', description: 'Trendy snapback hat with flat brim.', price: 29.99, image_url: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=500', category: 'headwear', stock: 120, featured: false },
      { name: 'Beanie - Cuffed', description: 'Warm knit beanie with fold-up cuff.', price: 19.99, image_url: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500', category: 'headwear', stock: 200, featured: false },
      { name: 'Dad Hat - Pastel', description: 'Soft dad hat in pastel colors.', price: 26.99, image_url: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500', category: 'headwear', stock: 130, featured: false },
      { name: 'Bucket Hat', description: 'Stylish bucket hat for sun protection.', price: 32.99, image_url: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500', category: 'headwear', stock: 90, featured: true },
      { name: 'Trucker Cap', description: 'Classic mesh trucker cap.', price: 22.99, image_url: 'https://images.unsplash.com/photo-1533087346097-e4977c0a1d48?w=500', category: 'headwear', stock: 110, featured: false },

      // ACCESSORIES
      { name: 'Canvas Tote Bag', description: 'Durable canvas tote bag.', price: 19.99, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', category: 'accessories', stock: 180, featured: true },
      { name: 'Leather Belt - Brown', description: 'Genuine leather belt with metal buckle.', price: 39.99, image_url: 'https://images.unsplash.com/photo-1624222247344-550fb60583c2?w=500', category: 'accessories', stock: 100, featured: false },
      { name: 'Athletic Socks 3-Pack', description: 'Cushioned athletic socks with arch support.', price: 16.99, image_url: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=500', category: 'accessories', stock: 250, featured: false },
      { name: 'Backpack - Black', description: 'Spacious backpack with multiple compartments.', price: 54.99, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', category: 'accessories', stock: 90, featured: true },
      { name: 'Sunglasses - Polarized', description: 'Stylish polarized sunglasses with UV protection.', price: 59.99, image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500', category: 'accessories', stock: 95, featured: true },

      // DRINKWARE
      { name: 'Stainless Steel Water Bottle', description: 'Insulated water bottle keeps drinks cold for 24hrs.', price: 29.99, image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', category: 'drinkware', stock: 140, featured: true },
      { name: 'Travel Coffee Mug', description: 'Leak-proof travel mug with handle.', price: 24.99, image_url: 'https://images.unsplash.com/photo-1517256673644-36ad11246d21?w=500', category: 'drinkware', stock: 120, featured: false },
      { name: 'Classic Ceramic Mug', description: 'Premium ceramic mug with custom logo.', price: 14.99, image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500', category: 'drinkware', stock: 200, featured: false },
      { name: 'Tumbler with Straw', description: '20oz tumbler with reusable straw and lid.', price: 27.99, image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', category: 'drinkware', stock: 150, featured: true },

      // STICKERS
      { name: 'Logo Sticker Pack', description: 'Waterproof vinyl sticker pack. Set of 10.', price: 9.99, image_url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500', category: 'stickers', stock: 500, featured: true },
      { name: 'Laptop Decal - Custom', description: 'Premium vinyl laptop decal.', price: 12.99, image_url: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=500', category: 'stickers', stock: 400, featured: false },
      { name: 'Car Window Decal', description: 'Durable outdoor vinyl car decal.', price: 14.99, image_url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500', category: 'stickers', stock: 350, featured: false },
      { name: 'Holographic Sticker Set', description: 'Eye-catching holographic stickers.', price: 15.99, image_url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500', category: 'stickers', stock: 300, featured: true },

      // GIFT CARDS
      { name: 'Gift Card - $25', description: 'Digital gift card worth $25.', price: 25.00, image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500', category: 'gift-cards', stock: 9999, featured: false },
      { name: 'Gift Card - $50', description: 'Digital gift card worth $50.', price: 50.00, image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500', category: 'gift-cards', stock: 9999, featured: true },
      { name: 'Gift Card - $100', description: 'Digital gift card worth $100.', price: 100.00, image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500', category: 'gift-cards', stock: 9999, featured: false },
      { name: 'Gift Card - $150', description: 'Premium digital gift card worth $150.', price: 150.00, image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500', category: 'gift-cards', stock: 9999, featured: false },
      { name: 'Gift Card - $200', description: 'Ultimate digital gift card worth $200.', price: 200.00, image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500', category: 'gift-cards', stock: 9999, featured: true }
    ];

    const { data, error } = await supabase
      .from('products')
      .insert(sampleProducts)
      .select();

    if (!error && data) {
      setProducts([...data, ...products]);
      alert(`✅ Successfully added ${data.length} sample products!`);
      fetchProducts();
    } else {
      alert('❌ Error: ' + error?.message);
    }
  };

  const exportProducts = () => {
    const csv = [
      ['Name', 'Description', 'Price', 'Category', 'Stock', 'Image URL', 'Featured'],
      ...products.map(p => [
        p.name,
        p.description,
        p.price,
        p.category,
        p.stock,
        p.image_url,
        p.featured
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-${new Date().toISOString()}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
              🛠️ Admin Panel
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage products, orders & broadcasts
            </p>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut({ scope: 'local' });
              navigate('/', { replace: true });
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
          >
            <LogOut size={18} />
            Sign out
          </button>
          {activeTab === 'products' && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={exportProducts}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"
              >
                <Download size={20} />
                Export CSV
              </button>
              <button
                onClick={addAllSampleProducts}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"
              >
                <Upload size={20} />
                Add 50+ Products
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"
              >
                <Plus size={20} />
                Add Product
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'products' as const, label: 'Products', icon: Package },
            { id: 'orders' as const, label: 'Orders', icon: ShoppingBag },
            { id: 'broadcast' as const, label: 'Broadcast', icon: Megaphone },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                if (id === 'orders') fetchOrders();
              }}
              className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Broadcast Tab */}
        {activeTab === 'broadcast' && (
          <div className="space-y-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Send Broadcast</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Your message will appear as a flowing banner at the top of the site for all users.
              </p>
              <form onSubmit={sendBroadcast} className="flex gap-3">
                <input
                  type="text"
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Enter broadcast message..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  maxLength={200}
                />
                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold">
                  Send Broadcast
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Broadcasts</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Cancel a broadcast to stop it from showing for all users.</p>
              </div>
              <div className="overflow-x-auto">
                {broadcasts.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">No broadcasts yet.</div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-bold">Message</th>
                        <th className="px-4 py-3 text-left text-sm font-bold">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-bold">Sent</th>
                        <th className="px-4 py-3 text-right text-sm font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {broadcasts.map((b) => (
                        <tr key={b.id} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="px-4 py-3 text-sm max-w-md truncate">{b.message}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${b.active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-400'}`}>
                              {b.active ? 'Active' : 'Cancelled'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{new Date(b.created_at).toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">
                            {b.active && (
                              <button
                                onClick={() => cancelBroadcast(b.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                              >
                                <XCircle size={16} />
                                Cancel Broadcast
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Orders</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Updates will reflect instantly for users in their Orders page. Run <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 rounded">SUPABASE_SETUP.sql</code> if shipping updates fail.</p>
              </div>
              <button
                onClick={fetchOrders}
                disabled={ordersLoading}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-medium text-sm disabled:opacity-50"
              >
                {ordersLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
            {ordersError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
                {ordersError}
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-bold">Order ID</th>
                    <th className="px-4 py-4 text-left text-sm font-bold">Customer</th>
                    <th className="px-4 py-4 text-left text-sm font-bold">Total</th>
                    <th className="px-4 py-4 text-left text-sm font-bold">Status</th>
                    <th className="px-4 py-4 text-left text-sm font-bold">Shipping</th>
                    <th className="px-4 py-4 text-right text-sm font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersLoading && orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                        Loading orders...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No orders yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="border-t border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-3 font-mono text-sm">#{order.id.slice(0, 8)}</td>
                        <td className="px-4 py-3 text-sm">
                          {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                          {order.shipping_address?.email && (
                            <span className="block text-gray-500 text-xs">{order.shipping_address.email}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-semibold">${order.total_amount}</td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value, order.shipping_stage)}
                            className="text-sm border border-[var(--border-subtle)] rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-[rgb(var(--color-foreground))]"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={order.shipping_stage || 'ordered'}
                            onChange={(e) => updateOrderStatus(order.id, order.status, e.target.value)}
                            className="text-sm border border-[var(--border-subtle)] rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-[rgb(var(--color-foreground))]"
                          >
                            <option value="ordered">Ordered</option>
                            <option value="preparing">Preparing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
        <>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="text-3xl font-black text-gray-900 dark:text-white">{products.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Products</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="text-3xl font-black text-gray-900 dark:text-white">
              {products.reduce((sum, p) => sum + p.stock, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Stock</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-yellow-500">
            <div className="text-3xl font-black text-gray-900 dark:text-white">
              {products.filter(p => p.featured).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Featured Items</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-red-500">
            <div className="text-3xl font-black text-gray-900 dark:text-white">
              ${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Inventory Value</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 border-2 border-red-500 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">➕ Add New Product</h2>
              <button 
                onClick={() => {setShowAddForm(false); resetForm();}} 
                className="text-gray-600 hover:text-gray-900 dark:hover:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border
                  -gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., Classic Cotton Tee"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  placeholder="29.99"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  rows={3}
                  placeholder="Describe your product..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">Stock *</label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  placeholder="100"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="w-5 h-5 text-red-600 focus:ring-red-500"
                />
                <label className="text-sm font-bold text-gray-900 dark:text-white">Mark as Featured Product</label>
              </div>
              <div className="md:col-span-2 flex gap-3 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-black text-lg shadow-lg"
                >
                  ✅ Add Product
                </button>
                <button
                  type="button"
                  onClick={() => {setShowAddForm(false); resetForm();}}
                  className="px-8 bg-gray-300 hover:bg-gray-400 text-gray-900 py-3 rounded-xl font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-black text-gray-900 dark:text-white">Image</th>
                  <th className="px-4 py-4 text-left text-sm font-black text-gray-900 dark:text-white">Name</th>
                  <th className="px-4 py-4 text-left text-sm font-black text-gray-900 dark:text-white">Category</th>
                  <th className="px-4 py-4 text-left text-sm font-black text-gray-900 dark:text-white">Price</th>
                  <th className="px-4 py-4 text-left text-sm font-black text-gray-900 dark:text-white">Stock</th>
                  <th className="px-4 py-4 text-left text-sm font-black text-gray-900 dark:text-white">Featured</th>
                  <th className="px-4 py-4 text-right text-sm font-black text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No products found. Add some products to get started!
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-4 py-3">
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-16 h-16 object-cover rounded-lg shadow" 
                        />
                      </td>
                      <td className="px-4 py-3">
                        {editingId === product.id ? (
                          <input
                            type="text"
                            value={product.name}
                            onChange={(e) => updateProduct(product.id!, 'name', e.target.value)}
                            className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                          />
                        ) : (
                          <div className="font-bold text-gray-900 dark:text-white max-w-xs truncate">{product.name}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingId === product.id ? (
                          <select
                            value={product.category}
                            onChange={(e) => updateProduct(product.id!, 'category', e.target.value)}
                            className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                          >
                            {categories.map(cat => (
                              <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-sm bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full font-medium">
                            {product.category}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingId === product.id ? (
                          <input
                            type="number"
                            step="0.01"
                            value={product.price}
                            onChange={(e) => updateProduct(product.id!, 'price', parseFloat(e.target.value))}
                            className="w-24 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                          />
                        ) : (
                          <span className="font-black text-red-600">${product.price}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingId === product.id ? (
                          <input
                            type="number"
                            value={product.stock}
                            onChange={(e) => updateProduct(product.id!, 'stock', parseInt(e.target.value))}
                            className="w-20 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                          />
                        ) : (
                          <span className="text-gray-900 dark:text-white">{product.stock}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={product.featured}
                          onChange={(e) => {
                            updateProduct(product.id!, 'featured', e.target.checked);
                            if (editingId !== product.id) handleUpdate(product.id!);
                          }}
                          className="w-5 h-5 text-red-600"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {editingId === product.id ? (
                            <>
                              <button
                                onClick={() => handleUpdate(product.id!)}
                                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow"
                                title="Save"
                              >
                                <Save size={18} />
                              </button>
                              <button
                                onClick={() => {setEditingId(null); fetchProducts();}}
                                className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 shadow"
                                title="Cancel"
                              >
                                <X size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditingId(product.id!)}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id!)}
                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};