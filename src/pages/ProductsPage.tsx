import React, { useEffect, useState } from 'react';
import { supabase, Product } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';
import { Package, Grid, List, Filter } from 'lucide-react';
import { productCategories } from '../types/categories';

interface ProductsPageProps {
  searchQuery?: string;
  category?: string;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ searchQuery = '', category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'name'>('newest');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (category && category !== 'all') {
      const categoryData = productCategories.find(cat => cat.id === category);
      if (categoryData) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(categoryData.name.toLowerCase()) ||
          product.description.toLowerCase().includes(categoryData.name.toLowerCase())
        );
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
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
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <span>Home</span>
            <span>/</span>
            <span className="text-red-600 dark:text-red-500 font-bold">{getCategoryName()}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
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
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 flex items-center justify-between border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Filter className="text-gray-600 dark:text-gray-400" size={20} />
            <span className="text-gray-900 dark:text-white font-bold">
              {filteredProducts.length} Products
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Grid size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <List size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <Package size={80} className="mx-auto text-gray-400 mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">No products found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery
                ? 'Try adjusting your search terms or browse all products'
                : 'Check back soon for new items in this category'
              }
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
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
          <div className="mt-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-3xl font-black mb-3">Love What You See?</h3>
            <p className="text-lg mb-6 opacity-90">
              Get 15% off your first order when you sign up for our newsletter!
            </p>
            <button className="bg-white text-red-600 px-8 py-3 rounded-xl font-black hover:bg-gray-100 transition-all shadow-lg">
              Subscribe Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};