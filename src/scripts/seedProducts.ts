// src/scripts/seedProducts.ts
import { supabase } from '../lib/supabase';

export const seedProducts = async () => {
  const products = [
    // Your 50+ products here from the SQL file
  ];

  const { data, error } = await supabase
    .from('products')
    .insert(products);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('✅ Added', data?.length, 'products!');
  }
};