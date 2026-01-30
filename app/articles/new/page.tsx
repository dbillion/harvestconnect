'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { Input } from '@/components/ui/input';
import apiClient from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import {
    ArrowLeft,
    Hash,
    Image as ImageIcon,
    Layout,
    Loader2,
    Save,
    Type,
    UploadCloud
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function NewArticle() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Produce',
    imageFile: null as File | null,
    summary: '',
    featured: false
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('category', formData.category);
      data.append('excerpt', formData.summary);
      
      if (formData.imageFile) {
        data.append('image', formData.imageFile);
      }

      await apiClient.createBlogPost(data);
      router.push('/community-hub');
    } catch (error) {
      console.error(error);
      alert('Failed to create article. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return null;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/articles/manage" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-black uppercase tracking-widest text-xs">
            <ArrowLeft size={16} />
            Back to Management
          </Link>

          <div className="glass-card rounded-3xl border border-border/50 overflow-hidden">
            <div className="p-8 md:p-12 border-b border-border/30 bg-primary/5">
              <h1 className="text-4xl font-black tracking-tight">Create Community Story</h1>
              <p className="text-muted-foreground mt-2 font-medium">Share your knowledge, farm updates, or craftsmanship tips with the HarvestConnect community.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Type size={14} /> Story Title
                </label>
                <Input 
                  required
                  placeholder="e.g. The Secrets of Sourdough Fermentation" 
                  className="h-14 rounded-xl text-lg font-bold"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Hash size={14} /> Category
                  </label>
                  <select 
                    className="w-full h-14 rounded-xl border border-border bg-background px-4 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Produce</option>
                    <option>Craftsmanship</option>
                    <option>Community</option>
                    <option>Recipes</option>
                    <option>Health</option>
                    <option>Farming</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <ImageIcon size={14} /> Cover Image
                  </label>
                  <Input 
                    type="file"
                    accept="image/*"
                    className="h-14 rounded-xl font-medium pt-3"
                    onChange={e => setFormData({...formData, imageFile: e.target.files?.[0] || null})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Layout size={14} /> Summary
                </label>
                <textarea 
                  required
                  placeholder="A brief overview to entice readers..."
                  className="w-full min-h-[100px] rounded-xl border border-border bg-background p-4 font-medium text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  value={formData.summary}
                  onChange={e => setFormData({...formData, summary: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <UploadCloud size={14} /> Story Content
                </label>
                <textarea 
                  required
                  placeholder="Write your story here..."
                  className="w-full min-h-[400px] rounded-xl border border-border bg-background p-6 font-medium leading-relaxed text-base focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                />
              </div>

              <div className="pt-8">
                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Publish Story
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
