'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { mockData } from '@/lib/mock-data';
import { AlertCircle, CheckCircle2, Database, Layout, Newspaper, Package, PlayCircle, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SimulationPage() {
  const [useMock, setUseMock] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [stats, setStats] = useState({
    products: 0,
    articles: 0,
    categories: 0,
    artists: 0
  });

  useEffect(() => {
    const mock = localStorage.getItem('harvestconnect_use_mock') === 'true';
    setUseMock(mock);
    
    // Load current stats if any
    setStats({
      products: mockData.products.length,
      articles: mockData.blogPosts.length,
      categories: mockData.categories.length,
      artists: mockData.artists.length
    });
  }, []);

  const toggleMock = () => {
    const newValue = !useMock;
    setUseMock(newValue);
    localStorage.setItem('harvestconnect_use_mock', String(newValue));
    
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
      // Reload page to apply changes across app
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background gradient-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Simulation Dashboard</h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Manage frontend simulation and mock data for HarvestConnect.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Status Section */}
          <section className="glass-card p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className={`size-12 rounded-2xl flex items-center justify-center ${useMock ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
                  <Database className="size-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Backend Simulation</h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    {useMock ? 'Currently simulating backend with local data' : 'Connecting to real backend API'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={toggleMock}
                className={`px-8 py-3 rounded-xl font-black transition-all ${
                  useMock 
                    ? 'bg-destructive/10 text-destructive hover:bg-destructive hover:text-white' 
                    : 'bg-primary text-primary-foreground hover:scale-105 active:scale-95 shadow-lg shadow-primary/20'
                }`}
              >
                {useMock ? 'Disable Simulation' : 'Enable Simulation'}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 bg-card/40 rounded-2xl border border-primary/5 text-center">
                <Package className="size-5 mx-auto mb-2 text-primary" />
                <span className="block text-2xl font-black">{stats.products}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Products</span>
              </div>
              <div className="p-6 bg-card/40 rounded-2xl border border-primary/5 text-center">
                <Newspaper className="size-5 mx-auto mb-2 text-primary" />
                <span className="block text-2xl font-black">{stats.articles}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Articles</span>
              </div>
              <div className="p-6 bg-card/40 rounded-2xl border border-primary/5 text-center">
                <Layout className="size-5 mx-auto mb-2 text-primary" />
                <span className="block text-2xl font-black">{stats.categories}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Categories</span>
              </div>
              <div className="p-6 bg-card/40 rounded-2xl border border-primary/5 text-center">
                <Database className="size-5 mx-auto mb-2 text-primary" />
                <span className="block text-2xl font-black">{stats.artists}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Artists</span>
              </div>
            </div>
          </section>

          {/* Integration Status */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-8">
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <PlayCircle className="size-5 text-primary" />
                Live Pages
              </h4>
              <div className="space-y-4">
                {[
                  { name: 'Marketplace', path: '/marketplace', status: 'ready' },
                  { name: 'Community Hub', path: '/community-hub', status: 'ready' },
                  { name: 'Seasonal Markets', path: '/seasonal-markets', status: 'ready' },
                  { name: 'Tradesmen', path: '/tradesmen', status: 'ready' },
                  { name: 'Artists', path: '/artists', status: 'ready' }
                ].map((page) => (
                  <div key={page.path} className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50">
                    <span className="font-bold">{page.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-secondary">
                        <CheckCircle2 className="size-3" /> Ready
                      </span>
                      <a href={page.path} className="text-xs font-black text-primary hover:underline">View Page</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-8 bg-primary/5 border-primary/20">
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
                <RefreshCw className="size-5" />
                Quick Actions
              </h4>
              <p className="text-sm text-muted-foreground mb-6 font-medium"> Use these to quickly test different app states when backend is disconnected. </p>
              <div className="space-y-3">
                <button className="w-full p-4 bg-white/50 hover:bg-white rounded-xl text-left font-bold text-sm transition-all border border-border flex items-center justify-between">
                  Force Backend Error <AlertCircle className="size-4 text-destructive" />
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full p-4 bg-white/50 hover:bg-white rounded-xl text-left font-bold text-sm transition-all border border-border flex items-center justify-between"
                >
                  Reload Application <RefreshCw className="size-4 text-primary" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
      
      {status === 'loading' && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="text-center">
            <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-black text-xl">Updating App State...</p>
          </div>
        </div>
      )}
    </div>
  );
}
