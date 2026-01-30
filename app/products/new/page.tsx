'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { Input } from '@/components/ui/input';
import apiClient from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import {
    ArrowLeft,
    DollarSign,
    Image as ImageIcon,
    Layout,
    Loader2,
    Package,
    Save,
    Tag,
    Type
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function NewProduct() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    price: '',
    quantity: '1',
    imageFile: null as File | null,
    status: 'active'
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    const fetchCategories = async () => {
      try {
        const data = await apiClient.getCategories({ page_size: 100 });
        setCategories(data.results || []);
        if (data.results && data.results.length > 0) {
          setFormData(prev => ({ ...prev, category_id: data.results[0].id.toString() }));
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    
    fetchCategories();
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category_id', formData.category_id);
      data.append('price', formData.price);
      data.append('quantity', formData.quantity);
      data.append('status', formData.status);
      
      if (formData.imageFile) {
        data.append('image', formData.imageFile);
      }

      await apiClient.createProduct(data);
      router.push('/marketplace');
    } catch (error) {
      console.error(error);
      alert('Failed to list product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return null;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background py-12 px-4 gradient-background">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-black uppercase tracking-widest text-xs">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="glass-card rounded-[2.5rem] border border-border/50 overflow-hidden shadow-2xl">
            <div className="p-8 md:p-12 border-b border-border/30 bg-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 size-64 bg-primary/10 blur-[80px] rounded-full -mr-32 -mt-32" />
              <h1 className="text-4xl md:text-5xl font-black tracking-tight relative z-10">List New Product</h1>
              <p className="text-muted-foreground mt-2 font-medium relative z-10">Offer your handcrafted goods or farm fresh produce to the community.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
              {/* Basic Info */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 ml-1">
                    <Type size={14} className="text-primary" /> Product Title
                  </label>
                  <Input 
                    required
                    placeholder="e.g. Hand-Carved Oak Bench" 
                    className="h-16 rounded-2xl text-lg font-bold border-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-all shadow-sm"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 ml-1">
                            <Tag size={14} className="text-primary" /> Category
                        </label>
                        <select 
                            className="w-full h-16 rounded-2xl border-none ring-1 ring-border bg-background px-6 font-bold text-sm focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer shadow-sm"
                            value={formData.category_id}
                            onChange={e => setFormData({...formData, category_id: e.target.value})}
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 ml-1">
                            <ImageIcon size={14} className="text-primary" /> Product Image
                        </label>
                        <div className="relative group">
                            <Input 
                                type="file"
                                accept="image/*"
                                required
                                className="h-16 rounded-2xl border-none ring-1 ring-border font-medium pt-5 file:hidden cursor-pointer"
                                onChange={e => setFormData({...formData, imageFile: e.target.files?.[0] || null})}
                            />
                            {!formData.imageFile && (
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium pointer-events-none">
                                    Click to upload photo...
                                </span>
                            )}
                            {formData.imageFile && (
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary text-sm font-bold pointer-events-none truncate max-w-[80%]">
                                    {formData.imageFile.name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 ml-1">
                        <DollarSign size={14} className="text-primary" /> Price ($)
                    </label>
                    <Input 
                        required
                        type="number"
                        step="0.01"
                        placeholder="0.00" 
                        className="h-16 rounded-2xl text-xl font-black border-none ring-1 ring-border focus:ring-2 focus:ring-primary shadow-sm"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                    />
                </div>
                <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 ml-1">
                        <Package size={14} className="text-primary" /> Initial Quantity
                    </label>
                    <Input 
                        required
                        type="number"
                        placeholder="1" 
                        className="h-16 rounded-2xl text-xl font-black border-none ring-1 ring-border focus:ring-2 focus:ring-primary shadow-sm"
                        value={formData.quantity}
                        onChange={e => setFormData({...formData, quantity: e.target.value})}
                    />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 ml-1">
                  <Layout size={14} className="text-primary" /> Full Description
                </label>
                <textarea 
                  required
                  placeholder="Describe the materials, process, and story behind this product..."
                  className="w-full min-h-[250px] rounded-[2rem] border-none ring-1 ring-border bg-background p-8 font-medium leading-relaxed text-base focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="pt-8 flex flex-col sm:flex-row gap-4">
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary text-primary-foreground h-16 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      List Product Now
                    </>
                  )}
                </button>
                <Link href="/dashboard" className="sm:w-48">
                    <button type="button" className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] bg-muted/30 hover:bg-muted transition-all">
                        Cancel
                    </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
