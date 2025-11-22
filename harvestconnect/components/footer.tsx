import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌾</span>
              <span className="font-bold text-lg">HarvestConnect</span>
            </div>
            <p className="text-sm opacity-90">
              Nourishing community, one connection at a time.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link href="/marketplace" className="hover:opacity-100 transition">Marketplace</Link></li>
              <li><Link href="/community-hub" className="hover:opacity-100 transition">Community Hub</Link></li>
              <li><Link href="/membership" className="hover:opacity-100 transition">Membership</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link href="/mission" className="hover:opacity-100 transition">Our Mission</Link></li>
              <li><Link href="/about" className="hover:opacity-100 transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:opacity-100 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link href="/privacy" className="hover:opacity-100 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:opacity-100 transition">Terms of Service</Link></li>
              <li><Link href="/faq" className="hover:opacity-100 transition">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm opacity-90">
          <p>&copy; 2025 HarvestConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
