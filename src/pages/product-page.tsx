import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  ExternalLink,
  Package,
  Truck,
  Shield,
  Share2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { IProductDetails } from '../interfaces/IProduct';
import {
  getProductDetails,
  getProductFromCache,
} from '../services/medicine.service';
import useMouseTracking from '../hooks/use-mouse-tracking';
import Navbar from '../components/common/navbar';
import { useToastContext } from '../contexts/toast-context';

export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const mousePosition = useMouseTracking();
  const { addToast } = useToastContext();
  const [product, setProduct] = useState<IProductDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [particles] = useState(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
      size: 0.1 + Math.random() * 0.2,
    })),
  );

  const SERPAPI_KEY = import.meta.env.VITE_SERPAPI_KEY;

  if (!SERPAPI_KEY) {
    console.error('VITE_SERPAPI_KEY is not defined. Check your .env file.');
  }

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId || !SERPAPI_KEY) {
        setError('Product ID or API key not available');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const productDetails = await getProductDetails(productId, SERPAPI_KEY);
        setProduct(productDetails);
        setError(null);
      } catch (err) {
        console.error('Error fetching product details:', err);
        if (
          err instanceof Error &&
          err.message.includes('Please search for products first')
        ) {
          setError(
            'Product details not available. Please return to the marketplace and search for products first.',
          );
        } else {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to fetch product details',
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, SERPAPI_KEY]);

  const handleBack = () => {
    navigate('/marketplace');
  };

  const handleImageChange = (direction: 'prev' | 'next') => {
    if (!product?.images?.length) return;

    if (direction === 'prev') {
      setSelectedImageIndex((prev) =>
        prev === 0 ? product.images!.length - 1 : prev - 1,
      );
    } else {
      setSelectedImageIndex((prev) =>
        prev === product.images!.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      addToast('Product link copied to clipboard!', {
        type: 'success',
        title: 'Link Copied',
        duration: 3000,
      });
    } catch (error) {
      addToast('Failed to copy link to clipboard', {
        type: 'error',
        title: 'Copy Failed',
        duration: 3000,
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < Math.floor(rating)
            ? 'text-amber-400 fill-current'
            : 'text-gray-400'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          background:
            'linear-gradient(to bottom right, var(--background-dark), var(--primary-purple-darker), var(--tertiary-indigo-darker))',
          fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
        }}
      >
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div
            className="backdrop-blur-xl border rounded-2xl p-12 shadow-2xl"
            style={{
              background: 'var(--background-glass)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="w-16 h-16 border-4 border-purple-300/30 border-t-purple-300 rounded-full animate-spin"></div>
              </div>
              <h3 className="text-purple-200 font-medium mb-2">
                Loading Product Details
              </h3>
              <p className="text-purple-300/70 text-sm">
                Please wait while we fetch the information...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          background:
            'linear-gradient(to bottom right, var(--background-dark), var(--primary-purple-darker), var(--tertiary-indigo-darker))',
          fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
        }}
      >
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div
            className="backdrop-blur-xl border rounded-2xl p-12 shadow-2xl max-w-md"
            style={{
              background: 'var(--error-red-100)',
              borderColor: 'var(--border-error)',
            }}
          >
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">Product Not Found</h3>
              <p className="text-red-200 text-sm mb-6">
                {error || 'Unable to load product details'}
              </p>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105"
                style={{
                  background:
                    'linear-gradient(to right, var(--primary-purple), var(--secondary-pink))',
                }}
              >
                <ArrowLeft size={18} />
                Back to Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.thumbnail];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          'linear-gradient(to bottom right, var(--background-dark), var(--primary-purple-darker), var(--tertiary-indigo-darker))',
        fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
      }}
    >
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ background: 'var(--primary-purple-500)' }}
        ></div>
        <div
          className="absolute top-1/3 right-0 w-80 h-80 rounded-full blur-3xl animate-pulse [animation-delay:1s]"
          style={{ background: 'var(--secondary-pink-300)' }}
        ></div>
        <div
          className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full blur-3xl animate-pulse [animation-delay:2s]"
          style={{ background: 'var(--tertiary-indigo-400)' }}
        ></div>
      </div>

      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, var(--primary-purple-200) 0%, transparent 50%)`,
        }}
      ></div>

      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}rem`,
              height: `${particle.size}rem`,
              animation: `particleFloat ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
              background: 'var(--text-secondary)',
            }}
          />
        ))}
      </div>

      <Navbar />

      <main className="relative z-10 min-h-screen pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg border transition-all duration-200 hover:scale-105 text-purple-200"
            style={{
              background: 'var(--background-glass)',
              borderColor: 'var(--border-default)',
            }}
          >
            <ArrowLeft size={18} />
            Back to Marketplace
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div
              className="backdrop-blur-xl border rounded-2xl p-6 shadow-2xl"
              style={{
                background: 'var(--background-glass)',
                borderColor: 'var(--border-default)',
              }}
            >
              <div className="relative mb-4">
                <div className="aspect-square rounded-xl overflow-hidden bg-white/5 flex items-center justify-center">
                  <img
                    src={images[selectedImageIndex]}
                    alt={product.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        'https://placehold.co/500x500/1e293b/94a3b8?text=No+Image';
                    }}
                  />
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => handleImageChange('prev')}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full border backdrop-blur-sm transition-all duration-200 hover:scale-110 text-white"
                      style={{
                        background: 'var(--background-glass)',
                        borderColor: 'var(--border-default)',
                      }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => handleImageChange('next')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full border backdrop-blur-sm transition-all duration-200 hover:scale-110 text-white"
                      style={{
                        background: 'var(--background-glass)',
                        borderColor: 'var(--border-default)',
                      }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImageIndex === index
                          ? 'border-purple-400'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            'https://placehold.co/64x64/1e293b/94a3b8?text=No+Image';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div
                className="backdrop-blur-xl border rounded-2xl p-6 shadow-2xl"
                style={{
                  background: 'var(--background-glass)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight">
                      {product.title}
                    </h1>
                    {product.brand && (
                      <p className="text-purple-300 font-medium">
                        by {product.brand}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {product.rating && product.rating > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {renderStars(product.rating)}
                        </div>
                        <span className="text-white font-medium">
                          {product.rating}
                        </span>
                        {product.reviews && product.reviews > 0 && (
                          <span className="text-purple-300 text-sm">
                            ({product.reviews} reviews)
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-3xl font-bold"
                        style={{
                          background:
                            'linear-gradient(to right, var(--primary-purple-light), var(--secondary-pink-light))',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {product.extracted_price
                          ? product.extracted_price.toLocaleString('id-ID')
                          : product.price}
                        $
                      </p>
                      {product.source && (
                        <p className="text-purple-300 text-sm mt-1">
                          from {product.source}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={product.product_link || product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/50 shadow-lg hover:shadow-xl"
                      style={{
                        background:
                          'linear-gradient(to right, var(--primary-purple), var(--secondary-pink))',
                      }}
                    >
                      <ExternalLink size={18} />
                      Buy Now
                    </a>
                    {/* Heart icon removed as requested */}
                    <button
                      className="p-3 rounded-xl border transition-all duration-200 hover:scale-110 text-purple-300"
                      style={{
                        background: 'var(--background-glass)',
                        borderColor: 'var(--border-default)',
                      }}
                      onClick={() => {
                        if (product.product_link || product.link) {
                          navigator.clipboard.writeText(
                            product.product_link || product.link,
                          );
                          addToast('Link copied to clipboard!', {
                            type: 'success',
                            title: 'Copied',
                            duration: 2000,
                            position: 'top-right',
                            closable: false,
                          });
                        } else {
                          addToast('No link available to copy.', {
                            type: 'error',
                            title: 'Error',
                            duration: 2000,
                            position: 'top-right',
                            closable: false,
                          });
                        }
                      }}
                    >
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {(product.availability || product.shipping_info) && (
                <div
                  className="backdrop-blur-xl border rounded-2xl p-6 shadow-2xl"
                  style={{
                    background: 'var(--background-glass)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Truck className="text-purple-300" size={20} />
                    Shipping & Availability
                  </h3>
                  <div className="space-y-3">
                    {product.availability && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="text-green-400" size={16} />
                        <span className="text-purple-200">
                          {product.availability}
                        </span>
                      </div>
                    )}
                    {product.shipping_info?.time && (
                      <div className="flex items-center gap-2">
                        <Package className="text-purple-300" size={16} />
                        <span className="text-purple-200">
                          Delivery: {product.shipping_info.time}
                        </span>
                      </div>
                    )}
                    {product.shipping_info?.free_shipping && (
                      <div className="flex items-center gap-2">
                        <Shield className="text-green-400" size={16} />
                        <span className="text-purple-200">
                          Free Shipping Available
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {product.description && (
            <div
              className="backdrop-blur-xl border rounded-2xl p-6 shadow-2xl mb-8"
              style={{
                background: 'var(--background-glass)',
                borderColor: 'var(--border-default)',
              }}
            >
              <h3 className="text-white font-semibold mb-4 text-lg">
                Product Description
              </h3>
              <p className="text-purple-200 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {product.product_highlights &&
            product.product_highlights.length > 0 && (
              <div
                className="backdrop-blur-xl border rounded-2xl p-6 shadow-2xl mb-8"
                style={{
                  background: 'var(--background-glass)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <h3 className="text-white font-semibold mb-4 text-lg">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {product.product_highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle
                        className="text-green-400 mt-0.5 flex-shrink-0"
                        size={16}
                      />
                      <span className="text-purple-200">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div
                className="backdrop-blur-xl border rounded-2xl p-6 shadow-2xl mb-8"
                style={{
                  background: 'var(--background-glass)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <h3 className="text-white font-semibold mb-4 text-lg">
                  Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between py-2 border-b border-white/10"
                      >
                        <span className="text-purple-300 font-medium">
                          {key}:
                        </span>
                        <span className="text-purple-200">{value}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

          {product.reviews_data &&
            product.reviews_data.recent_reviews &&
            product.reviews_data.recent_reviews.length > 0 && (
              <div
                className="backdrop-blur-xl border rounded-2xl p-6 shadow-2xl"
                style={{
                  background: 'var(--background-glass)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <h3 className="text-white font-semibold mb-4 text-lg">
                  Customer Reviews
                </h3>
                <div className="space-y-4">
                  {product.reviews_data.recent_reviews
                    .slice(0, 3)
                    .map((review, index) => (
                      <div
                        key={index}
                        className="border rounded-xl p-4"
                        style={{
                          background: 'var(--background-glass)',
                          borderColor: 'var(--border-default)',
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-white font-medium">
                              {review.author}
                            </span>
                          </div>
                          <span className="text-purple-300 text-sm">
                            {review.date}
                          </span>
                        </div>
                        {review.title && (
                          <h4 className="text-white font-medium mb-1">
                            {review.title}
                          </h4>
                        )}
                        <p className="text-purple-200">{review.text}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
        </div>
      </main>
    </div>
  );
}
