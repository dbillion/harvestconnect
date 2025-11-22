'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import apiClient, { Artist } from '@/lib/api-client';
import { MapPin, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

// Fallback demo data using proper Artist structure
const DEMO_ARTISTS: Artist[] = [
  {
    id: 1,
    user: {
      id: 1,
      email: 'john@example.com',
      first_name: 'John',
      last_name: 'Miller',
      profile: {
        id: 1,
        user_id: 1,
        role: 'tradesman',
        bio: 'Master Plumber with 20+ years of experience',
        location: 'Community Area',
        verified: true,
        avatar: '',
      },
    },
    bio: 'Master Plumber with 20+ years of experience',
    featured_image: '',
    social_media: {},
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    user: {
      id: 2,
      email: 'sarah@example.com',
      first_name: 'Sarah',
      last_name: 'Jenkins',
      profile: {
        id: 2,
        user_id: 2,
        role: 'artisan',
        bio: 'Professional Landscape Designer',
        location: 'Community Hub District',
        verified: true,
        avatar: '',
      },
    },
    bio: 'Professional Landscape Designer specializing in sustainable gardens',
    featured_image: '',
    social_media: {},
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    user: {
      id: 3,
      email: 'emily@example.com',
      first_name: 'Emily',
      last_name: 'Carter',
      profile: {
        id: 3,
        user_id: 3,
        role: 'tradesman',
        bio: 'Licensed Electrician with certifications',
        location: 'Faith Community District',
        verified: true,
        avatar: '',
      },
    },
    bio: 'Licensed Electrician with safety certifications',
    featured_image: '',
    social_media: {},
    created_at: '2024-01-03T00:00:00Z',
  },
  {
    id: 4,
    user: {
      id: 4,
      email: 'michael@example.com',
      first_name: 'Michael',
      last_name: 'Anderson',
      profile: {
        id: 4,
        user_id: 4,
        role: 'artisan',
        bio: 'Expert carpenter creating custom pieces',
        location: 'Heritage Crafts District',
        verified: true,
        avatar: '',
      },
    },
    bio: 'Expert carpenter creating custom furniture and installations',
    featured_image: '',
    social_media: {},
    created_at: '2024-01-04T00:00:00Z',
  },
  {
    id: 5,
    user: {
      id: 5,
      email: 'james@example.com',
      first_name: 'James',
      last_name: 'Wilson',
      profile: {
        id: 5,
        user_id: 5,
        role: 'tradesman',
        bio: 'Roofing specialist with expertise',
        location: 'Community Service Area',
        verified: true,
        avatar: '',
      },
    },
    bio: 'Roofing specialist with expertise in all roof types',
    featured_image: '',
    social_media: {},
    created_at: '2024-01-05T00:00:00Z',
  },
  {
    id: 6,
    user: {
      id: 6,
      email: 'david@example.com',
      first_name: 'David',
      last_name: 'Chen',
      profile: {
        id: 6,
        user_id: 6,
        role: 'tradesman',
        bio: 'General contractor for all types',
        location: 'City Center',
        verified: true,
        avatar: '',
      },
    },
    bio: 'General contractor for renovations and custom projects',
    featured_image: '',
    social_media: {},
    created_at: '2024-01-06T00:00:00Z',
  },
];

export default function TradesmenDirectory() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProfile, setExpandedProfile] = useState<number | null>(null);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await apiClient.getArtists();
        const artistsArray = Array.isArray(data) ? data : (data.results || []);
        setArtists(artistsArray);
        setApiConnected(true);
      } catch (error) {
        console.error('Failed to fetch artists from API, using demo data:', error);
        setArtists(DEMO_ARTISTS);
        setApiConnected(false);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  // Filter artists by search
  const filtered = useMemo(() => {
    return artists.filter((artist) => {
      const firstName = artist.user.first_name.toLowerCase();
      const lastName = artist.user.last_name.toLowerCase();
      const bio = artist.bio.toLowerCase();
      const searchLower = searchTerm.toLowerCase();

      return (
        firstName.includes(searchLower) ||
        lastName.includes(searchLower) ||
        bio.includes(searchLower)
      );
    });
  }, [artists, searchTerm]);

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="bg-card py-12 px-4 sm:px-6 lg:px-8 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Find Skilled Artisans & Tradespeople</h1>
            <p className="text-muted-foreground max-w-2xl">
              Connect with trusted professionals in our community.
            </p>
            {!apiConnected && (
              <p className="text-sm mt-4 text-amber-600">⚪ Showing demo data (API unavailable)</p>
            )}
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <Input
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading artisans and tradespeople...</p>
            </div>
          ) : (
            <>
              {/* Profiles List */}
              <div className="space-y-4">
                {filtered.map((artist) => (
                  <ArtistCard
                    key={artist.id}
                    artist={artist}
                    isExpanded={expandedProfile === artist.id}
                    onToggle={() =>
                      setExpandedProfile(
                        expandedProfile === artist.id ? null : artist.id
                      )
                    }
                  />
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No artisans found matching your search.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

function ArtistCard({ artist, isExpanded, onToggle }: { readonly artist: Artist; readonly isExpanded: boolean; readonly onToggle: () => void }) {
  const fullName = `${artist.user.first_name} ${artist.user.last_name}`;
  const location = artist.user.profile?.location || 'Community';

  return (
    <Link href={`/tradesmen/${artist.id}`}>
      <div className="bg-card p-6 rounded-lg border border-border hover:border-primary transition cursor-pointer">
        <div className="flex gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-2xl">
            👤
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold text-foreground hover:text-primary transition">{fullName}</h3>
                <p className="text-sm text-primary font-medium">{artist.user.profile?.role || 'Artisan'}</p>
              </div>
            </div>

            {/* Bio */}
            {artist.bio && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {artist.bio}
              </p>
            )}

            {/* Location Info */}
            <div className="flex items-center gap-8 mb-4 pb-4 border-b border-border">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium text-foreground">{location}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3" role="group">
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <MessageSquare size={16} />
                Contact
              </Button>
              <Button 
                variant="outline" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggle();
                }}
              >
                View Profile
              </Button>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">About</p>
                    <p className="text-sm text-foreground">{artist.bio}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Member Since</p>
                    <p className="text-sm text-foreground">
                      {new Date(artist.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
