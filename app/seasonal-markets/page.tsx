'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { Calendar, MapPin } from 'lucide-react';

const UPCOMING_MARKETS = [
  {
    id: 'spring',
    status: 'NOW ACTIVE',
    title: 'Spring Market: A Fresh Start',
    date: 'April 27th, 2024',
    time: '9:00 AM - 3:00 PM',
    location: 'Grace Church Meadow',
    description: 'Celebrate the new season with fresh produce, handmade crafts, and blooming flowers.',
    image: 'https://images.unsplash.com/photo-1488459711615-2282097ba35a?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'thanksgiving',
    status: 'UPCOMING',
    title: 'Thanksgiving Harvest Feast',
    date: 'Nov 23rd, 2024',
    time: '10:00 AM - 4:00 PM',
    location: 'Community Center Grounds',
    description: 'A bountiful gathering to stock up on all your local holiday essentials.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad3d399b?auto=format&fit=crop&q=80&w=1200'
  }
];

const VENDORS = [
  { name: "Sarah's Sourdough", specialty: "Artisan Breads", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400" },
  { name: "Earthen Vessels", specialty: "Handcrafted Pottery", image: "https://images.unsplash.com/photo-1493106641515-d99691238914?auto=format&fit=crop&q=80&w=400" },
  { name: "Honey From the Rock", specialty: "Local Raw Honey", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400" },
  { name: "Good Woodworking", specialty: "Custom Furniture", image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=400" }
];

export default function SeasonalMarkets() {
  return (
    <div className="min-h-screen bg-background gradient-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
           <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-foreground mb-6">
            Seasonal Markets
           </h1>
           <p className="max-w-3xl mx-auto text-lg md:text-xl font-light text-muted-foreground leading-relaxed">
            Gather in community to celebrate the seasons. Discover local, natural, and handmade goods from our trusted family of creators.
           </p>
        </div>

        {/* Featured Market Banner */}
        <section className="glass-card overflow-hidden mb-24 -mt-8 relative z-10 transition-transform hover:shadow-2xl">
           <div className="grid md:grid-cols-2 lg:grid-cols-5 items-stretch">
              <div className="lg:col-span-2 relative h-80 md:h-auto">
                 <img 
                    src={UPCOMING_MARKETS[0].image} 
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Market Banner"
                 />
                 <div className="absolute top-6 left-6">
                    <span className="bg-primary text-primary-foreground text-xs font-black px-4 py-2 rounded-full shadow-lg">
                        {UPCOMING_MARKETS[0].status}
                    </span>
                 </div>
              </div>
              <div className="lg:col-span-3 p-8 lg:p-16 flex flex-col justify-center gap-6">
                 <h2 className="text-3xl md:text-4xl font-black text-foreground">{UPCOMING_MARKETS[0].title}</h2>
                 <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-muted-foreground font-bold">
                        <Calendar className="size-5 text-primary" />
                        {UPCOMING_MARKETS[0].date} | {UPCOMING_MARKETS[0].time}
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground font-bold">
                        <MapPin className="size-5 text-primary" />
                        {UPCOMING_MARKETS[0].location}
                    </div>
                 </div>
                 <p className="text-lg text-muted-foreground leading-relaxed">
                    {UPCOMING_MARKETS[0].description}
                 </p>
                 <div className="flex flex-wrap gap-4 mt-4">
                    <button className="h-12 px-8 bg-primary text-primary-foreground rounded-xl font-bold hover-scale shadow-lg">
                        Get Your Entry Pass
                    </button>
                    <button className="h-12 px-8 glass-card border-primary/20 hover:bg-primary/10 transition-all font-bold">
                        Directions
                    </button>
                 </div>
              </div>
           </div>
        </section>

        {/* Vendor Grid */}
        <section className="py-20 border-t border-border">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">Meet Our Vendors</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">The heart and soul of our markets. Faith-driven creators you can trust.</p>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {VENDORS.map((v, i) => (
                <div key={i} className="glass-card p-4 group cursor-pointer hover-lift">
                   <div className="aspect-square rounded-lg overflow-hidden mb-4 relative">
                      <img src={v.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                   <h3 className="font-bold text-lg">{v.name}</h3>
                   <p className="text-sm text-muted-foreground mb-4">{v.specialty}</p>
                   <span className="text-xs font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View Stall &rarr;</span>
                </div>
              ))}
           </div>
        </section>

        {/* FAQ / What to Expect */}
        <section className="py-20 grid md:grid-cols-2 gap-16 items-center">
           <div>
              <h2 className="text-4xl font-bold mb-8">What to Expect</h2>
              <div className="space-y-4">
                 {['Organic Selection', 'Artisan Workshops', 'Live Community Music', 'Children Playground'].map((item, i) => (
                    <div key={i} className="glass-card p-6 flex justify-between items-center group cursor-pointer hover:bg-white/40">
                       <span className="font-black text-xl text-foreground/80 group-hover:text-primary transition-colors">{item}</span>
                       <span className="material-symbols-outlined text-primary">add_circle</span>
                    </div>
                 ))}
              </div>
           </div>
           <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full" />
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
                className="rounded-2xl shadow-2xl relative z-10 glass-card p-2"
                alt="Market"
              />
           </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
