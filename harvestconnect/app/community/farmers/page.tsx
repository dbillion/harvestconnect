'use client';

import apiClient from '@/lib/api-client';
import { Church, Filter, Grid, Map as MapIcon, Search, User } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import map to avoid SSR issues with Leaflet
const FarmersMap = dynamic(() => import('@/components/map/farmers-map'), { 
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-muted animate-pulse rounded-[2.5rem]" />
});


export default function FarmersExplore() {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'map'>('map');

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        // In this system, farmers are Users with role 'farmer'
        // We'll fetch users and filter, or use a dedicated endpoint if available
        const res = await apiClient.get<any>('users/');
        // Expecting { results: [...] } or direct array
        const allUsers = Array.isArray(res) ? res : (res.results || []);
        setFarmers(allUsers.filter((u: any) => u.profile?.role === 'farmer'));
      } catch (error) {
        console.error('Failed to fetch farmers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tight text-foreground">Find Your Farmer</h1>
            <p className="text-lg text-muted-foreground font-medium max-w-xl">
              Support local families and find the freshest produce from farmers in your church and neighborhood.
            </p>
          </div>
          
          <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-border/10">
            <button 
              onClick={() => setView('map')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${view === 'map' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <MapIcon size={18} /> Map View
            </button>
            <button 
              onClick={() => setView('grid')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${view === 'grid' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <Grid size={18} /> Grid View
            </button>
          </div>
        </header>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 relative">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
             <input 
                type="text" 
                placeholder="Search by name, church, or location..."
                className="w-full h-16 bg-white border-none rounded-2xl pl-14 pr-6 font-medium shadow-sm focus:ring-2 focus:ring-primary/20 transition-all"
             />
          </div>
          <button className="h-16 bg-white border border-border/10 rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-muted/50 transition-all">
            <Church size={20} className="text-primary" /> Filter by Church
          </button>
          <button className="h-16 bg-white border border-border/10 rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-muted/50 transition-all">
            <Filter size={20} className="text-primary" /> Advanced Filters
          </button>
        </div>

        {/* Content Area */}
        <div className="relative">
          {view === 'map' ? (
            <FarmersMap farmers={farmers} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
               {farmers.map(farmer => (
                 <div key={farmer.id} className="glass-card group overflow-hidden border border-border/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                    <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                       <div className="absolute -bottom-10 left-6">
                          <div className="size-20 rounded-[1.5rem] border-4 border-white bg-muted overflow-hidden shadow-lg">
                             {farmer.profile?.avatar ? (
                               <img src={farmer.profile.avatar} className="size-full object-cover" />
                             ) : <User size={40} className="m-auto text-muted-foreground" /> }
                          </div>
                       </div>
                    </div>
                    <div className="p-8 pt-14 space-y-4">
                       <div>
                          <h3 className="text-xl font-black">{farmer.first_name} {farmer.last_name}</h3>
                          <p className="text-xs font-bold text-primary flex items-center gap-1 mt-1">
                             <Church size={12} /> {farmer.profile?.home_church || 'Harvest Member'}
                          </p>
                       </div>
                       <p className="text-sm text-muted-foreground line-clamp-2 font-medium">
                          {farmer.profile?.bio || "Committed to sustainable farming and community growth."}
                       </p>
                       <div className="flex items-center gap-2 pt-2">
                          <MapPin size={14} className="text-muted-foreground" />
                          <span className="text-xs font-bold text-muted-foreground">{farmer.profile?.location}</span>
                       </div>
                       <button className="w-full bg-[#1A1A1A] text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-[#333] transition-all">
                          Visit Marketplace
                       </button>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function MapPin({ size, className }: { size: number, className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
}
