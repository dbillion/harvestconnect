'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { BadgeCheck, Hammer, HeartHandshake, Store, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function ForSellers() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-[#f8f7f4] via-[#e8f0e8] to-[#f2e8da] dark:from-[#211a13] dark:to-[#1a1c1a]"></div>
      
      <Navigation />

      <main>
        {/* Visual Hero */}
        <section className="relative h-[70vh] flex items-center justify-center text-center overflow-hidden">
           <img 
              src="https://images.unsplash.com/photo-1488459711615-2282097ba35a?auto=format&fit=crop&q=80&w=2000" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
              alt="Artisan workspace"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
           
           <div className="container relative z-10 mx-auto px-4">
              <div className="glass-card max-w-4xl mx-auto p-8 md:p-16 animate-in zoom-in duration-700">
                 <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 text-foreground text-balance">
                    Serve Your Community through Your Craft
                 </h1>
                 <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto mb-10">
                    Join a cooperative of local producers, artists, and skilled tradesmen. Connect with neighbors who value quality, integrity, and faith.
                 </p>
                 <Link href="/membership">
                   <button className="h-14 px-10 bg-primary text-primary-foreground rounded-xl font-bold hover-scale shadow-xl shadow-primary/20">
                      Become a Partner Today
                   </button>
                 </Link>
              </div>
           </div>
        </section>

        <section className="container mx-auto px-4 py-24">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">Why Sell on HarvestConnect?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Discover the unique advantages of joining a community-focused marketplace.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="glass-card p-10 text-center hover-lift group">
                 <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 transition-colors group-hover:bg-primary/20">
                    <Users className="size-8 text-primary" />
                 </div>
                 <h3 className="text-xl font-bold mb-3">Engaged Neighbors</h3>
                 <p className="text-muted-foreground text-sm leading-relaxed">
                    Connect with local church members who naturally prioritize supporting one another.
                 </p>
              </div>

              <div className="glass-card p-10 text-center hover-lift group">
                 <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 transition-colors group-hover:bg-primary/20">
                    <TrendingUp className="size-8 text-primary" />
                 </div>
                 <h3 className="text-xl font-bold mb-3">Built-in Marketing</h3>
                 <p className="text-muted-foreground text-sm leading-relaxed">
                    Get featured in our community newsletters and seasonal market spotlights automatically.
                 </p>
              </div>

              <div className="glass-card p-10 text-center hover-lift group">
                 <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 transition-colors group-hover:bg-primary/20">
                    <BadgeCheck className="size-8 text-primary" />
                 </div>
                 <h3 className="text-xl font-bold mb-3">Verified Excellence</h3>
                 <p className="text-muted-foreground text-sm leading-relaxed">
                    Build a reputation for quality craftsmanship through our community certification.
                 </p>
              </div>
              
              <div className="glass-card p-10 text-center hover-lift group">
                 <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 transition-colors group-hover:bg-primary/20">
                    <HeartHandshake className="size-8 text-primary" />
                 </div>
                 <h3 className="text-xl font-bold mb-3">Shared Mission</h3>
                 <p className="text-muted-foreground text-sm leading-relaxed">
                    Your transactions directly fund local food banks and community outreach programs.
                 </p>
              </div>
           </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 bg-primary/5">
           <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="glass-card p-8 flex flex-col gap-6">
                   <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                     <Store className="size-6 text-primary" />
                   </div>
                   <h3 className="text-2xl font-bold">For Artisans</h3>
                   <p className="text-muted-foreground">Showcase your handmade pottery, wood-carving, or preserves in a premium storefront.</p>
                </div>
                
                <div className="glass-card p-8 flex flex-col gap-6">
                   <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                     <Hammer className="size-6 text-primary" />
                   </div>
                   <h3 className="text-2xl font-bold">For Tradesmen</h3>
                   <p className="text-muted-foreground">List your plumbing, electrical, or carpentry services to a trusted local network.</p>
                </div>
                
                <div className="glass-card p-8 flex flex-col gap-6">
                   <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                     <Users className="size-6 text-primary" />
                   </div>
                   <h3 className="text-2xl font-bold">For Farmers</h3>
                   <p className="text-muted-foreground">Manage seasonal produce, CSA shares, and farm bundles with ease.</p>
                </div>
              </div>
           </div>
        </section>

        {/* Simple Process */}
        <section className="py-24 container mx-auto px-4 text-center">
           <h2 className="text-4xl font-bold mb-16">Three Simple Steps</h2>
           <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-primary/10 hidden md:block"></div>
              <div className="relative z-10 space-y-4">
                 <div className="size-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto text-2xl font-black">1</div>
                 <h4 className="font-bold text-xl">Create</h4>
                 <p className="text-muted-foreground">Set up your profile and tell your story in minutes.</p>
              </div>
              <div className="relative z-10 space-y-4">
                 <div className="size-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto text-2xl font-black">2</div>
                 <h4 className="font-bold text-xl">Connect</h4>
                 <p className="text-muted-foreground">List your goods or services to the community.</p>
              </div>
              <div className="relative z-10 space-y-4">
                 <div className="size-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto text-2xl font-black">3</div>
                 <h4 className="font-bold text-xl">Serve</h4>
                 <p className="text-muted-foreground">Fulfill neighbors' needs and build lasting ties.</p>
              </div>
           </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 container mx-auto px-4">
           <div className="glass-card p-12 md:p-24 bg-primary text-primary-foreground text-center">
              <h2 className="text-3xl md:text-5xl font-black mb-6">Ready to Share Your Gift?</h2>
              <p className="text-lg opacity-80 max-w-2xl mx-auto mb-10">Join a marketplace where quality matters, integrity is expected, and community is the result.</p>
              <Link href="/membership">
                <button className="h-14 px-12 bg-white text-primary rounded-xl font-bold hover-scale shadow-lg">
                   Get Started Personally
                </button>
              </Link>
           </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
