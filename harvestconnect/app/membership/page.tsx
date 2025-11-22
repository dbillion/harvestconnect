'use client';

import React, { useState } from 'react';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

type PricingTier = {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  highlight?: boolean;
  features: string[];
  cta: string;
  charityPercentage: number;
};

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free Account',
    price: 0,
    period: 'always',
    description: 'For browsing the marketplace and connecting with creators.',
    features: [
      'Full marketplace access',
      'Connect with creators',
      'Standard newsletters',
      'Community event notifications',
    ],
    cta: 'Create Free Account',
    charityPercentage: 0,
  },
  {
    id: 'community-member',
    name: 'Community Member',
    price: 10,
    period: 'month',
    description: 'For active members looking for deeper engagement and value.',
    highlight: true,
    features: [
      'All Member benefits',
      'Member-exclusive discounts',
      'Direct messaging with producers',
      'Early access to new products',
      'Priority booking for services',
      '5% goes to Community Fund',
    ],
    cta: 'Become a Member',
    charityPercentage: 5,
  },
  {
    id: 'artisan-partner',
    name: 'Artisan Partner',
    price: 25,
    period: 'month',
    description: 'For creators and service providers looking to maximize reach.',
    features: [
      'All Community Member benefits',
      'Create your own storefront',
      'Promoted listing feature',
      'Access to business resources',
      'Advanced analytics dashboard',
      '10% goes to Community Fund',
    ],
    cta: 'Become a Partner',
    charityPercentage: 10,
  },
  {
    id: 'farmstead-patron',
    name: 'Farmstead Patron',
    price: 40,
    period: 'month',
    description: 'For serious producers and major community contributors.',
    features: [
      'All Artisan Partner benefits',
      'Bulk order management tools',
      'Premium storefront customization',
      'Direct support from our team',
      'Advanced marketing tools',
      'Featured seller badge',
      '15% goes to Community Fund',
    ],
    cta: 'Become a Patron',
    charityPercentage: 15,
  },
];

const BILLING_PERIODS = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'annual', label: 'Annually (Save 20%)' },
];

export default function Membership() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-card py-16 px-4 sm:px-6 lg:px-8 border-b border-border">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Become a Part of Our Community</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Choose a plan that fits your journey and helps our community flourish. By joining, you support local farmers, artisans, and our shared faith-based mission.
            </p>

            {/* Billing Toggle */}
            <div className="flex justify-center gap-4">
              {BILLING_PERIODS.map(period => (
                <button
                  key={period.id}
                  onClick={() => setBillingPeriod(period.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    billingPeriod === period.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRICING_TIERS.map(tier => (
                <PricingCard
                  key={tier.id}
                  tier={tier}
                  billingPeriod={billingPeriod}
                  isHighlight={tier.highlight}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Feature Comparison</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold text-foreground">Free</th>
                    <th className="text-center py-4 px-4 font-semibold text-foreground">Community</th>
                    <th className="text-center py-4 px-4 font-semibold text-foreground">Artisan</th>
                    <th className="text-center py-4 px-4 font-semibold text-foreground">Farmstead</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {comparisonFeatures.map((feature, idx) => (
                    <tr key={idx} className="hover:bg-background transition">
                      <td className="py-4 px-4 text-foreground font-medium">{feature.name}</td>
                      {feature.tiers.map((included, tierIdx) => (
                        <td key={tierIdx} className="text-center py-4 px-4">
                          {included ? (
                            <CheckCircle size={20} className="text-primary mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Community Impact */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Your Impact on Our Community</h2>

            <div className="bg-card p-8 rounded-lg border border-border mb-8">
              <h3 className="text-xl font-bold mb-6">Every Purchase Makes a Difference</h3>
              <p className="text-muted-foreground mb-6">
                We believe in commerce with purpose. A dedicated percentage of your membership goes directly to community outreach and charitable initiatives you care about.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {impactMetrics.map((metric, idx) => (
                  <div key={idx} className="bg-background p-6 rounded-lg border border-border">
                    <p className="text-3xl font-bold text-primary mb-2">{metric.value}</p>
                    <p className="text-sm text-foreground font-medium">{metric.label}</p>
                    <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Learn More About Our Impact
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Membership FAQs</h2>

            <div className="space-y-4">
              {membershipFaqs.map((faq, idx) => (
                <FAQItem key={idx} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-primary text-primary-foreground p-12 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
            <p className="text-lg opacity-90 mb-8">
              Choose the membership tier that best fits your journey. Cancel anytime with no questions asked.
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              View Membership Options
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function PricingCard({
  tier,
  billingPeriod,
  isHighlight,
}: {
  tier: PricingTier;
  billingPeriod: string;
  isHighlight?: boolean;
}) {
  const annualPrice = Math.floor(tier.price * 12 * 0.8);
  const displayPrice = billingPeriod === 'annual' ? annualPrice : tier.price;

  const highlightClasses = isHighlight
    ? 'bg-primary text-primary-foreground border-primary ring-2 ring-primary/20 transform scale-105'
    : 'bg-card text-foreground border-border hover:border-primary';

  return (
    <div className={`rounded-lg border transition-all ${highlightClasses}`}>
      <div className="p-6">
        {isHighlight && (
          <div className="bg-primary-foreground text-primary px-3 py-1 rounded-full text-xs font-semibold inline-block mb-4">
            Most Popular
          </div>
        )}

        <h3 className={`text-2xl font-bold mb-2 ${isHighlight ? 'text-primary-foreground' : 'text-foreground'}`}>
          {tier.name}
        </h3>
        <p className={`text-sm mb-4 ${isHighlight ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
          {tier.description}
        </p>

        <div className="mb-6">
          <span className="text-4xl font-bold">${displayPrice}</span>
          <span className={`ml-2 ${isHighlight ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
            {tier.period === 'always' ? '' : `/${billingPeriod === 'annual' ? 'year' : 'month'}`}
          </span>
        </div>

        {tier.charityPercentage > 0 && (
          <p
            className={`text-sm font-medium mb-6 ${
              isHighlight ? 'text-primary-foreground' : 'text-primary'
            }`}
          >
            {tier.charityPercentage}% goes to Community Fund
          </p>
        )}

        <Button
          className={`w-full mb-6 ${
            isHighlight
              ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {tier.cta}
        </Button>

        <div className="space-y-3">
          {tier.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <CheckCircle
                size={18}
                className={`flex-shrink-0 mt-0.5 ${isHighlight ? 'text-primary-foreground' : 'text-primary'}`}
              />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition"
      >
        <span className="font-semibold text-foreground text-left">{question}</span>
        <span className={`text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-border bg-card text-muted-foreground">
          {answer}
        </div>
      )}
    </div>
  );
}

const comparisonFeatures = [
  {
    name: 'Marketplace Access',
    tiers: [true, true, true, true],
  },
  {
    name: 'Member Discounts',
    tiers: [false, true, true, true],
  },
  {
    name: 'Direct Messaging',
    tiers: [false, true, true, true],
  },
  {
    name: 'Early Access to Products',
    tiers: [false, true, true, true],
  },
  {
    name: 'Create Storefront',
    tiers: [false, false, true, true],
  },
  {
    name: 'Promoted Listings',
    tiers: [false, false, true, true],
  },
  {
    name: 'Analytics Dashboard',
    tiers: [false, false, true, true],
  },
  {
    name: 'Business Resources',
    tiers: [false, false, true, true],
  },
  {
    name: 'Premium Customization',
    tiers: [false, false, false, true],
  },
  {
    name: 'Dedicated Support',
    tiers: [false, false, false, true],
  },
];

const impactMetrics = [
  {
    value: '$50K+',
    label: 'Community Fund',
    description: 'Distributed to local initiatives and charities',
  },
  {
    value: '200+',
    label: 'Active Sellers',
    description: 'Farmers, artisans, and tradespeople',
  },
  {
    value: '5K+',
    label: 'Happy Members',
    description: 'Supporting local commerce with purpose',
  },
];

const membershipFaqs = [
  {
    question: 'Can I change my membership tier?',
    answer:
      'You can upgrade or downgrade your membership at any time. Changes take effect on your next billing cycle, and we\'ll prorate any differences.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, PayPal, and bank transfers. Your payment information is secure and encrypted.',
  },
  {
    question: 'Is there a contract or long-term commitment?',
    answer:
      'No contracts. You can cancel your membership anytime with a single click. No hidden fees or questions asked.',
  },
  {
    question: 'How does the Community Fund work?',
    answer:
      'A percentage of every membership fee goes to our Community Fund, which we distribute quarterly to local food banks, mission organizations, and community development initiatives.',
  },
  {
    question: 'Do I get a discount if I prepay for a year?',
    answer:
      'Yes! Annual memberships save you 20% compared to monthly billing. You also get the satisfaction of supporting our mission for a full year.',
  },
];
