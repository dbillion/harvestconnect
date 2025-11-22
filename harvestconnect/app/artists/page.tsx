'use client';

import { useState, useMemo } from 'react';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, ExternalLink } from 'lucide-react';

type Artist = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  image: string;
  portfolioItems: number;
  rating: number;
  reviews: number;
  specialization: 'pottery' | 'textiles' | 'woodcraft' | 'painting' | 'jewelry' | 'other';
  availableForCommission: boolean;
};

const ARTISTS: Artist[] = [
  {
    id: '1',
    name: 'Maria Rodriguez',
    specialty: 'Handcrafted Pottery',
    bio: 'From humble beginnings to masterpiece. Maria shares her passion for pottery and the faith that guides her hands in her craft.',
    image: '/placeholder.svg?key=mxrix',
    portfolioItems: 45,
    rating: 5,
    reviews: 34,
    specialization: 'pottery',
    availableForCommission: true,
  },
  {
    id: '2',
    name: 'Elena Vasquez',
    specialty: 'Textile Weaving',
    bio: 'Preserving traditional weaving techniques while creating contemporary designs that tell stories of our community.',
    image: '/placeholder.svg?key=un7zm',
    portfolioItems: 28,
    rating: 4.9,
    reviews: 22,
    specialization: 'textiles',
    availableForCommission: true,
  },
  {
    id: '3',
    name: 'Thomas Wright',
    specialty: 'Wood Carving',
    bio: 'Transforming reclaimed wood into functional art that celebrates the beauty of nature and craftsmanship.',
    image: '/placeholder.svg?key=h8xmt',
    portfolioItems: 52,
    rating: 4.8,
    reviews: 41,
    specialization: 'woodcraft',
    availableForCommission: true,
  },
  {
    id: '4',
    name: 'Sophie Martineau',
    specialty: 'Watercolor Painting',
    bio: 'Capturing the essence of our community through vibrant watercolor landscapes and portraits inspired by faith.',
    image: '/placeholder.svg?key=cjgkt',
    portfolioItems: 38,
    rating: 4.7,
    reviews: 18,
    specialization: 'painting',
    availableForCommission: false,
  },
  {
    id: '5',
    name: 'James Liu',
    specialty: 'Jewelry Design',
    bio: 'Creating bespoke jewelry that combines traditional techniques with modern design sensibilities.',
    image: '/placeholder.svg?key=4uhl9',
    portfolioItems: 61,
    rating: 4.9,
    reviews: 53,
    specialization: 'jewelry',
    availableForCommission: true,
  },
  {
    id: '6',
    name: 'Rebecca Green',
    specialty: 'Mixed Media Art',
    bio: 'Exploring the intersection of sustainability and creativity through mixed media installations and sculptures.',
    image: '/placeholder.svg?key=fiqpb',
    portfolioItems: 35,
    rating: 4.8,
    reviews: 29,
    specialization: 'other',
    availableForCommission: true,
  },
];

const SPECIALIZATIONS = [
  { id: 'pottery', label: 'Pottery' },
  { id: 'textiles', label: 'Textiles' },
  { id: 'woodcraft', label: 'Woodcraft' },
  { id: 'painting', label: 'Painting' },
  { id: 'jewelry', label: 'Jewelry' },
  { id: 'other', label: 'Other' },
];

export default function ArtistGallery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpec, setSelectedSpec] = useState<string | null>(null);
  const [commissionOnly, setCommissionOnly] = useState(false);

  const filtered = useMemo(() => {
    return ARTISTS.filter(artist => {
      const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           artist.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           artist.bio.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpec = !selectedSpec || artist.specialization === selectedSpec;
      const matchesCommission = !commissionOnly || artist.availableForCommission;
      return matchesSearch && matchesSpec && matchesCommission;
    });
  }, [searchTerm, selectedSpec, commissionOnly]);

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="bg-card py-12 px-4 sm:px-6 lg:px-8 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Featured Artisans Gallery</h1>
            <p className="text-muted-foreground max-w-2xl">
              Discover the work of talented artists from our community. Browse portfolios, commission pieces, and support local creativity.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1">
              <div className="bg-card p-6 rounded-lg border border-border sticky top-20">
                <h2 className="font-semibold text-lg mb-6">Filter</h2>

                {/* Specialization */}
                <div className="mb-6 pb-6 border-b border-border">
                  <p className="text-sm font-medium text-foreground mb-3">Specialization</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="spec"
                        checked={selectedSpec === null}
                        onChange={() => setSelectedSpec(null)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm text-foreground">All Artists</span>
                    </label>
                    {SPECIALIZATIONS.map(spec => (
                      <label key={spec.id} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="spec"
                          value={spec.id}
                          checked={selectedSpec === spec.id}
                          onChange={() => setSelectedSpec(spec.id)}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-sm text-foreground">{spec.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Commission Filter */}
                <label className="flex items-center gap-3 cursor-pointer mb-6">
                  <input
                    type="checkbox"
                    checked={commissionOnly}
                    onChange={(e) => setCommissionOnly(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span className="text-sm text-foreground">Available for Commissions</span>
                </label>
              </div>
            </aside>

            {/* Artists Grid */}
            <div className="lg:col-span-4">
              {/* Search Bar */}
              <div className="mb-8">
                <Input
                  placeholder="Search artists or artworks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(artist => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No artists found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary transition group">
      {/* Image */}
      <div className="h-48 bg-muted overflow-hidden">
        <img
          src={artist.image || "/placeholder.svg"}
          alt={artist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">{artist.name}</h3>
          <p className="text-sm text-primary font-medium">{artist.specialty}</p>
        </div>

        {/* Bio */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{artist.bio}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-border">
          <div>
            <p className="text-xs text-muted-foreground">Portfolio</p>
            <p className="font-bold text-foreground">{artist.portfolioItems} pieces</p>
          </div>
          <div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(artist.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted'}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{artist.rating} ({artist.reviews})</p>
          </div>
        </div>

        {/* Commission Badge */}
        {artist.availableForCommission && (
          <div className="bg-primary/10 text-primary px-3 py-2 rounded text-sm font-medium text-center mb-4">
            Available for Commissions
          </div>
        )}

        {/* Actions */}
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2">
          <ExternalLink size={16} />
          View Portfolio
        </Button>
      </div>
    </div>
  );
}
