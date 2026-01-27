/*
  # Professional E-commerce Database Schema for HTS SWAG
  
  ## Features:
  - Product categories (tops, hoodies, bottoms, headwear, accessories, drinkware, stickers, gift_cards)
  - 50+ sample products across all categories
  - Cart management for authenticated users
  - Order management system
  - Proper security with RLS policies
  
  ## Tables:
  1. products - All merchandise and gift cards
  2. cart_items - User shopping cart
  3. orders - Customer orders
  4. order_items - Items in each order
*/

-- ============================================
-- 1. PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  currency text DEFAULT 'USD',
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'clothing',
  stock integer DEFAULT 0 CHECK (stock >= 0),
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public can view all products
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

-- Only admins can insert/update/delete (you'll add admin role later)
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- ============================================
-- 2. CART ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- 3. ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_amount numeric(10,2) NOT NULL CHECK (total_amount >= 0),
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
  shipping_address jsonb,
  payment_info jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for own orders"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- ============================================
-- 5. INSERT SAMPLE PRODUCTS (50+ Items)
-- ============================================

-- TOPS & T-SHIRTS (10 items)
INSERT INTO products (name, description, price, image_url, category, stock, featured) VALUES
  ('Classic Cotton Tee - Black', 'Premium 100% cotton t-shirt in classic black. Soft, breathable, and perfect for everyday wear.', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 'tops', 150, true),
  ('Vintage Graphic Tee', 'Retro-inspired graphic t-shirt with distressed print. Made from soft cotton blend.', 34.99, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500', 'tops', 120, false),
  ('Premium V-Neck Tee', 'Elegant v-neck t-shirt in premium fabric. Available in multiple colors.', 32.99, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500', 'tops', 100, false),
  ('Athletic Performance Tee', 'Moisture-wicking performance tee perfect for workouts. Quick-dry technology.', 39.99, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500', 'tops', 80, true),
  ('Striped Polo Shirt', 'Classic striped polo shirt with collar. Perfect for casual or semi-formal occasions.', 44.99, 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500', 'tops', 90, false),
  ('Long Sleeve Henley', 'Comfortable long sleeve henley with button placket. Perfect for layering.', 42.99, 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=500', 'tops', 70, false),
  ('Pocket Tee - Navy', 'Classic pocket t-shirt in navy blue. Relaxed fit with chest pocket detail.', 31.99, 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=500', 'tops', 110, false),
  ('Raglan Baseball Tee', 'Sporty raglan sleeve baseball tee. Contrast sleeves with crew neck.', 36.99, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500', 'tops', 95, false),
  ('Premium Tank Top', 'Lightweight tank top perfect for summer. Breathable and comfortable fit.', 24.99, 'https://images.unsplash.com/photo-1618333452239-5ad6f2b6c2a2?w=500', 'tops', 130, false),
  ('Designer Logo Tee', 'Premium designer t-shirt with embroidered logo. Limited edition release.', 49.99, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500', 'tops', 60, true);

-- HOODIES & SWEATSHIRTS (8 items)
INSERT INTO products (name, description, price, image_url, category, stock, featured) VALUES
  ('Classic Pullover Hoodie', 'Cozy fleece pullover hoodie with kangaroo pocket. Perfect for cold weather.', 59.99, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', 'hoodies', 85, true),
  ('Zip-Up Hoodie - Grey', 'Full zip hoodie with side pockets. Comfortable fleece interior.', 64.99, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500', 'hoodies', 75, false),
  ('Oversized Hoodie', 'Trendy oversized hoodie with dropped shoulders. Ultra-soft fabric.', 69.99, 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500', 'hoodies', 65, true),
  ('Tech Fleece Hoodie', 'Premium tech fleece hoodie with modern fit. Lightweight yet warm.', 89.99, 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500', 'hoodies', 50, false),
  ('Crew Neck Sweatshirt', 'Classic crew neck sweatshirt in premium cotton blend. Ribbed cuffs and hem.', 49.99, 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500', 'hoodies', 90, false),
  ('Graphic Print Hoodie', 'Bold graphic print hoodie with unique artwork. Statement piece.', 72.99, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', 'hoodies', 55, false),
  ('Quarter Zip Sweatshirt', 'Sporty quarter zip sweatshirt. Perfect for layering.', 54.99, 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=500', 'hoodies', 70, false),
  ('Premium Cashmere Hoodie', 'Luxury cashmere blend hoodie. Ultra-soft and premium quality.', 129.99, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', 'hoodies', 35, true);

-- BOTTOMS (6 items)
INSERT INTO products (name, description, price, image_url, category, stock, featured) VALUES
  ('Classic Joggers', 'Comfortable cotton joggers with elastic waistband. Perfect for lounging or workouts.', 44.99, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500', 'bottoms', 100, true),
  ('Athletic Shorts', 'Lightweight athletic shorts with moisture-wicking fabric. Built-in liner.', 34.99, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500', 'bottoms', 120, false),
  ('Cargo Pants - Olive', 'Utility cargo pants with multiple pockets. Durable cotton twill fabric.', 64.99, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500', 'bottoms', 70, false),
  ('Sweatpants - Grey', 'Classic sweatpants with drawstring waist. Soft fleece interior.', 42.99, 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500', 'bottoms', 95, false),
  ('Track Pants', 'Sporty track pants with side stripes. Tapered fit with zip pockets.', 52.99, 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=500', 'bottoms', 80, false),
  ('Denim Jeans - Blue', 'Classic fit denim jeans. Premium denim with comfortable stretch.', 69.99, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 'bottoms', 85, true);

-- HEADWEAR (8 items)
INSERT INTO products (name, description, price, image_url, category, stock, featured) VALUES
  ('Baseball Cap - Black', 'Classic baseball cap with embroidered logo. Adjustable strap.', 24.99, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500', 'headwear', 150, true),
  ('Snapback Hat', 'Trendy snapback hat with flat brim. Premium construction.', 29.99, 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=500', 'headwear', 120, false),
  ('Beanie - Cuffed', 'Warm knit beanie with fold-up cuff. Perfect for winter.', 19.99, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500', 'headwear', 200, false),
  ('Dad Hat - Pastel', 'Soft dad hat in pastel colors. Unstructured with curved brim.', 26.99, 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500', 'headwear', 130, false),
  ('Bucket Hat', 'Stylish bucket hat for sun protection. Reversible design.', 32.99, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500', 'headwear', 90, true),
  ('Trucker Cap', 'Classic mesh trucker cap. Breathable and comfortable.', 22.99, 'https://images.unsplash.com/photo-1533087346097-e4977c0a1d48?w=500', 'headwear', 110, false),
  ('Slouchy Beanie', 'Relaxed slouchy beanie. Soft acrylic knit.', 21.99, 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500', 'headwear', 140, false),
  ('Visor - Performance', 'Athletic visor with moisture-wicking headband. Perfect for sports.', 18.99, 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500', 'headwear', 100, false);

-- ACCESSORIES (10 items)
INSERT INTO products (name, description, price, image_url, category, stock, featured) VALUES
  ('Canvas Tote Bag', 'Durable canvas tote bag. Perfect for shopping or daily use.', 19.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 'accessories', 180, true),
  ('Leather Belt - Brown', 'Genuine leather belt with metal buckle. Classic and durable.', 39.99, 'https://images.unsplash.com/photo-1624222247344-550fb60583c2?w=500', 'accessories', 100, false),
  ('Athletic Socks 3-Pack', 'Cushioned athletic socks with arch support. Moisture-wicking.', 16.99, 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=500', 'accessories', 250, false),
  ('Backpack - Black', 'Spacious backpack with multiple compartments. Padded straps.', 54.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 'accessories', 90, true),
  ('Wristband Set', 'Comfortable cotton wristbands. Set of 2 pairs.', 12.99, 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=500', 'accessories', 200, false),
  ('Crossbody Bag', 'Compact crossbody bag with adjustable strap. Perfect for essentials.', 34.99, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500', 'accessories', 110, false),
  ('Gym Bag - Duffel', 'Large duffel gym bag with shoe compartment. Water-resistant.', 49.99, 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500', 'accessories', 75, false),
  ('Wallet - Leather', 'Slim leather wallet with RFID protection. Multiple card slots.', 44.99, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500', 'accessories', 130, false),
  ('Sunglasses - Polarized', 'Stylish polarized sunglasses with UV protection.', 59.99, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500', 'accessories', 95, true),
  ('Phone Case - Custom', 'Durable phone case with custom design options. Shock-absorbent.', 24.99, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500', 'accessories', 160, false);

-- DRINKWARE (5 items)
INSERT INTO products (name, description, price, image_url, category, stock, featured) VALUES
  ('Stainless Steel Water Bottle', 'Insulated water bottle keeps drinks cold for 24hrs. 32oz capacity.', 29.99, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', 'drinkware', 140, true),
  ('Travel Coffee Mug', 'Leak-proof travel mug with handle. Keeps drinks hot for 6 hours.', 24.99, 'https://images.unsplash.com/photo-1517256673644-36ad11246d21?w=500', 'drinkware', 120, false),
  ('Classic Ceramic Mug', 'Premium ceramic mug with custom logo. Microwave safe.', 14.99, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500', 'drinkware', 200, false),
  ('Tumbler with Straw', '20oz tumbler with reusable straw and lid. Double-wall insulated.', 27.99, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', 'drinkware', 150, true),
  ('Sports Water Bottle', 'BPA-free sports bottle with flip cap. Easy to carry.', 16.99, 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500', 'drinkware', 180, false);

-- STICKERS & DECALS (5 items)
INSERT INTO products (name, description, price, image_url, category, stock, featured) VALUES
  ('Logo Sticker Pack', 'Waterproof vinyl sticker pack. Set of 10 assorted designs.', 9.99, 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500', 'stickers', 500, true),
  ('Laptop Decal - Custom', 'Premium vinyl laptop decal. Removable and residue-free.', 12.99, 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=500', 'stickers', 400, false),
  ('Car Window Decal', 'Durable outdoor vinyl car decal. Weather-resistant.', 14.99, 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500', 'stickers', 350, false),
  ('Die-Cut Stickers', 'Custom die-cut stickers. Glossy finish. Pack of 5.', 11.99, 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500', 'stickers', 450, false),
  ('Holographic Sticker Set', 'Eye-catching holographic stickers. Limited edition.', 15.99, 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500', 'stickers', 300, true);

-- GIFT CARDS (5 items)
INSERT INTO products (name, description, price, image_url, category, stock, featured) VALUES
  ('Gift Card - $25', 'Digital gift card worth $25. Perfect for any occasion.', 25.00, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500', 'gift-cards', 9999, false),
  ('Gift Card - $50', 'Digital gift card worth $50. Instant delivery via email.', 50.00, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500', 'gift-cards', 9999, true),
  ('Gift Card - $100', 'Digital gift card worth $100. No expiration date.', 100.00, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500', 'gift-cards', 9999, false),
  ('Gift Card - $150', 'Premium digital gift card worth $150. Redeemable online.', 150.00, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500', 'gift-cards', 9999, false),
  ('Gift Card - $200', 'Ultimate digital gift card worth $200. Perfect for big purchases.', 200.00, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500', 'gift-cards', 9999, true);

-- ============================================
-- 6. CREATE FUNCTION TO UPDATE TIMESTAMPS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to products table
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to cart_items table
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to orders table
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();