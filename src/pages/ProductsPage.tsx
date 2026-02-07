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
    if (category && category !== 'all') {
      if (category === 'deals') {
        filtered = filtered.filter((p) => p.featured === true);
      } else {
        filtered = filtered.filter((p) => p.category === category);
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
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
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    setFilteredProducts(filtered);
  }, [searchQuery, category, products, sortBy]);

  const isDeployed = typeof window !== 'undefined' && !window.location.hostname.match(/^localhost$|^127\.0\.0\.1$/);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured) {
        const hint = isDeployed
          ? ' On Vercel: add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Project → Settings → Environment Variables, then redeploy.'
          : ' Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.';
        setError('Store is not configured.' + hint);
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
      const isNetworkError = message.toLowerCase().includes('failed to fetch') || message.toLowerCase().includes('network');
      const deployHint = isDeployed && isNetworkError
        ? ' On Vercel: add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Project → Settings → Environment Variables, then redeploy.'
        : '';
      setError(message + deployHint);
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 py-16">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-store-lg p-8 text-center">
          <AlertTriangle size={48} className="text-amber-600 dark:text-amber-400 mx-auto mb-4" aria-hidden />
          <h3 className="font-display text-xl font-semibold text-[rgb(var(--color-foreground))] mb-2">Unable to load products</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm break-words">{error}</p>
          <button onClick={fetchProducts} className="btn-store-primary">
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="section-store">
        {/* Breadcrumb & header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="hover:text-[rgb(var(--color-foreground))] transition-colors cursor-pointer">Home</span>
            <span>/</span>
            <span className="text-[rgb(var(--color-foreground))] font-medium">{getCategoryName()}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-[rgb(var(--color-foreground))] mb-1">
                {searchQuery ? `Search: "${searchQuery}"` : getCategoryName()}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {searchQuery
                  ? `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`
                  : getCategoryDescription()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="input-store py-2.5 min-h-[44px] w-auto min-w-[160px]"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-store-lg border border-[var(--border-subtle)] bg-white dark:bg-gray-900/20">
            <div className="flex items-center gap-3">
              <Filter size={18} className="text-gray-500 dark:text-gray-400" />
              <span className="font-semibold text-[rgb(var(--color-foreground))]">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
              </span>
            </div>
            <div className="flex gap-1">
              <button className="p-2.5 rounded-store hover:bg-black/5 dark:hover:bg-white/5" title="Grid view" aria-label="Grid view">
                <Grid size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2.5 rounded-store hover:bg-black/5 dark:hover:bg-white/5" title="List view" aria-label="List view">
                <List size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Products grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 rounded-store-lg border border-[var(--border-subtle)] bg-white dark:bg-gray-900/20">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mx-auto mb-6">
              <Package size={40} className="text-gray-400" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-[rgb(var(--color-foreground))] mb-3">No products found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {searchQuery ? 'Try adjusting your search terms or browse all products' : 'Check back soon for new items in this category'}
            </p>
            <button onClick={() => window.location.reload()} className="btn-store-primary">
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

        {/* Bottom CTA */}
        {filteredProducts.length > 0 && (
          <div className="mt-16 rounded-store-lg bg-[rgb(var(--color-foreground))] text-[rgb(var(--color-background))] p-8 md:p-12 text-center">
            <h3 className="font-display text-2xl md:text-3xl font-semibold mb-3">Love what you see?</h3>
            <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto">
              Get 15% off your first order when you sign up for our newsletter!
            </p>
            <button className="btn-store bg-white text-[rgb(var(--color-foreground))] px-8 py-3 font-semibold hover:bg-white/90">
              Subscribe Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
