// src/types/categories.ts

export interface ProductCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    image: string;
    itemCount: number;
    color: string;
  }
  
  export const productCategories: ProductCategory[] = [
    {
      id: 'tops',
      name: 'Tops & T-Shirts',
      description: 'Custom printed t-shirts, polo shirts, and tank tops',
      icon: '👕',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      itemCount: 45,
      color: 'from-blue-500 to-blue-700'
    },
    {
      id: 'hoodies',
      name: 'Hoodies & Sweatshirts',
      description: 'Comfortable hoodies and crew neck sweatshirts',
      icon: '🧥',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
      itemCount: 32,
      color: 'from-purple-500 to-purple-700'
    },
    {
      id: 'bottoms',
      name: 'Bottoms',
      description: 'Pants, shorts, joggers, and athletic wear',
      icon: '👖',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
      itemCount: 28,
      color: 'from-green-500 to-green-700'
    },
    {
      id: 'headwear',
      name: 'Hats & Caps',
      description: 'Baseball caps, beanies, snapbacks, and visors',
      icon: '🧢',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400',
      itemCount: 38,
      color: 'from-red-500 to-red-700'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      description: 'Bags, belts, socks, wristbands, and more',
      icon: '🎒',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      itemCount: 52,
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'drinkware',
      name: 'Drinkware',
      description: 'Water bottles, tumblers, mugs, and koozies',
      icon: '🥤',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
      itemCount: 24,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'stickers',
      name: 'Stickers & Decals',
      description: 'Vinyl stickers, car decals, and laptop stickers',
      icon: '✨',
      image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
      itemCount: 67,
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'gift-cards',
      name: 'Gift Cards',
      description: 'Digital and physical gift cards',
      icon: '🎁',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400',
      itemCount: 8,
      color: 'from-indigo-500 to-purple-600'
    }
  ];