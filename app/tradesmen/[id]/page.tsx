'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { Button } from '@/components/ui/button';
import apiClient, { Artist, Product } from '@/lib/api-client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ArtistDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [artist, setArtist] = useState<Artist | null>(null);
  const [artistProducts, setArtistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      setError('');

      try {
        // Fetch artist details
        const artistData = await apiClient.getArtist(Number.parseInt(id, 10));
        setArtist(artistData);

        // Fetch products for this artist/seller
        try {
          const productsData = await apiClient.getProducts();
          // Handle both paginated and non-paginated responses
          const productsArray = Array.isArray(productsData) ? productsData : (productsData.results || []);
          const sellerProducts = productsArray.filter(
            (p: Product) => p.seller?.id === artistData.user.id
          );
          setArtistProducts(sellerProducts);
        } catch (err) {
          console.error('Error fetching products:', err);
          setArtistProducts([]);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load artist details';
        setError(errorMessage);
        console.error('Error fetching artist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Loading artist details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Artist not found'}</p>
            <Link href="/tradesmen" className="text-green-600 hover:text-green-700 underline">
              Back to Artists & Tradesmen
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 bg-white py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <span>/</span>
            <Link href="/tradesmen" className="hover:text-green-600">
              Artists & Tradesmen
            </Link>
            <span>/</span>
            <span className="text-gray-900">
              {artist.user.first_name} {artist.user.last_name}
            </span>
          </div>

          {/* Artist Profile Header */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* Avatar/Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-4xl">
                  👤
                </div>
              </div>

              {/* Artist Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {artist.user.first_name} {artist.user.last_name}
                </h1>

                {artist.user && (
                  <p className="text-gray-600 mb-4">
                    <span className="font-medium">Member since:</span> {new Date(artist.created_at).getFullYear()}
                  </p>
                )}

                {artist.bio && (
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {artist.bio}
                  </p>
                )}

                <div className="flex gap-3">
                  <Button className="bg-green-600 hover:bg-green-700 text-white font-medium">
                    Contact Artist
                  </Button>
                  <Button variant="outline" className="border-gray-300 text-gray-700">
                    View Shop
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Artist Products Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Featured Products ({artistProducts.length})
            </h2>

            {artistProducts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  This artist hasn't listed any products yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artistProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/marketplace/${product.id}`}
                    className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all"
                  >
                    {/* Product Image */}
                    <div className="bg-gray-100 h-48 overflow-hidden flex items-center justify-center group-hover:bg-gray-200 transition">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <span className="text-4xl">📦</span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">
                          ${product.price}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm font-medium">
                            {product.rating || 'N/A'}
                          </span>
                        </div>
                      </div>

                      {product.quantity && product.quantity > 0 ? (
                        <p className="text-xs text-green-600 mt-2">In Stock</p>
                      ) : (
                        <p className="text-xs text-red-600 mt-2">Out of Stock</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* About Section */}
          <div className="mt-12 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">About This Artist</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                {artist.bio ||
                  'This talented artisan brings passion and expertise to every creation. Their products reflect years of dedication to quality craftsmanship.'}
              </p>
              <p>
                {artist.user.first_name} {artist.user.last_name} is part of the HarvestConnect community, dedicated to supporting local commerce and sustainable practices.
              </p>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-12 text-center">
            <Link
              href="/tradesmen"
              className="text-green-600 hover:text-green-700 font-medium underline"
            >
              ← Back to Artists & Tradesmen
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
