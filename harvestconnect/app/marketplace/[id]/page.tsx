'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { Button } from '@/components/ui/button';
import apiClient, { Product, Review } from '@/lib/api-client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError('');
      
      try {
        // Fetch product details
        const productData = await apiClient.getProduct(Number.parseInt(id, 10));
        setProduct(productData);

        // Fetch reviews for this product
        try {
          const reviewsData = await apiClient.getReviews();
          const productId = Number.parseInt(id, 10);
          // Handle both paginated and non-paginated responses
          const reviewsArray = Array.isArray(reviewsData) ? reviewsData : (reviewsData.results || []);
          const productReviews = reviewsArray.filter(
            (r: Review) => r.product_id === productId
          );
          setReviews(productReviews);
        } catch (err) {
          console.error('Error fetching reviews:', err);
          setReviews([]);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load product';
        setError(errorMessage);
        console.error('Error fetching product:', err);
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
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
            <Link href="/marketplace" className="text-green-600 hover:text-green-700 underline">
              Back to Marketplace
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : product.rating || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 bg-white py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <span>/</span>
            <Link href="/marketplace" className="hover:text-green-600">Marketplace</Link>
            <span>/</span>
            <span className="text-gray-900">{product.title}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <div className="bg-gray-100 rounded-lg overflow-hidden h-96 flex items-center justify-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400">
                  <p className="text-4xl mb-2">📦</p>
                  <p>No image available</p>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-lg">★</span>
                  <span className="font-semibold">{avgRating}</span>
                  <span className="text-gray-600 text-sm">
                    ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 text-lg mb-4">{product.description}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  ${product.price}
                </div>
                <p className="text-gray-600">
                  {product.quantity && product.quantity > 0
                    ? `${product.quantity} in stock`
                    : 'Out of stock'}
                </p>
              </div>

              {product.seller && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Sold by</p>
                  <p className="font-semibold text-gray-900">
                    {product.seller.first_name && product.seller.last_name
                      ? `${product.seller.first_name} ${product.seller.last_name}`
                      : `User #${product.seller.id}`}
                  </p>
                  {product.seller.profile?.bio && (
                    <p className="text-sm text-gray-600 mt-2">{product.seller.profile.bio}</p>
                  )}
                </div>
              )}

              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg mb-4">
                Add to Cart
              </Button>

              <Button variant="outline" className="w-full border-gray-300 text-gray-700 font-medium py-3 rounded-lg">
                Contact Seller
              </Button>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            
            {reviews.length === 0 ? (
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Reviewer #{review.reviewer_id}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm font-medium">
                            {review.rating}/5
                          </span>
                        </div>
                      </div>
                      {review.created_at && (
                        <p className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Back to Marketplace */}
          <div className="mt-12 text-center">
            <Link
              href="/marketplace"
              className="text-green-600 hover:text-green-700 font-medium underline"
            >
              ← Back to Marketplace
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
