import React, { useState, useEffect } from 'react';
import { Search, Star, ExternalLink, ShoppingCart } from 'lucide-react';
import Navbar from '../components/common/navbar';
import { searchProducts } from '../services/medicineSearchService';
import { IProduct, ISearchState } from '../interfaces/IProduct';

export default function MarketPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const SERPAPI_KEY = '5d42de4074ad433519fe932f6629ec454c6cff5f41a44f08aef4741c83e86741';
  
  const [searchState, setSearchState] = useState<ISearchState>({
    query: '',
    apiKey: SERPAPI_KEY,
    isLoading: false,
    products: [],
    error: null,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSearch = async () => {
    if (!searchState.query.trim()) {
      setSearchState(prev => ({ ...prev, error: 'Please enter a product name to search.' }));
      return;
    }

    setSearchState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      products: [],
    }));

    try {
      const results = await searchProducts(searchState.query, searchState.apiKey);
      
      if (results.error) {
        throw new Error(results.error);
      }

      if (results.shopping_results && results.shopping_results.length > 0) {
        setSearchState(prev => ({
          ...prev,
          products: results.shopping_results || [],
          isLoading: false,
        }));
      } else {
        setSearchState(prev => ({
          ...prev,
          error: 'No products found. Try different keywords.',
          isLoading: false,
        }));
      }
    } catch (error) {
      setSearchState(prev => ({
        ...prev,
        error: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isLoading: false,
      }));
    }
  };

  const handleInputChange = (value: string) => {
    setSearchState(prev => ({ ...prev, query: value, error: null }));
  };

  const ProductCard: React.FC<{ product: IProduct; index: number }> = ({ product, index }) => (
    <div 
      className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
      style={{
        animationDelay: `${index * 50}ms`,
        animation: 'fadeInUp 0.4s ease-out forwards'
      }}
    >
      <div className="aspect-square mb-3 rounded-lg bg-white/10 p-3 flex items-center justify-center overflow-hidden">
        <img 
          src={product.thumbnail} 
          alt={product.title}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://placehold.co/300x300/1e293b/94a3b8?text=No+Image';
          }}
        />
      </div>
      
      <div className="flex-1">
        <h3 className="text-white font-medium mb-2 line-clamp-2 text-sm leading-relaxed" title={product.title}>
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-purple-300 text-xs truncate">{product.source || 'Unknown'}</span>
          {product.rating && (
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded border border-white/10">
              <Star size={12} className="text-yellow-400 fill-current" />
              <span className="text-white text-xs">{product.rating}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-semibold text-purple-400">
            {product.price}
          </p>
          <a 
            href={product.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors duration-200 text-sm"
          >
            <span>Visit</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950" style={{ fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif" }}>
      
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-500/25 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
      </div>
      
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.4) 0%, transparent 50%)`
        }}
      ></div>
      
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <Navbar />
      
      <main className="relative z-10 min-h-screen pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <ShoppingCart className="text-purple-300" size={32} />
              </div>
              <h1 className="text-4xl font-bold text-white">
                Marketplace
              </h1>
            </div>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              Search and discover products from Indonesian marketplaces
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <Search className="text-purple-300" size={24} />
              Product Search
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Search Query
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchState.query}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 backdrop-blur-sm"
                    placeholder="Search for products..."
                    disabled={searchState.isLoading}
                  />
                </div>
              </div>

              <button 
                onClick={handleSearch}
                disabled={searchState.isLoading || !searchState.query.trim()}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              >
                {searchState.isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Search Products
                  </>
                )}
              </button>
            </div>
          </div>

          {searchState.error && (
            <div className="bg-white/10 backdrop-blur-lg border border-red-500/30 rounded-2xl p-6 shadow-xl mb-8">
              <div className="text-center">
                <div className="p-3 rounded-full bg-red-400/10 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Search className="text-red-400" size={24} />
                </div>
                <p className="text-red-300 font-medium">{searchState.error}</p>
              </div>
            </div>
          )}

          {searchState.isLoading && (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl mb-8">
              <div className="text-center py-8">
                <div className="p-4 rounded-full bg-white/5 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                </div>
                <p className="text-purple-300 font-medium">Searching for products...</p>
                <p className="text-purple-400 text-sm mt-1">Please wait while we find the best results</p>
              </div>
            </div>
          )}

          {searchState.products.length > 0 && (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <ShoppingCart className="text-purple-300" size={24} />
                Products Found ({searchState.products.length})
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchState.products.map((product, index) => (
                  <ProductCard key={`${product.product_id}-${index}`} product={product} index={index} />
                ))}
              </div>
            </div>
          )}

          {!searchState.isLoading && !searchState.error && searchState.products.length === 0 && (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
              <div className="text-center py-12">
                <div className="p-4 rounded-full bg-white/5 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Search className="text-purple-300" size={24} />
                </div>
                <p className="text-purple-200">No products searched yet</p>
                <p className="text-purple-300 text-sm mt-1">Enter a search query to find products</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
