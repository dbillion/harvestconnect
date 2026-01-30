'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { Input } from '@/components/ui/input';
import apiClient, { BlogPost } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import {
    AlertCircle,
    Calendar,
    Edit,
    ExternalLink,
    Eye,
    Plus,
    Search,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ManageArticles() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Check if role has access
    const role = user?.profile?.role;
    if (role && !['farmer', 'artisan', 'tradesman', 'admin'].includes(role)) {
      router.push('/dashboard');
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    const fetchMyArticles = async () => {
      try {
        // In a real app, we'd filter by author_id on the backend
        const data = await apiClient.getBlogPosts({ page_size: 100 });
        
        // Simulating "My Articles" filter if not admin
        if (user?.profile?.role === 'admin') {
          setArticles(data.results);
        } else {
          setArticles(data.results.filter(p => p.author_id === user?.id));
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyArticles();
    }
  }, [user]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await apiClient.deleteBlogPost(id);
      setArticles(articles.filter(a => a.id !== id));
    } catch (error) {
      alert('Failed to delete article');
    }
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black tracking-tight">Manage Articles</h1>
              <p className="text-muted-foreground mt-2 font-medium">Create, edit, and monitor your community contributions.</p>
            </div>
            <Link href="/articles/new">
              <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                <Plus size={20} />
                New Article
              </button>
            </Link>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search your articles..." 
                className="pl-10 h-12 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Article List */}
          <div className="grid gap-6">
            {filteredArticles.length > 0 ? (
              filteredArticles.map(article => (
                <div key={article.id} className="glass-card rounded-2xl p-6 border border-border/50 flex flex-col md:flex-row gap-6 hover:border-primary/30 transition-all items-center">
                  <img 
                    src={article.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=400'} 
                    alt={article.title} 
                    className="size-32 rounded-xl object-cover"
                  />
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                      <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                        {article.category}
                      </span>
                      {article.featured && (
                        <span className="bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black mb-2">{article.title}</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-muted-foreground font-medium">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(article.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Eye size={14} /> {article.views} Views</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/community-hub/${article.slug}`}>
                      <button className="p-3 rounded-xl hover:bg-muted transition-colors text-muted-foreground" title="View">
                        <ExternalLink size={18} />
                      </button>
                    </Link>
                    <Link href={`/articles/edit/${article.id}`}>
                      <button className="p-3 rounded-xl hover:bg-primary/10 text-primary transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(article.id)}
                      className="p-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors" 
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 glass-card rounded-3xl border border-dashed border-border flex flex-col items-center">
                <div className="size-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-black">No articles found</h3>
                <p className="text-muted-foreground mt-2 font-medium">You haven't published any community stories yet.</p>
                <Link href="/articles/new">
                  <button className="mt-6 text-primary font-black uppercase tracking-widest text-sm hover:underline">Create your first post</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
