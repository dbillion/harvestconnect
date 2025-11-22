'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import apiClient, { BlogPost } from '@/lib/api-client';

export default function CommunityHubPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params: Record<string, unknown> = { page_size: 20 };
        if (searchTerm) {
          params.search = searchTerm;
        }
        const data = await apiClient.getBlogPosts(params);
        setBlogPosts(data.results || []);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Community Hub</h1>
            <p className="text-xl opacity-90">Stories, tips, and inspiration from our community</p>
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Search */}
          <div className="mb-12 max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Posts */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Loading stories...</p>
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {blogPosts.map((post) => (
                <Link key={post.id} href={`/community-hub/${post.id}`}>
                  <article className="bg-white rounded-lg overflow-hidden border border-border hover:border-primary transition cursor-pointer h-full flex flex-col">
                    <div className="relative h-48 bg-muted">
                      {post.image && (
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-3">
                        <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded">
                          {post.category}
                        </span>
                      </div>
                      <h2 className="font-bold text-xl mb-3 line-clamp-2">{post.title}</h2>
                      <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>{post.author.first_name} {post.author.last_name}</span>
                        <span>{post.views} views</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">No stories found. Try different search terms.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
