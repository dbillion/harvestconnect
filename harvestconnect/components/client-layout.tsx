'use client';

import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import { Analytics } from '@vercel/analytics/react';
import { ToastProvider } from '@/components/ui/toast';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          {children}
          <Analytics />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  )
}
