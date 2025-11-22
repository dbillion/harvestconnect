import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Mission() {
  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-card py-20 px-4 sm:px-6 lg:px-8 border-b border-border">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Faith, Community, and Purpose</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Sowing seeds of connection between our church, local artisans, and wholesome producers for the flourishing of all.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Our Core Values</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {coreValues.map((value, idx) => (
                <div key={idx} className="bg-card p-8 rounded-lg border border-border text-center hover:border-primary transition">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6 text-3xl">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Every Purchase Makes a Difference */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Every Purchase Makes a Difference</h2>

            <div className="bg-primary/5 border border-primary/20 p-12 rounded-lg mb-8">
              <div className="flex items-center justify-between mb-6">
                <span className="font-semibold text-foreground">1. You Purchase</span>
                <span className="text-primary">→</span>
                <span className="font-semibold text-foreground">2. We Donate</span>
                <span className="text-primary">→</span>
                <span className="font-semibold text-foreground">3. Community Thrives</span>
              </div>
              <p className="text-muted-foreground">
                Find unique goods and services from talented members of our community. A portion of the proceeds is automatically allocated to our Impact Fund.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {impactFlow.map((item, idx) => (
                <div key={idx} className="bg-background p-6 rounded-lg border border-border">
                  <p className="text-4xl font-bold text-primary mb-2">{item.number}</p>
                  <h3 className="font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stories of Impact */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Stories of Impact</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {impactStories.map((story, idx) => (
                <div key={idx} className="bg-card p-8 rounded-lg border border-border">
                  <p className="text-lg font-bold text-primary mb-3">"{story.highlight}"</p>
                  <p className="text-muted-foreground mb-6 italic">
                    {story.story}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full"></div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{story.name}</p>
                      <p className="text-xs text-muted-foreground">{story.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Initiatives */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Our Community Initiatives</h2>

            <div className="space-y-8">
              {initiatives.map((initiative, idx) => (
                <div key={idx} className="bg-background p-8 rounded-lg border border-border flex gap-6">
                  <div className="text-4xl flex-shrink-0">{initiative.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{initiative.title}</h3>
                    <p className="text-muted-foreground mb-3">{initiative.description}</p>
                    <p className="text-sm font-medium text-primary">{initiative.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-primary text-primary-foreground p-12 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Community of Purpose</h2>
            <p className="text-lg opacity-90 mb-8">
              Whether you're a buyer, seller, or simply someone passionate about faith-driven commerce, there's a place for you here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/membership">
                <Button className="bg-white text-primary hover:bg-white/90">
                  View Membership
                </Button>
              </Link>
              <Link href="/for-sellers">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Become a Seller
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

const coreValues = [
  {
    icon: '✨',
    title: 'Rooted in Faith',
    description:
      'Our work is guided by Christian principles of love, service, and integrity in every transaction.',
  },
  {
    icon: '🤝',
    title: 'Building Community',
    description:
      'We foster a supportive network that strengthens local economies and deepens relationships.',
  },
  {
    icon: '🛡️',
    title: 'Honest Stewardship',
    description:
      'A portion of every purchase is transparently dedicated to charitable initiatives and community missions.',
  },
];

const impactFlow = [
  {
    number: '1',
    title: 'You Purchase',
    description: 'Find unique goods and services from talented members of our community.',
  },
  {
    number: '2',
    title: 'We Donate',
    description: 'A portion of the proceeds is automatically allocated to our Impact Fund.',
  },
  {
    number: '3',
    title: 'Community Thrives',
    description: 'Funds support local food banks, missions, and community-building events.',
  },
];

const impactStories = [
  {
    highlight: "It's more than a marketplace—it's a ministry.",
    story:
      'The support from HarvestConnect for our food pantry has been incredible. We\'ve been able to serve dozens more families this year thanks to the generous contributions from marketplace sellers and community members.',
    name: 'Pastor Mike R.',
    role: 'Community Partner',
  },
  {
    highlight: 'This platform has been a blessing.',
    story:
      'It connected me with so many wonderful families who truly appreciate quality and faith-driven values. We\'ve been able to share our family\'s bounty and expand beyond what we imagined.',
    name: 'Sarah L.',
    role: 'Local Farmer',
  },
  {
    highlight: 'I love knowing my shopping has purpose.',
    story:
      'I love knowing my weekly shopping supports local families and missions abroad. It brings meaning to life for me. I know my money is going somewhere that matters.',
    name: 'Jennifer T.',
    role: 'Shopper',
  },
];

const initiatives = [
  {
    icon: '🍎',
    title: 'Local Food Security',
    description:
      'We partner with food banks and community organizations to ensure no one in our community goes without access to nutritious food.',
    impact: 'This year alone, we\'ve distributed 10,000+ lbs of fresh produce to families in need.',
  },
  {
    icon: '🌍',
    title: 'Global Mission Support',
    description:
      'A portion of our Community Fund supports missionary work and development projects in underserved regions worldwide.',
    impact: 'Last year, we funded water well construction projects serving 5,000+ people in rural communities.',
  },
  {
    icon: '📚',
    title: 'Skill Development & Training',
    description:
      'We invest in workshops, apprenticeships, and educational programs to help artisans and farmers grow their craft.',
    impact: 'Over 150 community members have participated in our free skill-building workshops this year.',
  },
  {
    icon: '🏘️',
    title: 'Community Building Events',
    description:
      'Regular gatherings, seasonal markets, and celebrations that strengthen bonds and celebrate our shared values.',
    impact: 'Our Harvest Festival attracted 3,000+ community members and raised $25,000 for local causes.',
  },
];
