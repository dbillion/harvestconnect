import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Check if stripe is properly initialized
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment processing is not configured' },
        { status: 500 }
      );
    }

    const { items, type = 'payment', billingPeriod = 'monthly', productId } = await req.json();

    let sessionParams: any = {
      payment_method_types: ['card'],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cart`,
    };

    if (type === 'subscription' && productId) {
      // Handle Membership Subscription
      const isAnnual = billingPeriod === 'annual';
      const amount = req.headers.get('x-amount'); // Optional: pass amount from frontend if needed, but safer to calculate here
      
      // Map product IDs to their recurring prices
      const priceMap: Record<string, { monthly: number; annual: number }> = {
        'prod_Tt2AamXfcMta64': { monthly: 1000, annual: 9600 },
        'prod_Tt2A8RObbRncm2': { monthly: 2500, annual: 24000 },
        'prod_Tt2ANMdZhZhJmn': { monthly: 4000, annual: 38400 },
      };

      const pricing = priceMap[productId];
      const unit_amount = isAnnual ? pricing.annual : pricing.monthly;

      sessionParams = {
        ...sessionParams,
        mode: 'subscription',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product: productId,
              unit_amount,
              recurring: {
                interval: isAnnual ? 'year' : 'month',
              },
            },
            quantity: 1,
          },
        ],
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/membership`,
      };
    } else {
      // Handle Standard Cart Checkout
      if (!items || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
      }

      const line_items = items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            images: item.image ? [item.image] : [],
            description: `Product from HarvestConnect marketplace`,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      sessionParams = {
        ...sessionParams,
        mode: 'payment',
        line_items,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
