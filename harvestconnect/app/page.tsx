'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { Button } from '@/components/ui/button';
import apiClient, { BlogPost, Product } from '@/lib/api-client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Fallback data for when API is unavailable
const FALLBACK_PRODUCTS: Partial<Product>[] = [
  {
    id: 1,
    title: 'Organic Farm Fresh Vegetables',
    price: '15.99',
    rating: 4.8,
    description: 'Fresh, seasonal vegetables from local farms',
  },
  {
    id: 2,
    title: 'Handcrafted Wooden Furniture',
    price: '299.99',
    rating: 4.9,
    description: 'Beautiful artisan-made wooden pieces',
  },
  {
    id: 3,
    title: 'Farm Fresh Dairy Products',
    price: '8.99',
    rating: 4.7,
    description: 'Milk, cheese, and butter from local farmers',
  },
];

const FALLBACK_BLOG_POSTS: Partial<BlogPost>[] = [
  {
    id: 1,
    title: 'Supporting Local Farms in Our Community',
    excerpt: 'Learn how our marketplace helps local farmers thrive',
    views: 1250,
  },
  {
    id: 2,
    title: 'The Benefits of Fair Trade Marketplace',
    excerpt: 'Discover why fair trade matters for our community',
    views: 980,
  },
  {
    id: 3,
    title: 'Meet Our Featured Artisans',
    excerpt: 'Get to know the talented creators behind our products',
    views: 2100,
  },
];

export default function Home() {
  const [products, setProducts] = useState<Partial<Product>[]>(FALLBACK_PRODUCTS);
  const [blogPosts, setBlogPosts] = useState<Partial<BlogPost>[]>(FALLBACK_BLOG_POSTS);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Try to fetch featured products
        const productsData = await apiClient.getProducts({ page_size: 6, status: 'active' });
        if (productsData.results && productsData.results.length > 0) {
          setProducts(productsData.results);
          setApiConnected(true);
        }

        // Try to fetch featured blog posts
        const blogData = await apiClient.getBlogPosts({ page_size: 3 });
        if (blogData.results && blogData.results.length > 0) {
          setBlogPosts(blogData.results);
        }

        setError(null);
      } catch (err) {
        console.warn('API not available, using fallback data:', err);
        // Use fallback data - no error shown to user
        setProducts(FALLBACK_PRODUCTS);
        setBlogPosts(FALLBACK_BLOG_POSTS);
        setApiConnected(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section 
          className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: 'url(/placeholder.svg?height=1200&width=1920&query=pastoral farmland landscape with green fields)' }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
              Connecting Faith, Farms & Community
            </h1>
            <p className="text-xl text-white/90 mb-8 text-balance">
              Our platform unites community members with local, faith-driven producers and artisans for natural products, services, and creative work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  Browse Marketplace
                </Button>
              </Link>
              <Link href="/membership">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                  Join Our Community
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Discover What We Offer</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Explore the cornerstones of our community-driven marketplace, designed to connect and support local faith-based economies.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-card p-8 rounded-lg border border-border hover:border-primary transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-muted/50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-4xl font-bold">Featured Products</h2>
            {apiConnected && <span className="text-sm text-green-600 font-medium">🟢 Live</span>}
            {!apiConnected && <span className="text-sm text-amber-600 font-medium">⚪ Demo Mode</span>}
          </div>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Discover handcrafted items from local sellers in our community.
          </p>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Loading featured products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {products.slice(0, 3).map((product) => (
                <Link key={product.id} href={`/marketplace/${product.id}`}>
                  <div className="bg-white rounded-lg overflow-hidden border border-border hover:border-primary transition cursor-pointer">
                    <div className="relative h-48 bg-muted">
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-primary text-lg">${product.price}</span>
                        <span className="text-sm text-amber-500">★ {product.rating?.toFixed(1) || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}

          <div className="flex justify-center mt-12">
            <Link href="/marketplace">
              <Button size="lg" variant="outline">
                View All Products
              </Button>
            </Link>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Community Stories</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Read inspiring stories from our community members.
          </p>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Loading stories...</p>
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Link key={post.id} href={`/community-hub/${post.id}`}>
                  <div className="bg-white rounded-lg overflow-hidden border border-border hover:border-primary transition cursor-pointer">
                    <div className="relative h-48 bg-muted">
                      {post.image && (
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{post.author?.first_name || 'Staff'} {post.author?.last_name || ''}</span>
                        <span>{post.views || 0} views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}

          <div className="flex justify-center mt-12">
            <Link href="/community-hub">
              <Button size="lg" variant="outline">
                Read More Stories
              </Button>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Share Your Gifts?</h2>
            <p className="text-lg opacity-90 mb-8">
              Join a marketplace where your work is valued and your faith is celebrated. Create your free profile today and start connecting with community.
            </p>
            <Link href="/for-sellers">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Start Selling Today
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

const features = [
  {
    icon: '🌾',
    title: 'Seasonal Markets',
    description: 'Access fresh, seasonal products directly from local farmers.',
  },
  {
    icon: '🔨',
    title: 'Skilled Tradesmen',
    description: 'Find trusted, faith-driven professionals for your home and farm needs.',
  },
  {
    icon: '🎨',
    title: 'Year-round Order Mediation',
    description: 'A seamless platform for placing and managing orders anytime.',
  },
  {
    icon: '⭐',
    title: 'Membership Benefits',
    description: 'Unlock exclusive benefits and discounts as a valued member.',
  },
  {
    icon: '❤️',
    title: 'Charitable Giving Program',
    description: 'Support local causes and community initiatives through every purchase.',
  },
  {
    icon: '🌱',
    title: 'Farm Services',
    description: 'Connect with essential services designed to support your growth.',
  },
];
