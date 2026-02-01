import Stripe from 'stripe';

// Only initialize Stripe if we're in a server environment and have the secret key
let stripe: Stripe | null = null;

if (typeof window === 'undefined') {
  // Server-side only
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover' as any,
      appInfo: {
        name: 'HarvestConnect',
        version: '0.1.0',
      },
    });
  }
}

export { stripe };
