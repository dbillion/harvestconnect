'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { Input } from '@/components/ui/input';
import apiClient, { Category, Product } from '@/lib/api-client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const categoriesData = await apiClient.getCategories({ page_size: 100 });
        setCategories(categoriesData.results || []);

        // Fetch products with filters
        const params: Record<string, unknown> = { page_size: 20, status: 'active' };
        if (searchTerm) {
          params.search = searchTerm;
        }
        if (selectedCategory) {
          params.category = selectedCategory;
        }

        const productsData = await apiClient.getProducts(params);
        setProducts(productsData.results || []);
      } catch (error) {
        console.error('Failed to fetch marketplace data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Add debounce for search
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Marketplace</h1>
            <p className="text-xl opacity-90">Browse handcrafted products from local sellers</p>
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Filters */}
          <div className="mb-12">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium mb-2">Search Products</label>
                <Input
                  type="text"
                  placeholder="Search by product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Filter by Category</label>
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid md:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/marketplace/${product.id}`}>
                  <div className="bg-white rounded-lg overflow-hidden border border-border hover:border-primary transition cursor-pointer h-full flex flex-col">
                    <div className="relative h-40 bg-muted">
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                      <div className="mt-auto">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-primary">${product.price}</span>
                          <span className="text-xs text-amber-500">★ {product.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          by {product.seller.first_name} {product.seller.last_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">No products found. Try adjusting your filters.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
