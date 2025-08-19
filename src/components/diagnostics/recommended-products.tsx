import React from 'react';
import {
  ShoppingCart,
  Star,
  ExternalLink,
  Package,
  Zap,
  Heart,
  Shield,
  Sparkles,
} from 'lucide-react';

interface MockProduct {
  id: string;
  title: string;
  price: string;
  rating: number;
  reviews: number;
  source: string;
  thumbnail: string;
  description: string;
  category: 'medication' | 'supplement' | 'device' | 'therapy';
}

interface RecommendedProductsProps {
  symptoms: Array<{ name: string; severity: 'mild' | 'moderate' | 'severe' }>;
  isVisible: boolean;
}

export const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  symptoms,
  isVisible,
}) => {
  const mockProducts: MockProduct[] = [
    {
      id: '1',
      title: 'Panadol Extra Strength',
      price: 'Rp 25,000',
      rating: 4.5,
      reviews: 127,
      source: 'Tokopedia',
      thumbnail: '💊',
      description: 'Fast-acting pain relief for headaches and body aches',
      category: 'medication',
    },
    {
      id: '2',
      title: 'Vitamin D3 Supplement',
      price: 'Rp 45,000',
      rating: 4.7,
      reviews: 89,
      source: 'Shopee',
      thumbnail: '🌟',
      description: 'Boost immunity and bone health',
      category: 'supplement',
    },
    {
      id: '3',
      title: 'Digital Thermometer',
      price: 'Rp 35,000',
      rating: 4.3,
      reviews: 203,
      source: 'Blibli',
      thumbnail: '🌡️',
      description: 'Accurate temperature monitoring',
      category: 'device',
    },
    {
      id: '4',
      title: 'Herbal Sleep Tea',
      price: 'Rp 18,000',
      rating: 4.2,
      reviews: 156,
      source: 'Bukalapak',
      thumbnail: '🍵',
      description: 'Natural remedy for better sleep',
      category: 'therapy',
    },
    {
      id: '5',
      title: 'Muscle Relief Cream',
      price: 'Rp 32,000',
      rating: 4.6,
      reviews: 94,
      source: 'Tokopedia',
      thumbnail: '🧴',
      description: 'Topical pain relief for muscle soreness',
      category: 'medication',
    },
    {
      id: '6',
      title: 'Multivitamin Complex',
      price: 'Rp 55,000',
      rating: 4.4,
      reviews: 78,
      source: 'Shopee',
      thumbnail: '💊',
      description: 'Complete daily nutrition support',
      category: 'supplement',
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication':
        return <Heart className="text-red-400" size={12} />;
      case 'supplement':
        return <Zap className="text-yellow-400" size={12} />;
      case 'device':
        return <Package className="text-blue-400" size={12} />;
      case 'therapy':
        return <Shield className="text-green-400" size={12} />;
      default:
        return <Sparkles className="text-purple-400" size={12} />;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={10}
            className={
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-400'
            }
          />
        ))}
      </div>
    );
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="tips-card animate-in fade-in slide-in-from-right-3 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="text-purple-300" size={20} />
        <h4 className="text-white font-semibold">Recommended Products</h4>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(147, 51, 234, 0.3) rgba(255, 255, 255, 0.1)'
      }}>
        {mockProducts.map((product) => (
          <div
            key={product.id}
            className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">
                {product.thumbnail}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h5 className="text-purple-200 text-sm font-medium truncate">
                    {product.title}
                  </h5>
                  <div className="flex items-center gap-1">
                    {getCategoryIcon(product.category)}
                  </div>
                </div>
                
                <p className="text-purple-300 text-xs mb-2 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-semibold">
                    {product.price}
                  </span>
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                    <span className="text-purple-300 text-xs ml-1">
                      ({product.reviews})
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-purple-400 text-xs">
                    {product.source}
                  </span>
                  <button className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs rounded-lg transition-all duration-200 hover:scale-105 opacity-0 group-hover:opacity-100">
                    <ExternalLink size={10} />
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl border border-purple-400/30">
        <div className="flex items-start gap-2">
          <Sparkles className="text-purple-300 mt-0.5 flex-shrink-0" size={14} />
          <div>
            <p className="text-purple-200 text-sm font-medium mb-1">
              AI Recommendations
            </p>
            <p className="text-purple-300 text-xs leading-relaxed">
              These products are suggested based on your symptoms. Always consult a healthcare professional before using any medication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedProducts;
