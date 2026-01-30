'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { useCart } from '@/lib/cart-context';
import { ArrowRight, CheckCircle, Home, Package } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart when the user reaches the success page
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex flex-col bg-background gradient-background">
      <Navigation />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-2xl w-full glass-card p-12 text-center animate-in fade-in zoom-in duration-700">
           <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="size-12 text-primary" />
           </div>
           
           <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Order Confirmed!</h1>
           <p className="text-xl text-muted-foreground mb-12 font-medium">
             Thank you for your purchase. Your order has been placed successfully and the artisans have been notified.
           </p>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="glass-card p-6 text-left flex items-start gap-4">
                 <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package className="text-primary size-5" />
                 </div>
                 <div>
                    <h4 className="font-bold mb-1">Order Details</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">A confirmation email has been sent to your registered address with the full receipt.</p>
                 </div>
              </div>
              <div className="glass-card p-6 text-left flex items-start gap-4">
                 <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-primary size-5" />
                 </div>
                 <div>
                    <h4 className="font-bold mb-1">Impact Made</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Part of this purchase goes directly to supporting our local cooperative funds.</p>
                 </div>
              </div>
           </div>

           <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace">
                 <button className="btn-primary flex items-center gap-2 px-10 h-14">
                    Continue Shopping
                    <ArrowRight size={18} />
                 </button>
              </Link>
              <Link href="/">
                 <button className="btn-secondary flex items-center gap-2 px-10 h-14">
                    <Home size={18} />
                    Back to Home
                 </button>
              </Link>
           </div>
           
           <div className="mt-16 pt-12 border-t border-primary/10">
              <p className="text-sm text-muted-foreground font-medium italic">
                "Blessed is the one who considers the poor! In the day of trouble the Lord delivers him."
              </p>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
