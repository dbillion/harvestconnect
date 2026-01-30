'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { Input } from '@/components/ui/input';
import apiClient from '@/lib/api-client';
import { ExternalLink, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

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

const SPECIALIZATIONS = [
  { id: 'pottery', label: 'Pottery' },
  { id: 'textiles', label: 'Textiles' },
  { id: 'woodcraft', label: 'Woodcraft' },
  { id: 'painting', label: 'Painting' },
  { id: 'jewelry', label: 'Jewelry' },
  { id: 'other', label: 'Other' },
];


export default function ArtistGallery() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpec, setSelectedSpec] = useState<string | null>(null);
  const [commissionOnly, setCommissionOnly] = useState(false);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await apiClient.getArtists({ page_size: 100 });
        setArtists(data.results || []);
      } catch (error) {
        console.error('Failed to fetch artists:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  const filtered = useMemo(() => {
    return artists.filter(artist => {
      const name = artist.name || `${artist.user?.first_name || ''} ${artist.user?.last_name || ''}`.trim() || artist.user?.email || 'Anonymous';
      const bio = artist.bio || '';
      const specialty = artist.specialty || '';
      
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bio.toLowerCase().includes(searchTerm.toLowerCase());
      
      const artistSpec = artist.specialization || (artist.user?.profile?.role === 'artisan' ? 'other' : null);
      const matchesSpec = !selectedSpec || artistSpec === selectedSpec;
      const matchesCommission = !commissionOnly || artist.availableForCommission;
      
      return matchesSearch && matchesSpec && matchesCommission;
    });
  }, [artists, searchTerm, selectedSpec, commissionOnly]);

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

function ArtistCard({ artist }: { artist: any }) {
  const name = artist.name || `${artist.user?.first_name || ''} ${artist.user?.last_name || ''}`.trim() || artist.user?.email || 'Anonymous';
  const bio = artist.bio || (artist.user?.profile?.bio) || 'Dedicated artisan serving the community.';
  const specialty = artist.specialty || (artist.user?.profile?.role === 'artisan' ? 'Handcrafted Goods' : 'Local Producer');
  const image = artist.image || artist.featured_image || artist.user?.profile?.avatar || `https://ui-avatars.com/api/?name=${name}&background=random&size=400`;
  const rating = artist.rating || 5.0;
  const reviews = artist.reviews || 0;
  const portfolioItems = artist.portfolioItems || 12;

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary transition-all group hover:shadow-xl">
      <Link href={`/tradesmen/${artist.id}`}>
        {/* Image */}
        <div className="h-48 bg-muted overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">{name}</h3>
            <p className="text-sm text-primary font-black uppercase tracking-widest text-[10px]">{specialty}</p>
          </div>

          {/* Bio */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 font-medium">{bio}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-border">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Portfolio</p>
              <p className="font-bold text-foreground text-sm">{portfolioItems} pieces</p>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={10}
                    className={i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-muted'}
                  />
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{rating} ({reviews})</p>
            </div>
          </div>

          {/* Commission Badge */}
          {artist.availableForCommission && (
            <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-center mb-4 border border-primary/20">
              Available for Commissions
            </div>
          )}

          {/* Actions */}
          <button className="w-full btn-secondary h-11 text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-all flex items-center justify-center gap-2">
            <ExternalLink size={14} />
            View Profile
          </button>
        </div>
      </Link>
    </div>
  );
}
