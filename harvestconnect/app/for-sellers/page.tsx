'use client';

import React from 'react';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, BarChart3, Heart, Zap, Shield } from 'lucide-react';

export default function ForSellers() {
  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              Grow Your Craft, Serve Your Community
            </h1>
            <p className="text-xl opacity-90 mb-8 text-balance">
              Join our cooperative platform connecting local farmers, artisans, and tradesmen with an engaged community that values purpose and quality.
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Become a Seller
            </Button>
          </div>
        </section>

        {/* Why Partner With Us */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Why Partner With Us?</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Discover the unique advantages of joining a community-focused marketplace.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="bg-card p-8 rounded-lg border border-border text-center hover:border-primary transition">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <benefit.icon className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Your Platform Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Your Platform, Your Passion</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Tools and features tailored to your unique craft.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Farmers Tab */}
              <SellerTypeCard
                title="For Farmers"
                description="Nourish the Community"
                features={[
                  'Easily list and manage seasonal produce',
                  'Create a beautiful farm profile to tell your story',
                  'Engage with customers through CSA program tools',
                ]}
                image="/placeholder.svg?key=farmers"
              />

              {/* Tradesmen Tab */}
              <SellerTypeCard
                title="For Tradesmen"
                description="Share Your Expertise"
                features={[
                  'Showcase your skills with portfolio and service listings',
                  'Get discovered by customers needing your specific trade',
                  'Manage bookings and client relationships easily',
                ]}
                image="/placeholder.svg?key=tradesmen"
              />

              {/* Artists Tab */}
              <SellerTypeCard
                title="For Artists"
                description="Celebrate Your Creations"
                features={[
                  'Build a stunning portfolio to display your work',
                  'Accept custom commissions through the platform',
                  'Connect with collectors who value craftsmanship',
                ]}
                image="/placeholder.svg?key=artists"
              />
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Getting Started Is Simple</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Three easy steps to launch your presence on HarvestConnect.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {getStartedSteps.map((step, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  <p className="text-sm text-primary font-medium">{step.detail}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Start Selling Today
              </Button>
            </div>
          </div>
        </section>

        {/* Voices of Our Community */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Voices of Our Community</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, idx) => (
                <TestimonialCard key={idx} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-primary text-primary-foreground p-12 rounded-lg text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Share Your Gifts?</h2>
            <p className="text-lg opacity-90 mb-8">
              Join a marketplace where your work is valued and your faith is celebrated. Create your free profile today and start connecting with community.
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Start Selling Today
            </Button>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Common Questions</h2>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <FAQItem key={idx} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function SellerTypeCard({
  title,
  description,
  features,
  image,
}: {
  title: string;
  description: string;
  features: string[];
  image: string;
}) {
  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden hover:border-primary transition">
      <div className="h-40 bg-muted overflow-hidden">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 text-foreground">{title}</h3>
        <p className="text-primary font-medium mb-4">{description}</p>
        <ul className="space-y-3">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonials)[0] }) {
  return (
    <div className="bg-background border border-border p-8 rounded-lg">
      <p className="text-muted-foreground italic mb-6">"{testimonial.quote}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-muted rounded-full"></div>
        <div>
          <p className="font-semibold text-foreground">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
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
        <div className="px-6 py-4 border-t border-border bg-background text-muted-foreground">
          {answer}
        </div>
      )}
    </div>
  );
}

const benefits = [
  {
    icon: Users,
    title: 'Engaged Community',
    description: 'Connect with local church members, neighbors, and customers who naturally appreciate quality, craftsmanship, and purpose-driven business.',
  },
  {
    icon: BarChart3,
    title: 'Marketing Support',
    description: 'We help you reach a wider audience through our promotional tools in promotional tools, newsletters, and social features.',
  },
  {
    icon: Heart,
    title: 'Charitable Impact',
    description: 'A portion of every transaction supports local charitable initiatives, so your work directly helps your community flourish.',
  },
  {
    icon: Zap,
    title: 'Easy Setup',
    description: 'Get started in minutes without complex fees or lengthy approval processes. We believe in removing barriers.',
  },
  {
    icon: Shield,
    title: 'Safe Transactions',
    description: 'Secure payment processing and dispute resolution so you can focus on your craft with peace of mind.',
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Join a network of fellow sellers. Share tips, celebrate wins, and grow together as a community.',
  },
];

const getStartedSteps = [
  {
    title: 'Create Your Profile',
    description: 'Sign up in minutes and tell your story. Showcase your farm, trade, or artistry.',
    detail: 'Easily list and manage seasonal produce',
  },
  {
    title: 'List Your Offerings',
    description: 'Add your products, services, or artwork with photos, descriptions, and pricing.',
    detail: 'Add your products, services, or artwork with photos',
  },
  {
    title: 'Connect & Serve',
    description: 'Engage with community members, manage orders, and grow your local presence.',
    detail: 'Engage with customers through our platform tools',
  },
];

const testimonials = [
  {
    quote:
      "This platform has been a blessing. It connected me with so many wonderful families and truly appreciates quality and faith-driven values. We've been able to share our family's bounty and expand beyond what we imagined.",
    name: 'Sarah J.',
    role: 'Local Farmer',
  },
  {
    quote:
      "As a woodworker, finding the right audience is key. Here, I've found customers who value craftsmanship and faith. The support from the community has been incredible.",
    name: 'David M.',
    role: 'Tradesman',
  },
  {
    quote:
      "The support from HarvestConnect for our food pantry has been incredible. We've been able to serve dozens more families this year thanks to the generous contributions from marketplace sellers and community members.",
    name: 'Pastor Mike R.',
    role: 'Community Partner',
  },
  {
    quote:
      "I love knowing my weekly shopping supports local families and missions abroad. It brings meaning to life for me.",
    name: 'Jennifer T.',
    role: 'Shopper',
  },
];

const faqs = [
  {
    question: 'What are the fees to sell on HarvestConnect?',
    answer:
      'We keep it simple and fair. A small transaction fee helps us maintain the platform and support our community initiatives. No hidden fees or monthly subscriptions. Most sellers find the value far outweighs the cost.',
  },
  {
    question: 'How do I set up my seller profile?',
    answer:
      'Creating a profile is straightforward and takes about 10 minutes. You\'ll add your basic information, upload photos, describe your products or services, and set your pricing. Our team is here to help if you need guidance.',
  },
  {
    question: 'Can I sell multiple types of products?',
    answer:
      'Many sellers offer a variety of items. You can organize them by category to make it easy for customers to browse. Whether you\'re a farmer with multiple crops, an artist with different mediums, or a tradesman with various services, we support it.',
  },
  {
    question: 'How do payments work?',
    answer:
      'Payments are processed securely through our platform and deposited into your account within 2-3 business days. You have full visibility into all transactions through your seller dashboard.',
  },
  {
    question: 'What if I have a problem with an order?',
    answer:
      'Our support team is here to help resolve any issues. We have a fair dispute resolution process that protects both buyers and sellers. Most issues are resolved quickly and amicably.',
  },
];
