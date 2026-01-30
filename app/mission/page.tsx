'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { Church, HandHelping, Heart, ShieldCheck, ShoppingBasket, Users } from 'lucide-react';
import Link from 'next/link';

export default function Mission() {
  return (
    <div className="relative w-full overflow-x-hidden min-h-screen">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-[#f8f5f2] to-[#eaddcf] dark:from-[#211a13] dark:to-[#16120e]"></div>

      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <section className="text-center mb-24 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl md:text-7xl font-black leading-tight tracking-tight text-foreground mb-6">
            Faith, Community, and Purpose
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
            Sowing seeds of connection between our church, local artisans, and wholesome producers for the flourishing of all.
          </p>
          <button className="mt-10 h-14 px-8 bg-primary text-primary-foreground rounded-full font-bold hover-scale shadow-xl shadow-primary/20">
            Explore Our Impact
          </button>
        </section>

        {/* Core Values */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="glass-card p-10 text-center hover-lift">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="size-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Rooted in Faith</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our work is guided by Christian principles of love, service, and integrity in every transaction.
            </p>
          </div>

          <div className="glass-card p-10 text-center hover-lift">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Users className="size-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Building Community</h3>
            <p className="text-muted-foreground leading-relaxed">
              We foster a supportive network that strengthens local economies and deepens relationships.
            </p>
          </div>

          <div className="glass-card p-10 text-center hover-lift">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Heart className="size-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Honest Stewardship</h3>
            <p className="text-muted-foreground leading-relaxed">
              A portion of every purchase is transparently dedicated to charitable initiatives and missions.
            </p>
          </div>
        </section>

        {/* The Cycle of Impact */}
        <section className="glass-card p-8 md:p-16 mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Every Purchase Makes a Difference</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We believe in the power of commerce to create positive change. A percentage of every sale funds community outreach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="text-center group">
              <div className="size-20 rounded-full border-2 border-primary bg-background flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110">
                <ShoppingBasket className="size-10 text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-2">1. You Purchase</h4>
              <p className="text-sm text-muted-foreground">Find unique goods and services from talented community members.</p>
            </div>

            <div className="text-center group">
              <div className="size-20 rounded-full border-2 border-primary bg-background flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110">
                <HandHelping className="size-10 text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-2">2. We Donate</h4>
              <p className="text-sm text-muted-foreground">A portion of the proceeds is automatically allocated to our Impact Fund.</p>
            </div>

            <div className="text-center group">
              <div className="size-20 rounded-full border-2 border-primary bg-background flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110">
                <Church className="size-10 text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-2">3. Community Thrives</h4>
              <p className="text-sm text-muted-foreground">Funds support local food banks, missions, and community-building events.</p>
            </div>
          </div>
        </section>

        {/* Featured Impact Case Study */}
        <section className="rounded-3xl overflow-hidden glass-card p-0 mb-24">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-16 flex flex-col justify-center gap-6">
              <span className="bg-primary/20 text-primary self-start px-4 py-1 rounded-full text-xs font-black uppercase">Mission in Action</span>
              <h2 className="text-3xl md:text-5xl font-black">Building Wells, Sowing Hope</h2>
              <p className="text-lg text-muted-foreground italic">
                "Through your purchases, we partnered with missionaries in rural Uganda to fund the construction of a new clean water well."
              </p>
              <p className="text-muted-foreground">
                This project now provides life-sustaining water to over 500 villagers, sharing the love of Christ through tangible action and prayer.
              </p>
              <button className="h-12 w-fit px-8 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary hover:text-white transition-all">
                Read Full Story
              </button>
            </div>
            <div className="relative aspect-square md:aspect-auto">
               <img 
                 src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1200" 
                 className="absolute inset-0 w-full h-full object-cover"
                 alt="Well in Uganda"
               />
            </div>
          </div>
        </section>

        <section className="text-center glass-card p-12 md:p-24 bg-primary/5">
           <h2 className="text-3xl md:text-5xl font-bold mb-6">Join Our Community of Purpose</h2>
           <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
             Whether you're looking to buy wholesome goods, sell your craft, or simply support a cause rooted in faith, you have a place here.
           </p>
           <Link href="/membership">
             <button className="h-14 px-12 bg-primary text-primary-foreground rounded-full font-bold hover-scale shadow-lg">
               Get Involved Today
             </button>
           </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
