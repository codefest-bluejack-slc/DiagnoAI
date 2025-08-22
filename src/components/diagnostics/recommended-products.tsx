import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Star,
  ExternalLink,
  Package,
  Zap,
  Heart,
  Shield,
  Sparkles,
  Pill,
  Maximize2,
  X,
} from 'lucide-react';
import { IProduct, ISerpAPIResponse } from '../../interfaces/IProduct';
import { searchProducts } from '../../services/medicine.service';

interface RecommendedProductsProps {
  symptoms: Array<{ name: string; severity: 'mild' | 'moderate' | 'severe' }>;
  isVisible: boolean;
  medicineRecommendations?: Array<{
    brand_name: string;
    generic_name: string;
    manufacturer: string;
    product_ndc: string;
  }>;
}

export const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  symptoms,
  isVisible,
  medicineRecommendations = [],
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState<{ [key: string]: IProduct[] }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  
  const medicines = medicineRecommendations.length > 0 
    ? [...new Set(medicineRecommendations.map(med => med.brand_name))]
    : [];
  
  const apiKey = import.meta.env.VITE_SERPAPI_KEY;

  useEffect(() => {
    if (isVisible && medicines.length > 0 && !productsLoaded) {
      loadProductsFromAPI();
      setProductsLoaded(true);

    }
  }, [isVisible, medicines]);

  const loadProductsFromAPI = async () => {
    setIsLoading(true);
    setError(null);
    const productsData: { [key: string]: IProduct[] } = {};

    if (!apiKey) {
      setError('API key not configured');
      setIsLoading(false);
      return;
    }
    
    try {
      for (const medicine of medicines) {
        try {
          console.log(`Searching for medicine: ${medicine}`);
          const medicineData = medicineRecommendations.find(med => med.brand_name === medicine);
          let searchQuery = medicine;
          
          if (medicineData && medicineData.generic_name) {
            const genericName = medicineData.generic_name.split(',')[0].trim();
            searchQuery = `${medicine} ${genericName} medication pharmacy`;
            console.log(`Enhanced search query: ${searchQuery}`);
          } else {
            searchQuery = `${medicine} medication pharmacy`;
            console.log(`Basic search query: ${searchQuery}`);
          }
          
          let response = await searchProducts(searchQuery, apiKey);
          console.log(`First search results for ${medicine}:`, response.shopping_results?.length || 0);
          
          if (!response.shopping_results || response.shopping_results.length === 0) {
            console.log(`Retrying with basic search: ${medicine}`);
            response = await searchProducts(medicine, apiKey);
            console.log(`Second search results:`, response.shopping_results?.length || 0);
          }
          
          if (!response.shopping_results || response.shopping_results.length === 0) {
            if (medicineData && medicineData.generic_name) {
              const genericName = medicineData.generic_name.split(',')[0].trim();
              console.log(`Trying generic name search: ${genericName}`);
              response = await searchProducts(genericName, apiKey);
              console.log(`Generic search results:`, response.shopping_results?.length || 0);
            }
          }
          
          if (response.shopping_results && response.shopping_results.length > 0) {
            productsData[medicine] = response.shopping_results.slice(0, 10);
            console.log(`Successfully found ${response.shopping_results.length} products for ${medicine}`);
          } else {
            productsData[medicine] = [];
            console.log(`No products found for ${medicine}`);
          }
        } catch (medicineError) {
          console.error(`Error searching for ${medicine}:`, medicineError);
          productsData[medicine] = [];
        }
        
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      
      setProducts(productsData);
    } catch (generalError) {
      console.error('Error loading products:', generalError);
      setError('Failed to load products. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = () => {
    return <Pill className="text-blue-400" size={12} />;
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

  const renderProductCard = (product: IProduct, isCompact = true) => (
    <div
      key={product.product_id}
      className={`p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer ${
        isCompact ? 'min-h-[120px]' : 'min-h-[140px]'
      }`}
    >
      <div className="flex items-start gap-3 h-full">
        <div className="text-2xl flex-shrink-0">
          {product.thumbnail ? (
            <img 
              src={product.thumbnail} 
              alt={product.title}
              className="w-8 h-8 rounded object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const fallbackDiv = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                if (fallbackDiv) fallbackDiv.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={product.thumbnail ? 'hidden' : 'flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded'}>
            <Pill className="text-blue-400" size={16} />
          </div>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h5 className={`text-purple-200 font-medium ${
                isCompact ? 'text-sm line-clamp-2' : 'text-base line-clamp-3'
              }`}>
                {product.title}
              </h5>
              <div className="flex items-center gap-1 flex-shrink-0">
                {getCategoryIcon()}
              </div>
            </div>
            
            <p className={`text-purple-300 mb-2 ${
              isCompact ? 'text-xs line-clamp-1' : 'text-sm line-clamp-2'
            }`}>
              Available from {product.source}
            </p>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-white font-semibold ${
                isCompact ? 'text-sm' : 'text-base'
              }`}>
                {product.price || 'Price not available'}
              </span>
              <div className="flex items-center gap-1">
                {renderStars(product.rating || 4.0)}
                <span className="text-purple-300 text-xs ml-1">
                  ({product.reviews || 0})
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-purple-400 text-xs truncate max-w-[100px]">
                {product.source}
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(product.link, '_blank');
                }}
                className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs rounded-lg transition-all duration-200 hover:scale-105 opacity-0 group-hover:opacity-100"
              >
                <ExternalLink size={10} />
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getCurrentProducts = () => {
    const currentMedicine = medicines[activeTab];
    return products[currentMedicine] || [];
  };

  const ProductModal = () => {
    if (!isModalOpen) return null;

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    return (
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="bg-slate-900 rounded-2xl border border-purple-400/30 max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-purple-400/20">
            <div className="flex items-center gap-3">
              <ShoppingCart className="text-purple-300" size={24} />
              <h2 className="text-2xl font-bold text-white">Recommended Products</h2>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              aria-label="Close modal"
            >
              <X className="text-purple-300" size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {medicines.map((medicine, index) => (
                <button
                  key={`tab-${index}-${medicine}`}
                  onClick={() => setActiveTab(index)}
                  className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                    activeTab === index
                      ? 'bg-purple-500/30 text-purple-200 border border-purple-400/50'
                      : 'bg-white/5 text-purple-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {medicine}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-400/30 rounded-lg">
                <p className="text-red-300 text-sm mb-3">{error}</p>
                <button
                  onClick={loadProductsFromAPI}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm rounded-lg transition-all duration-200"
                >
                  Retry
                </button>
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto pr-2" style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(147, 51, 234, 0.3) rgba(255, 255, 255, 0.1)'
              }}>
                {getCurrentProducts().map((product) => renderProductCard(product, false))}
                
                {getCurrentProducts().length === 0 && !isLoading && !error && (
                  <div className="col-span-full text-center py-16">
                    <p className="text-purple-300 text-lg">No products found for this medicine</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    );
  };

  if (!isVisible || medicines.length === 0) {
    return null;
  }

  return (
    <>
      <div className="tips-card animate-in fade-in slide-in-from-right-3 duration-500">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-purple-300" size={20} />
            <div className="flex flex-col">
              <h4 className="text-white font-semibold">Recommended Products</h4>
              {medicineRecommendations.length > 0 && (
                <span className="text-xs text-green-300 flex items-center gap-1">
                  <Sparkles size={10} />
                  AI Powered
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
            title="Expand to full view"
          >
            <Maximize2 className="text-purple-300 group-hover:text-purple-200" size={16} />
          </button>
        </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {medicines.map((medicine, index) => (
          <button
            key={`mini-tab-${index}-${medicine}`}
            onClick={() => setActiveTab(index)}
            className={`px-2 py-1 text-xs rounded-lg transition-all duration-300 ${
              activeTab === index
                ? 'bg-purple-500/30 text-purple-200 border border-purple-400/50'
                : 'bg-white/5 text-purple-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            {medicine.length > 12 ? medicine.substring(0, 12) + '...' : medicine}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-400/30 rounded-lg">
          <p className="text-red-300 text-sm mb-2">{error}</p>
          <button
            onClick={loadProductsFromAPI}
            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs rounded-lg transition-all duration-200"
          >
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(147, 51, 234, 0.3) rgba(255, 255, 255, 0.1)'
        }}>
          {getCurrentProducts().slice(0, 3).map((product) => renderProductCard(product, true))}
          
          {getCurrentProducts().length > 3 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-400/30 rounded-xl text-purple-300 hover:text-purple-200 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Maximize2 size={16} />
              View {getCurrentProducts().length - 3} more products
            </button>
          )}
          
          {getCurrentProducts().length === 0 && !isLoading && !error && (
            <div className="text-center py-8">
              <p className="text-purple-300 text-sm">No products found for this medicine</p>
            </div>
          )}
        </div>
      )}
    </div>

    <ProductModal />
  </>
  );
};

export default RecommendedProducts;
