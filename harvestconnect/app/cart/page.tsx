'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { useCart } from '@/lib/cart-context';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate checkout');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'An unexpected error occurred during checkout');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background gradient-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md w-full glass-card p-12 text-center">
            <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
               <ShoppingBag className="size-10 text-primary" />
            </div>
            <h1 className="text-3xl font-black mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link href="/marketplace">
              <button className="btn-primary w-full">
                Browse Marketplace
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background gradient-background">
      <Navigation />

      <main className="flex-1 py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-12 flex items-center gap-4">
            Shopping Cart
            <span className="text-lg font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">{totalItems} items</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="glass-card p-6 flex items-center gap-6 group">
                   <div className="size-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                           <ShoppingBag className="text-muted-foreground/30" />
                        </div>
                      )}
                   </div>
                   
                   <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{item.title}</h3>
                         <button 
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                         >
                            <Trash2 size={18} />
                         </button>
                      </div>
                      <p className="text-xl font-black mb-4">${item.price}</p>
                      
                      <div className="flex items-center gap-4">
                         <div className="flex items-center border rounded-lg h-10">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 hover:bg-muted transition-colors"
                            >
                               <Minus size={14} />
                            </button>
                            <span className="w-10 text-center font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 hover:bg-muted transition-colors"
                            >
                               <Plus size={14} />
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-6">
                 <Link href="/marketplace" className="text-primary font-bold flex items-center gap-2 hover:underline">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Continue Shopping
                 </Link>
                 <button 
                  onClick={clearCart}
                  className="text-sm text-muted-foreground hover:text-destructive font-bold transition-colors"
                 >
                    Clear Cart
                 </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
               <div className="glass-card p-8 sticky top-32">
                  <h2 className="text-2xl font-black mb-8">Order Summary</h2>
                  
                  <div className="space-y-4 mb-8">
                     <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span className="font-bold text-foreground">${totalPrice.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span className="font-bold text-primary">FREE</span>
                     </div>
                     <div className="flex justify-between text-muted-foreground">
                        <span>Estimated Tax</span>
                        <span className="font-bold text-foreground">$0.00</span>
                     </div>
                  </div>
                  
                  <div className="border-t border-primary/10 pt-6 mb-10">
                     <div className="flex justify-between items-end">
                        <span className="text-lg font-bold">Total Amount</span>
                        <span className="text-3xl font-black text-primary">${totalPrice.toFixed(2)}</span>
                     </div>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="btn-primary w-full h-14 flex items-center justify-center gap-3 relative overflow-hidden"
                  >
                     {isCheckingOut ? (
                       <>
                         <div className="animate-spin size-5 border-2 border-white border-t-transparent rounded-full" />
                         <span>Processing...</span>
                       </>
                     ) : (
                       <>
                         <span>Proceed to Checkout</span>
                         <ArrowRight size={20} />
                       </>
                     )}
                  </button>
                  
                  <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                     <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
                     Secure Checkout with Stripe
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
