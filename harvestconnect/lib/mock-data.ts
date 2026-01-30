/**
 * Mock data for HarvestConnect simulation
 */

import { Artist, BlogPost, Category, Product, User } from './api-client';

const mockUser: User = {
  id: 1,
  email: 'artisan@example.com',
  first_name: 'Gabriel',
  last_name: 'Solomon',
  profile: {
    id: 1,
    user_id: 1,
    role: 'artisan',
    bio: 'Crafting excellence with tradition and heart.',
    location: 'Shenandoah Valley',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
  }
};

const mockCategories: Category[] = [
  { id: 1, name: 'Handcrafted Gear', slug: 'handcrafted-gear', icon: 'handyman' },
  { id: 2, name: 'Farm Fresh', slug: 'farm-fresh', icon: 'agriculture' },
  { id: 3, name: 'Homestead Skills', slug: 'homestead-skills', icon: 'school' },
  { id: 4, name: 'Artisan Goods', slug: 'artisan-goods', icon: 'palette' }
];

export const mockProducts: Product[] = [
  {
    id: 1,
    seller: mockUser,
    title: 'Hand-Forged Harvest Knife',
    slug: 'hand-forged-harvest-knife',
    description: 'A durable, high-carbon steel knife perfect for farm work and daily utility. Built to last generations.',
    category: mockCategories[0],
    price: '85.00',
    quantity: 12,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=800'],
    rating: 4.8,
    reviews_count: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    seller: mockUser,
    title: 'Organic Heirloom Seeds Bundle',
    slug: 'organic-heirloom-seeds',
    description: 'A curated collection of 15 heirloom vegetable and herb seeds for a thriving family garden.',
    category: mockCategories[1],
    price: '45.00',
    quantity: 50,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800'],
    rating: 4.9,
    reviews_count: 32,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    seller: mockUser,
    title: 'Woolen Winter Cloak',
    slug: 'woolen-winter-cloak',
    description: 'Authentic 100% wool cloak, handcrafted using traditional methods. Warm, water-resistant, and timeless.',
    category: mockCategories[3],
    price: '165.00',
    quantity: 5,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?auto=format&fit=crop&q=80&w=800'],
    rating: 5.0,
    reviews_count: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    seller: mockUser,
    title: 'Traditional Cast Iron Skillet',
    slug: 'cast-iron-skillet',
    description: 'Seasoned and ready to use. Perfect for hearth cooking or modern kitchens.',
    category: mockCategories[0],
    price: '65.00',
    quantity: 20,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1590159763121-7c9ff334f6ee?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1590159763121-7c9ff334f6ee?auto=format&fit=crop&q=80&w=800'],
    rating: 4.7,
    reviews_count: 24,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Building Resilience in Local Communities',
    slug: 'building-resilience',
    excerpt: 'How local networks of trade and support create strong foundations for families.',
    content: 'Long form content about resilience...',
    category: 'Community',
    author: mockUser,
    author_id: 1,
    featured: true,
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800',
    views: 1250,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'The Art of Blacksmithing: A Return to Quality',
    slug: 'art-of-blacksmithing',
    excerpt: 'Why hand-forged tools are essential for the modern homesteader.',
    content: 'Content about blacksmithing...',
    category: 'Craftsmanship',
    author: mockUser,
    author_id: 1,
    featured: false,
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb270?auto=format&fit=crop&q=80&w=800',
    views: 840,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockArtists: Artist[] = [
  {
    id: 1,
    user: mockUser,
    bio: 'Dedicated to preserving traditional woodworking and metalwork.',
    featured_image: 'https://images.unsplash.com/photo-1551033541-2070dfc01ca5?auto=format&fit=crop&q=80&w=800',
    social_media: { instagram: '@gabriel_crafts' },
    created_at: new Date().toISOString()
  }
];

export const mockData = {
  products: mockProducts,
  blogPosts: mockBlogPosts,
  categories: mockCategories,
  artists: mockArtists
};
