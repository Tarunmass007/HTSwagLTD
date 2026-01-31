import React, { useEffect, useState } from 'react';
import { supabase, Product, isSupabaseConfigured } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';
import { Package, Grid, List, Filter, AlertTriangle } from 'lucide-react';
import { productCategories } from '../Types/categories';

interface ProductsPageProps {
  searchQuery?: string;
  category?: string;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ searchQuery = '', category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'name'>('newest');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Filter by category (use DB category slug, e.g. 'gift-cards', 'tops')
    if (category && category !== 'all') {
      if (category === 'deals') {
        filtered = filtered.filter((p) => p.featured === true);
      } else {
        filtered = filtered.filter((p) => p.category === category);
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredProducts(filtered);
  }, [searchQuery, category, products, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured) {
        setError('Store is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env');
        setProducts([]);
        setFilteredProducts([]);
        return;
      }
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message || 'Failed to load products');
        setProducts([]);
        setFilteredProducts([]);
        return;
      }
      setProducts(data ?? []);
      setFilteredProducts(data ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load products';
      setError(message);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = () => {
    if (!category || category === 'all') return 'All Products';
    const categoryData = productCategories.find(cat => cat.id === category);
    return categoryData?.name || 'Products';
  };

  const getCategoryDescription = () => {
    if (!category || category === 'all') return 'Browse our complete collection';
    const categoryData = productCategories.find(cat => cat.id === category);
    return categoryData?.description || '';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-96 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-8 text-center">
          <AlertTriangle size={48} className="text-amber-600 dark:text-amber-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Unable to load products</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">Home</span>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">{getCategoryName()}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {searchQuery ? `Search: "${searchQuery}"` : getCategoryName()}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery
                  ? `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
                  : getCategoryDescription()
                }
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <Filter className="text-gray-500 dark:text-gray-400" size={18} />
              <span className="text-gray-900 dark:text-white font-semibold">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Grid view">
                <Grid size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="List view">
                <List size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={48} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No products found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {searchQuery
                ? 'Try adjusting your search terms or browse all products'
                : 'Check back soon for new items in this category'
              }
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Browse All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Bottom Banner */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 rounded-xl p-8 md:p-12 text-center text-white shadow-lg">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Love What You See?</h3>
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
              Get 15% off your first order when you sign up for our newsletter!
            </p>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              Subscribe Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};