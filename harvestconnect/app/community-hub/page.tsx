'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import apiClient from '@/lib/api-client';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const FALLBACK_POSTS = [
  {
    id: 1,
    title: 'How to Support Local Farmers Year-Round',
    excerpt: 'Beyond the summer harvest, there are many ways to keep our local producers thriving.',
    author: 'Daniel Miller',
    date: 'April 12, 2024',
    category: 'Stewardship',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    title: 'The Art of Hand-Carved Furniture',
    excerpt: 'Meet one of our master tradesmen and learn about the patience required for quality craft.',
    author: 'Sarah Jenkins',
    date: 'April 10, 2024',
    category: 'Craftsmanship',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    title: 'Biblical Principles of Fair Commerce',
    excerpt: 'Exploring how our faith informs the way we buy, sell, and support one another.',
    author: 'Pastor Mike',
    date: 'April 05, 2024',
    category: 'Faith',
    image: 'https://images.unsplash.com/photo-1504052434569-7c9602df1f37?auto=format&fit=crop&q=80&w=800'
  }
];

export default function CommunityHub() {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All Stories');
  const [loading, setLoading] = useState(true);

  const CATEGORIES = [
    { name: 'All Stories', slug: '' },
    { name: 'Farming', slug: 'farming' },
    { name: 'Artisanship', slug: 'artisanship' },
    { name: 'Faith', slug: 'faith' },
    { name: 'Sustainability', slug: 'sustainability' },
    { name: 'Market Updates', slug: 'market-updates' }
  ];

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const categorySlug = CATEGORIES.find(c => c.name === selectedCategory)?.slug;
        const params: any = { page_size: 10 };
        if (categorySlug) {
          params.category = categorySlug;
        }
        
        const data = await apiClient.getBlogPosts(params);
        if (data && data.results) {
          setPosts(data.results);
        } else {
          setPosts(FALLBACK_POSTS);
        }
      } catch (err) {
        console.error('Failed to fetch blog posts:', err);
        setPosts(FALLBACK_POSTS);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [selectedCategory]);

  const getAuthorName = (author: any) => {
    if (!author) return 'Anonymous';
    if (typeof author === 'string') return author;
    if (author.first_name || author.last_name) {
      return `${author.first_name || ''} ${author.last_name || ''}`.trim();
    }
    return author.email || 'Anonymous';
  };

  return (
    <div className="min-h-screen bg-background gradient-background">
      <Navigation />

      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6">Community Hub</h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground font-medium">
            Stories, wisdom, and updates from the heart of the HarvestConnect family.
          </p>
        </div>

        {/* Featured Post */}
        {!loading && posts.length > 0 && (
          <section className="mb-24 relative group cursor-pointer">
            <Link href={`/community-hub/${posts[0].id}`} className="block">
            <div className="glass-card overflow-hidden grid lg:grid-cols-2 lg:h-[500px] hover:shadow-2xl transition-shadow">
               <div className="relative h-64 lg:h-auto overflow-hidden">
                  <img 
                    src={posts[0].image || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1200'} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={posts[0].title}
                  />
                  {posts[0].featured && (
                    <div className="absolute top-6 left-6">
                      <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Featured Story</span>
                    </div>
                  )}
               </div>
               <div className="p-8 lg:p-16 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-xs font-black text-primary uppercase mb-4 tracking-widest">
                     <span>{posts[0].category || 'COMMUNITY'}</span>
                     <span className="size-1 rounded-full bg-primary/30" />
                     <span className="text-muted-foreground">{posts[0].created_at ? new Date(posts[0].created_at).toLocaleDateString('en-US') : (posts[0].date || new Date().toLocaleDateString('en-US'))}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black mb-6 group-hover:text-primary transition-colors">{posts[0].title}</h2>
                  <p className="text-lg text-muted-foreground mb-8 line-clamp-3 font-medium">{posts[0].excerpt}</p>
                  <div className="flex items-center gap-4">
                     <div className="size-10 rounded-full bg-muted overflow-hidden">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${getAuthorName(posts[0].author)}&background=random`} 
                          alt={getAuthorName(posts[0].author)}
                        />
                     </div>
                     <span className="font-bold">{getAuthorName(posts[0].author)}</span>
                  </div>
               </div>
            </div>
            </Link>
          </section>
        )}

        {/* Categories Bar */}
        <div className="flex overflow-x-auto gap-4 mb-16 pb-4 no-scrollbar">
           {CATEGORIES.map((cat, i) => (
             <button 
               key={i} 
               onClick={() => setSelectedCategory(cat.name)}
               className={`whitespace-nowrap h-12 px-6 rounded-full font-bold transition-all ${selectedCategory === cat.name ? 'bg-primary text-primary-foreground shadow-lg' : 'glass-card hover:bg-white/40'}`}
             >
               {cat.name}
             </button>
           ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
           {loading ? Array(6).fill(0).map((_, i) => (
             <div key={i} className="aspect-[4/5] glass-card animate-pulse" />
           )) : posts.slice(1).map((post, i) => (
             <Link key={i} href={`/community-hub/${post.id}`} className="glass-card group hover-lift overflow-hidden flex flex-col">
                <div className="aspect-video relative overflow-hidden">
                   <img 
                    src={post.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800'} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={post.title}
                   />
                </div>
                <div className="p-8 flex flex-col flex-1">
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{post.category}</span>
                       <span className="text-xs text-muted-foreground">{post.created_at ? new Date(post.created_at).toLocaleDateString('en-US') : (post.date || new Date().toLocaleDateString('en-US'))}</span>
                   </div>
                   <h3 className="text-xl font-bold mb-4 line-clamp-2 group-hover:text-primary transition-colors leading-tight">{post.title}</h3>
                   <p className="text-sm text-muted-foreground line-clamp-3 mb-8 font-medium">{post.excerpt}</p>
                   <div className="mt-auto flex items-center justify-between border-t border-primary/5 pt-6">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-muted overflow-hidden">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${getAuthorName(post.author)}&background=random`} 
                            alt={getAuthorName(post.author)}
                          />
                        </div>
                        <span className="text-xs font-bold">{getAuthorName(post.author)}</span>
                      </div>
                      <div className="flex gap-4">
                        <TrendingUp className="size-4 text-muted-foreground/40" />
                      </div>
                   </div>
                </div>
             </Link>
           ))}
        </div>

        {/* Newsletter / Join */}
        <section className="glass-card p-12 md:p-20 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
           <h2 className="text-3xl md:text-5xl font-black mb-6">Stay Connected</h2>
           <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-lg">
             Weekly stories of impact, seasonal market updates, and new artisan spotlight delivered to your inbox.
           </p>
           <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
             <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 h-14 px-6 glass-card border-none ring-1 ring-border focus:ring-2 focus:ring-primary outline-none"
             />
             <button className="h-14 px-10 bg-primary text-primary-foreground rounded-xl font-bold hover-scale shadow-lg">
               Subscribe
             </button>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
