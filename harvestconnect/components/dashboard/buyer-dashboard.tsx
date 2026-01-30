'use client';

import apiClient, { SavedItem } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { Heart, MessageSquare, ShoppingBag, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    purchased: 0,
    connections: 0,
    contributions: 0,
    spending: 0,
    categoryBreakdown: {} as Record<string, number>
  });
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, savedData] = await Promise.all([
          apiClient.getDashboardStats(),
          apiClient.getSavedItems()
        ]);
        
        const s = statsData.stats;
        setStats({
          purchased: s.purchased_count || 0,
          connections: s.saved_items_count || 0, // Mocking connections with saved items for now
          contributions: s.total_contributions || 0,
          spending: s.spending_total || 0,
          categoryBreakdown: s.category_breakdown || {}
        });
        setSavedItems(savedData.results.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch buyer stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const categories = [
    { label: 'Produce', color: 'bg-[#D9C4A1]' },
    { label: 'Crafts', color: 'bg-[#E57A44]' },
    { label: 'Services', color: 'bg-[#6B8EAD]' },
    { label: 'Bakery', color: 'bg-[#8A9A5B]' }
  ];

  const getMaxSpending = () => {
    const values = Object.values(stats.categoryBreakdown);
    return values.length > 0 ? Math.max(...values, 1) : 1;
  };

  return (
    <div className="relative min-h-screen bg-[#F0F2F5] pb-24">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-border/10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#1A1A1A]">
              Welcome back, {user?.first_name || 'Sarah'}!
            </h1>
            <p className="text-lg text-muted-foreground mt-2 font-medium">
              Here's an overview of your community activity and marketplace interactions.
            </p>
          </div>
          <Link href="/dashboard/profile">
            <div className="size-14 rounded-2xl overflow-hidden border-2 border-white shadow-lg bg-muted cursor-pointer hover:scale-105 transition-all">
              {user?.profile?.avatar ? (
                <img src={apiClient.getMediaUrl(user.profile.avatar)} alt="Profile" className="size-full object-cover" />
              ) : (
                <div className="size-full flex items-center justify-center bg-primary/10 text-primary">
                  <Star size={24} />
                </div>
              )}
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Area */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col">
                <p className="text-xs font-bold text-muted-foreground uppercase opacity-60 mb-2">Items Purchased</p>
                <h3 className="text-4xl font-black mb-1">{stats.purchased}</h3>
                <p className="text-xs font-bold text-orange-500">+2 this month</p>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col">
                <p className="text-xs font-bold text-muted-foreground uppercase opacity-60 mb-2">New Connections</p>
                <h3 className="text-4xl font-black mb-1">{stats.connections}</h3>
                <p className="text-xs font-bold text-blue-500">+5 this month</p>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col">
                <p className="text-xs font-bold text-muted-foreground uppercase opacity-60 mb-2">Total Contributions</p>
                <h3 className="text-4xl font-black mb-1">${stats.contributions.toFixed(2)}</h3>
                <p className="text-xs font-bold text-primary">+10% this month</p>
              </div>
            </div>

            {/* Marketplace Spending Chart */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="text-lg font-bold">Marketplace Spending</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black">${stats.spending.toLocaleString()}</span>
                    <span className="text-muted-foreground text-sm">This Month</span>
                  </div>
                </div>
                <div className="text-primary font-bold flex items-center gap-1">
                  <TrendingUp size={16} /> +15.2%
                </div>
              </div>

              <div className="flex items-end justify-between h-40 gap-4 sm:gap-8 px-4">
                {categories.map((cat, i) => {
                  const spent = stats.categoryBreakdown[cat.label] || 0;
                  const height = `${(spent / getMaxSpending()) * 100}%`;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4">
                      <div className={`w-full ${cat.color} rounded-xl transition-all duration-500`} style={{ height }} />
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{cat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* My Saved Items */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black tracking-tight">My Saved Items</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {savedItems.length > 0 ? (
                  savedItems.map((item, i) => (
                    <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm group hover:shadow-xl transition-all border border-transparent hover:border-border/50">
                      <img src={item.product.image || 'https://images.unsplash.com/photo-1464961144732-299539bf346f?q=80&w=400'} alt={item.product.title} className="h-44 w-full object-cover" />
                      <div className="p-5">
                        <p className="font-bold text-foreground mb-1">{item.product.title}</p>
                        <p className="text-xs text-muted-foreground mb-3">by {item.product.seller.first_name}</p>
                        <p className="font-black text-primary">${item.product.price}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 py-12 text-center bg-white rounded-3xl border-2 border-dashed border-border/50">
                    <p className="text-muted-foreground font-medium">No saved items yet. Explore the marketplace!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <Link href="/community/discovery" className="bg-white rounded-3xl p-8 shadow-sm flex flex-col items-center text-center group cursor-pointer hover:shadow-xl transition-all border border-transparent hover:border-border/10">
              <div className="size-24 rounded-full p-1 border-2 border-primary/20 mb-4 group-hover:scale-110 transition-transform">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400" alt="Maria" className="size-full rounded-full object-cover" />
              </div>
              <h4 className="text-lg font-black underline-offset-4 group-hover:underline">Featured Artisan: Maria</h4>
              <p className="text-xs font-bold text-[#8A9A5B] uppercase tracking-widest mt-1">Potter's Hand Ceramics</p>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed font-medium">
                "Creating beautiful, functional pottery is my passion. Each piece is made with love and prayer."
              </p>
              <div className="w-full bg-[#8A9A5B]/10 text-[#8A9A5B] py-3 rounded-xl font-bold mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More
              </div>
            </Link>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-black mb-6">Recent Activity</h3>
              <div className="space-y-6">
                {[
                  { act: 'Purchased Organic Apples', time: '2 hours ago', icon: <ShoppingBag size={18} />, color: 'bg-sand/10 text-sand-dark' },
                  { act: 'Sent a message to John the Carpenter', time: '1 day ago', icon: <MessageSquare size={18} />, color: 'bg-[#6B8EAD]/10 text-[#6B8EAD]' },
                  { act: 'Left a 5-star review for Daily Bread Bakery', time: '3 days ago', icon: <Star size={18} />, color: 'bg-[#E57A44]/10 text-[#E57A44]' },
                  { act: 'Saved item Hand-Knit Scarf', time: '4 days ago', icon: <Heart size={18} />, color: 'bg-primary/10 text-primary' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className={`size-10 rounded-full flex items-center justify-center ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-tight">{item.act}</p>
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mt-1 opacity-60">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
