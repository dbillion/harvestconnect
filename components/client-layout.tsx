'use client';

import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import { Analytics } from '@vercel/analytics/react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <Analytics />
      </CartProvider>
    </AuthProvider>
  )
}
