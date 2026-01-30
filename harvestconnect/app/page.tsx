'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import apiClient, { BlogPost, Product } from '@/lib/api-client';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const FALLBACK_PRODUCTS: Partial<Product>[] = [
  {
    id: 1,
    title: 'Organic Farm Fresh Vegetables',
    price: '15.99',
    rating: 4.8,
    description: 'Fresh, seasonal vegetables from local farms',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    title: 'Handcrafted Wooden Furniture',
    price: '299.99',
    rating: 4.9,
    description: 'Beautiful artisan-made wooden pieces',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    title: 'Farm Fresh Dairy Products',
    price: '8.99',
    rating: 4.7,
    description: 'Milk, cheese, and butter from local farmers',
    image: 'https://images.unsplash.com/photo-1550583724-125581f77833?auto=format&fit=crop&q=80&w=800'
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

const FEATURES = [
  {
    icon: 'storefront',
    title: 'Seasonal Markets',
    description: 'Access fresh, seasonal products directly from local farmers.',
    href: '/seasonal-markets'
  },
  {
    icon: 'construction',
    title: 'Skilled Tradesmen',
    description: 'Find trusted, faith-driven professionals for your needs.',
    href: '/tradesmen'
  },
  {
    icon: 'handshake',
    title: 'Order Mediation',
    description: 'A seamless platform for placing and managing orders anytime.',
    href: '/marketplace'
  },
  {
    icon: 'star',
    title: 'Membership Benefits',
    description: 'Unlock exclusive benefits and discounts as a valued member.',
    href: '/membership'
  },
  {
    icon: 'volunteer_activism',
    title: 'Charitable Giving',
    description: 'Support local causes and charities with every transaction.',
    href: '/mission'
  },
  {
    icon: 'local_shipping',
    title: 'Farm Services',
    description: 'Connect with essential services to support your growth.',
    href: '/tradesmen'
  },
];

export default function Home() {
  const [products, setProducts] = useState<Partial<Product>[]>([]);
  const [blogPosts, setBlogPosts] = useState<Partial<BlogPost>[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productsData = await apiClient.getProducts({ page_size: 6, status: 'active' });
        if (productsData.results && productsData.results.length > 0) {
          setProducts(productsData.results);
          setApiConnected(true);
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }

        const blogData = await apiClient.getBlogPosts({ page_size: 3 });
        if (blogData.results && blogData.results.length > 0) {
          setBlogPosts(blogData.results);
        } else {
          setBlogPosts(FALLBACK_BLOG_POSTS);
        }
      } catch (err) {
        console.warn('Using fallback data:', err);
        setProducts(FALLBACK_PRODUCTS);
        setBlogPosts(FALLBACK_BLOG_POSTS);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative w-full overflow-x-hidden">
      {/* Background Image & Gradient */}
      <div className="absolute inset-0 z-[-1]">
        <img 
          className="w-full h-[1200px] object-cover object-center opacity-40 dark:opacity-20" 
          alt="Lush green farm landscape"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsc8tbv0f-EwOzvL-1-AHjlY_eFDlN0ZASFeOWKyO4e5vRlQTT5IwCy0fIlazQxzoOmbJaXicxfRvK8d0OHqjIE2Ut26bzAHkgkh6gjiH7lg1u_pHiE3L0l12rhLWRz3bhZfbWwOTOjmaiD850uxet-knoLdVOfiZYUaKsmnCw3ubxwMiZuPFEheoPg8qHCNmIkxtlqj07KCVBeGKab94r6tDbH3P6jwkdukbVRhaWLl60RcJ_dgQlnoulKepWiG6vIPqrGHrY3aUF" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background to-background"></div>
      </div>

      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="flex min-h-[calc(100vh-100px)] items-center justify-center py-20">
          <div className="w-full max-w-4xl glass-card p-8 text-center sm:p-12 md:p-16">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl font-black leading-tight tracking-tighter sm:text-5xl md:text-7xl text-foreground">
                Connecting Faith, Farms & Community
              </h1>
              <h2 className="text-base font-normal leading-normal text-muted-foreground sm:text-lg max-w-2xl mx-auto">
                Our platform unites community members with local, faith-driven producers and artisans for natural products, services, and creative work.
              </h2>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/marketplace">
                <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-6 bg-primary text-primary-foreground text-lg font-bold hover-scale shadow-lg">
                  Browse Marketplace
                </button>
              </Link>
              <Link href="/membership">
                <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-6 bg-card/50 text-foreground ring-1 ring-primary/50 hover:bg-primary/20 transition-all font-bold">
                  Join Our Community
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-24">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4 text-center">
              <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
                Discover What We Offer
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Explore the cornerstones of our community-driven marketplace, designed to connect and support local faith-based economies.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature, idx) => (
                <Link key={idx} href={feature.href} className="flex flex-col gap-4 glass-card p-8 text-left hover-lift group">
                  <span className="material-symbols-outlined text-primary text-4xl mb-2">{feature.icon}</span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24">
          <div className="flex flex-col gap-12">
            <div className="flex justify-between items-end border-b border-border pb-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">Featured Products</h2>
                <p className="text-muted-foreground mt-2">Discover handcrafted items from our community sellers.</p>
              </div>
              <Link href="/marketplace" className="text-primary font-bold hover:underline mb-1 flex items-center gap-1">
                View All <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="glass-card aspect-[4/5] animate-pulse bg-muted/20" />
                ))
              ) : products.map((product) => (
                <Link key={product.id} href={`/marketplace/${product.id}`} className="glass-card overflow-hidden hover-lift group">
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={product.image || 'https://via.placeholder.com/400'} 
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-black text-2xl text-foreground">${product.price}</span>
                      <div className="flex items-center gap-1 text-sm font-bold text-secondary">
                        <span className="material-symbols-outlined text-sm">star</span>
                        {product.rating?.toFixed(1) || '4.9'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Tiers */}
        <section className="py-24">
          <div className="flex flex-col gap-8 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">Choose Your Membership</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Support our mission while gaining priority access and tools.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col glass-card p-10 hover-lift">
              <h3 className="text-xl font-bold">Community Member</h3>
              <p className="text-muted-foreground mt-2 italic">For individuals & families</p>
              <div className="my-8 text-5xl font-black">$10<span className="text-lg font-medium opacity-60">/mo</span></div>
              <ul className="space-y-4 text-left mb-10">
                <li className="flex items-center gap-3"><CheckCircle className="size-5 text-primary" /> Full marketplace access</li>
                <li className="flex items-center gap-3"><CheckCircle className="size-5 text-primary" /> Event notifications</li>
                <li className="flex items-center gap-3"><CheckCircle className="size-5 text-primary" /> Direct messaging</li>
              </ul>
              <button className="mt-auto w-full py-4 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary hover:text-primary-foreground transition-all">Sign Up</button>
            </div>

            <div className="relative flex flex-col glass-card p-10 border-2 border-primary ring-4 ring-primary/10 hover-scale">
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase">Most Popular</div>
              <h3 className="text-xl font-bold">Artisan Partner</h3>
              <p className="text-muted-foreground mt-2 italic">For creators & small shops</p>
              <div className="my-8 text-5xl font-black">$25<span className="text-lg font-medium opacity-60">/mo</span></div>
              <ul className="space-y-4 text-left mb-10">
                <li className="flex items-center gap-3"><CheckCircle className="size-5 text-primary" /> Your own storefront</li>
                <li className="flex items-center gap-3"><CheckCircle className="size-5 text-primary" /> Promoted listings</li>
                <li className="flex items-center gap-3"><CheckCircle className="size-5 text-primary" /> Seller dashboard</li>
              </ul>
              <button className="mt-auto w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold hover-scale shadow-lg">Sign Up Now</button>
            </div>

            <div className="flex flex-col glass-card p-10 hover-lift">
              <h3 className="text-xl font-bold">Farmstead Patron</h3>
              <p className="text-muted-foreground mt-2 italic">For producers & farmers</p>
              <div className="my-8 text-5xl font-black">$40<span className="text-lg font-medium opacity-60">/mo</span></div>
              <ul className="space-y-4 text-left mb-10">
                <li className="flex items-center gap-3"><CheckCircle className="size-5 text-primary" /> Bulk order tools</li>
                <li className="flex items-center gap-3"><CheckCircle className="size-5 text-primary" /> Advanced analytics</li>
                <li className="flex items-center gap-3"><CheckCircle className="size-5 text-primary" /> Premium Support</li>
              </ul>
              <button className="mt-auto w-full py-4 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary hover:text-primary-foreground transition-all">Sign Up</button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl italic">What Our Community Says</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="glass-card p-8 flex flex-col justify-between">
                <p className="text-lg italic leading-relaxed">"HarvestConnect has been a blessing. It’s more than a marketplace; it’s a family. We've connected with so many families who care about real food."</p>
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border">
                  <div className="size-12 rounded-full overflow-hidden bg-muted">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=100&h=100" />
                  </div>
                  <div>
                    <h4 className="font-bold">David Chen</h4>
                    <p className="text-xs text-muted-foreground">Local Farmer</p>
                  </div>
                </div>
             </div>
             <div className="glass-card p-8 flex flex-col justify-between lg:scale-105 bg-white/40 shadow-xl">
                <p className="text-lg italic leading-relaxed">"Aligning my work with my faith was crucial. I've found a supportive community of creators and customers who truly value quality craftsmanship."</p>
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border">
                  <div className="size-12 rounded-full overflow-hidden bg-muted">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=100&h=100" />
                  </div>
                  <div>
                    <h4 className="font-bold">Maria Rodriguez</h4>
                    <p className="text-xs text-muted-foreground">Artisan Potter</p>
                  </div>
                </div>
             </div>
             <div className="glass-card p-8 flex flex-col justify-between">
                <p className="text-lg italic leading-relaxed">"The quality of local products is unmatched. It feels good to know exactly where my food comes from and that I'm supporting our community members."</p>
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border">
                  <div className="size-12 rounded-full overflow-hidden bg-muted">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=100&h=100" />
                  </div>
                  <div>
                    <h4 className="font-bold">Sarah Jenkins</h4>
                    <p className="text-xs text-muted-foreground">Community Member</p>
                  </div>
                </div>
             </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
