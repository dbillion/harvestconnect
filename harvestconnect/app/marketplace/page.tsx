'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import apiClient, { Category, Product } from '@/lib/api-client';
import { useCart } from '@/lib/cart-context';
import { useToast } from '@/components/ui/toast';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { addItem } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesData = await apiClient.getCategories({ page_size: 100 });
        setCategories(categoriesData.results || []);

        const params: Record<string, unknown> = { page_size: 20, status: 'active' };
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory) params.category = selectedCategory;

        const productsData = await apiClient.getProducts(params);
        setProducts(productsData.results || []);
      } catch (error) {
        console.error('Failed to fetch marketplace data:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-background gradient-background">
      <Navigation />
      
      <main>
        {/* Premium Header */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-b border-border overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-10" alt="background" />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
          </div>
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter animate-in slide-in-from-bottom-6 duration-700">Marketplace</h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-700">
              Supporting families and communities through honest commerce.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-6 mb-16 relative z-20">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search products, artisans, farms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 pl-12 pr-4 glass-card border-none ring-1 ring-border focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium"
              />
            </div>
            
            <div className="w-full md:w-72 flex items-center gap-2 group">
              <div className="flex-1 relative">
                <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full h-14 pl-12 pr-4 glass-card border-none ring-1 ring-border focus:ring-2 focus:ring-primary outline-none appearance-none font-medium cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="aspect-[4/6] glass-card animate-pulse bg-card" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in duration-500 stagger-children">
              {products.map((product) => (
                <div key={product.id} className="glass-card hover-lift overflow-hidden group flex flex-col h-full bg-card/60 relative">
                    <Link href={`/marketplace/${product.id}`} className="flex-1">
                       <div className="aspect-[5/4] relative overflow-hidden">
                          <img 
                            src={product.image || 'https://via.placeholder.com/400'} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt={product.title}
                          />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black shadow-sm flex items-center gap-1">
                            <Star className="size-3 text-secondary fill-secondary" />
                            {product.rating?.toFixed(1) || '5.0'}
                          </div>
                       </div>
                       <div className="p-6 pb-0 flex flex-col">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">
                            {product.category?.name || 'Handcrafted'}
                          </p>
                          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {product.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 font-medium opacity-80">
                            {product.description}
                          </p>
                       </div>
                    </Link>
                    
                    <div className="p-6 pt-auto flex flex-col">
                       <div className="flex justify-between items-center border-t border-primary/5 pt-4 mb-4">
                          <span className="text-2xl font-black">${product.price}</span>
                          <div className="flex items-center gap-2">
                             <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-xs text-primary">storefront</span>
                             </div>
                             <span className="text-xs font-bold text-muted-foreground">
                                {product.seller?.first_name || 'Artisan'}
                             </span>
                          </div>
                       </div>
                       
                       <button 
                        onClick={(e) => {
                          e.preventDefault();
                          addItem({
                            id: product.id,
                            title: product.title,
                            price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                            quantity: 1,
                            image: product.image
                          });
                        }}
                        className="w-full h-11 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                       >
                          <span className="material-symbols-outlined text-sm">shopping_cart</span>
                          Quick Add
                       </button>
                    </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-40 glass-card">
              <span className="material-symbols-outlined text-muted-foreground text-6xl mb-4">search_off</span>
              <p className="text-xl font-bold">No products found</p>
              <p className="text-muted-foreground mt-2">Try adjusting your search or category filters.</p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedCategory(null);}}
                className="mt-6 text-primary font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
