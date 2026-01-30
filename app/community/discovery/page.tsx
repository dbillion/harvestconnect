'use client';

import CommunityHub from '@/components/community/community-hub';
import { Sparkles } from 'lucide-react';

export default function CommunityDiscovery() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] p-6 lg:p-12">
      <div className="max-w-[1600px] mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between px-4 gap-6">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Sparkles size={14} />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Regional Network</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#1A1A1A]">The Commons.</h1>
              <p className="text-lg md:text-xl font-medium text-muted-foreground mt-2 max-w-xl">Where community connects, shares, and grows through shared purposes and local trade.</p>
           </div>
           <div className="flex items-center gap-4 bg-white p-2 rounded-[2.5rem] shadow-sm border border-border/10">
              <button className="px-10 py-5 rounded-[2rem] bg-[#1A1A1A] text-white font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all hover:bg-primary active:scale-95">
                 Initialize New Hub
              </button>
           </div>
        </header>

        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
           <CommunityHub />
        </section>
      </div>
    </div>
  );
}
