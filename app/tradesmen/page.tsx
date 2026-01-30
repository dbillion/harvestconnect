'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { BadgeCheck, Hammer, MessageSquare, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function TradesmenSellers() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-[#f8f7f4] via-[#e8f0e8] to-[#f2e8da] dark:from-[#211a13] dark:to-[#1a1c1a]"></div>
      
      <Navigation />

      <main>
        {/* Visual Hero */}
        <section className="relative h-[80vh] flex items-center justify-center text-center overflow-hidden">
           <img 
              src="https://images.unsplash.com/photo-1540103711724-ebf833bde8d0?auto=format&fit=crop&q=80&w=2000" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
              alt="Artisan workspace"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
           
           <div className="container relative z-10 mx-auto px-4">
              <div className="glass-card max-w-4xl mx-auto p-8 md:p-16 animate-in zoom-in duration-700">
                 <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 text-foreground">
                    Grow Your Craft, Serve Your Community
                 </h1>
                 <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto mb-10">
                    Join our cooperative platform connecting local farmers, artisans, and tradesmen with an engaged community that values purpose and quality.
                 </p>
                 <Link href="/membership">
                   <button className="h-14 px-10 bg-primary text-primary-foreground rounded-xl font-bold hover-scale shadow-xl shadow-primary/20">
                      Become a Seller Today
                   </button>
                 </Link>
              </div>
           </div>
        </section>

        <section className="container mx-auto px-4 py-24">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">Why Partner With Us?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Discover the unique advantages of joining a community-focused marketplace.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-10 text-center hover-lift group">
                 <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 transition-colors group-hover:bg-primary/20">
                    <Users className="size-8 text-primary" />
                 </div>
                 <h3 className="text-xl font-bold mb-3">Engaged Community</h3>
                 <p className="text-muted-foreground text-sm leading-relaxed">
                    Connect with local church members who value quality, natural products, and skilled services.
                 </p>
              </div>

              <div className="glass-card p-10 text-center hover-lift group">
                 <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 transition-colors group-hover:bg-primary/20">
                    <TrendingUp className="size-8 text-primary" />
                 </div>
                 <h3 className="text-xl font-bold mb-3">Sustained Growth</h3>
                 <p className="text-muted-foreground text-sm leading-relaxed">
                    We help you reach a wider audience through our platform's built-in promotional tools and fair algorithms.
                 </p>
              </div>

              <div className="glass-card p-10 text-center hover-lift group">
                 <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 transition-colors group-hover:bg-primary/20">
                    <BadgeCheck className="size-8 text-primary" />
                 </div>
                 <h3 className="text-xl font-bold mb-3">Trusted Identity</h3>
                 <p className="text-muted-foreground text-sm leading-relaxed">
                    Gain credibility through our community verification and faith-driven values.
                 </p>
              </div>
           </div>
        </section>

        {/* Tailored Tools Section */}
        <section className="py-24 bg-primary/5">
           <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                 <div className="space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black leading-tight">Your Platform, Your Passion</h2>
                    
                    <div className="space-y-6">
                       <div className="flex gap-4 glass-card p-6 border-l-4 border-l-primary">
                          <div className="flex-shrink-0 size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                             <Hammer className="size-6 text-primary" />
                          </div>
                          <div>
                             <h4 className="font-bold text-lg">For Local Tradesmen</h4>
                             <p className="text-sm text-muted-foreground">List your services, manage bookings, and communicate directly with neighbors in need of your skills.</p>
                          </div>
                       </div>
                       
                       <div className="flex gap-4 glass-card p-6">
                          <div className="flex-shrink-0 size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                             <MessageSquare className="size-6 text-primary" />
                          </div>
                          <div>
                             <h4 className="font-bold text-lg">Direct Mediation</h4>
                             <p className="text-sm text-muted-foreground">Clear communication tools to discuss project details, timelines, and fair pricing without middle-men.</p>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="relative">
                    <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
                    <img 
                       src="https://images.unsplash.com/photo-1541604193435-22287d32c2c2?auto=format&fit=crop&q=80&w=1200" 
                       className="rounded-2xl shadow-2xl relative z-10 glass-card p-2"
                       alt="Craftsman at work"
                    />
                 </div>
              </div>
           </div>
        </section>

        {/* Quote Section */}
        <section className="py-24 container mx-auto px-4">
           <div className="glass-card p-12 md:p-24 text-center max-w-5xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-6xl text-primary/10 font-black">""</div>
              <p className="text-2xl md:text-3xl font-medium italic mb-8 relative z-10">
                 "As a woodworker, finding the right audience is key. Here, I've found customers who value craftsmanship and faith. The support from the community has been incredible."
              </p>
              <div className="flex flex-col items-center gap-2">
                 <h4 className="text-xl font-bold">David M.</h4>
                 <p className="text-primary font-black uppercase tracking-wider text-xs">Custom Furniture Designer</p>
              </div>
           </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
