import Link from 'next/link';
import { HarvestLogo } from './ui/harvest-logo';

export default function Footer() {
  return (
    <footer className="relative bg-card border-t border-border mt-24 py-16 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute bottom-0 right-0 size-96 bg-primary/5 blur-[100px] rounded-full -mb-48 -mr-24" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 relative z-10">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <HarvestLogo className="size-8 text-primary" />
              <span className="text-2xl font-black text-foreground tracking-tighter">HarvestConnect</span>
            </Link>
            <p className="text-muted-foreground font-medium leading-relaxed max-w-xs">
              Nourishing community, one connection at a time. Connecting faith, farms, and artisan craft.
            </p>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-6">Marketplace</h3>
            <ul className="space-y-4">
              <li><Link href="/marketplace" className="text-muted-foreground hover:text-primary font-medium transition-colors">Browse Products</Link></li>
              <li><Link href="/seasonal-markets" className="text-muted-foreground hover:text-primary font-medium transition-colors">Seasonal Markets</Link></li>
              <li><Link href="/community-hub" className="text-muted-foreground hover:text-primary font-medium transition-colors">Community Hub</Link></li>
              <li><Link href="/membership" className="text-muted-foreground hover:text-primary font-medium transition-colors">Pricing & Membership</Link></li>
            </ul>
          </div>

          {/* Mission */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-6">Our Mission</h3>
            <ul className="space-y-4">
              <li><Link href="/mission" className="text-muted-foreground hover:text-primary font-medium transition-colors">Why We Exist</Link></li>
              <li><Link href="/for-sellers" className="text-muted-foreground hover:text-primary font-medium transition-colors">For Sellers</Link></li>
              <li><Link href="/tradesmen" className="text-muted-foreground hover:text-primary font-medium transition-colors">Local Tradesmen</Link></li>
              <li><Link href="/artists" className="text-muted-foreground hover:text-primary font-medium transition-colors">Featured Artists</Link></li>
            </ul>
          </div>

          {/* Social / Support */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-6">Support</h3>
            <ul className="space-y-4">
              <li><Link href="/mission" className="text-muted-foreground hover:text-primary font-medium transition-colors">Contact Us</Link></li>
              <li><Link href="/membership" className="text-muted-foreground hover:text-primary font-medium transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-medium">
          <p>&copy; {new Date().getFullYear()} HarvestConnect. Built for the Kingdom.</p>
          <div className="flex gap-8">
            <Link href="/mission" className="hover:text-primary">Privacy</Link>
            <Link href="/mission" className="hover:text-primary">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
