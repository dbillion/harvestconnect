'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import apiClient, { BlogPost } from '@/lib/api-client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BlogPostDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError('');
      
      try {
        const postData = await apiClient.getBlogPost(Number.parseInt(id, 10));
        setPost(postData);
        // Increment views
        await apiClient.incrementBlogPostViews(Number.parseInt(id, 10));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load blog post';
        setError(errorMessage);
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background gradient-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Loading story...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col bg-background gradient-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md w-full glass-card p-12 text-center">
            <span className="material-symbols-outlined text-muted-foreground text-6xl mb-6">article</span>
            <p className="text-xl font-bold mb-4">{error || 'Post not found'}</p>
            <Link href="/community-hub" className="btn-primary">
              Back to Community Hub
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background gradient-background">
      <Navigation />

      <main className="flex-1 py-12 px-4 md:px-8">
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 text-xs font-black text-primary uppercase mb-6 tracking-widest">
               <span>{post.category || 'COMMUNITY'}</span>
               <span className="size-1 rounded-full bg-primary/30" />
               <span className="text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</span>
               <span className="size-1 rounded-full bg-primary/30" />
               <span className="text-muted-foreground">{post.views} views</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight">{post.title}</h1>
            
            <div className="flex items-center justify-center gap-4">
              <div className="size-12 rounded-full bg-muted overflow-hidden">
                <img 
                  src={`https://ui-avatars.com/api/?name=${post.author?.first_name || 'A'}&background=random`} 
                  alt={post.author?.first_name}
                />
              </div>
              <div className="text-left">
                <p className="font-bold">{post.author?.first_name} {post.author?.last_name}</p>
                <p className="text-xs text-muted-foreground">Certified Contributor</p>
              </div>
            </div>
          </div>

          {/* Feature Image */}
          {post.image && (
            <div className="glass-card overflow-hidden h-[400px] mb-16">
              <img 
                src={post.image} 
                className="w-full h-full object-cover" 
                alt={post.title}
              />
            </div>
          )}

          {/* Content */}
          <div className="glass-card p-8 md:p-16 prose prose-lg max-w-none dark:prose-invert">
            <div className="text-lg leading-relaxed text-muted-foreground mb-8 font-medium italic">
              {post.excerpt}
            </div>
            <div 
              className="text-foreground text-lg leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Footer Navigation */}
          <div className="mt-16 flex items-center justify-between border-t border-primary/10 pt-8">
            <Link href="/community-hub" className="flex items-center gap-2 text-primary font-bold hover:underline">
               <span className="material-symbols-outlined">arrow_back</span>
               Back to All Stories
            </Link>
            <div className="flex gap-4">
               <button className="size-10 rounded-full glass-card flex items-center justify-center hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-sm">share</span>
               </button>
               <button className="size-10 rounded-full glass-card flex items-center justify-center hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-sm">bookmark</span>
               </button>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
