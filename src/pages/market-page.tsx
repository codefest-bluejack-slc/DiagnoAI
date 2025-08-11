import React, { useState, useEffect } from 'react';
import { Search, Star, ExternalLink, ShoppingCart, Filter, Grid, List, Sparkles, SlidersHorizontal, ArrowUpDown, ChevronDown, X } from 'lucide-react';
import Navbar from '../components/common/navbar';
import { searchProducts } from '../services/medicineSearchService';
import { IProduct, ISearchState } from '../interfaces/IProduct';
import { useSearchFilters, useSortOptions } from '../hooks/use-search-filters';
import { useInfiniteScroll } from '../hooks/use-infinite-scroll';
import { useScrollDetection } from '../hooks/use-scroll-detection';

export default function MarketPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const SERPAPI_KEY = '5d42de4074ad433519fe932f6629ec454c6cff5f41a44f08aef4741c83e86741';
  
  const sortOptions = useSortOptions();
  const {
    filters,
    updateFilter,
    resetFilters,
    getFilteredAndSortedProducts,
    getAvailableSources,
    getPriceRange,
  } = useSearchFilters();
  
  const [searchState, setSearchState] = useState<ISearchState>({
    query: '',
    apiKey: SERPAPI_KEY,
    isLoading: false,
    products: [],
    filteredProducts: [],
    displayedProducts: [],
    error: null,
    filters: {
      minPrice: 0,
      maxPrice: 10000000,
      minRating: 0,
      sources: [],
      freeShipping: false,
    },
    sortBy: 'relevance',
    currentPage: 1,
    itemsPerPage: 20,
    hasMore: false,
  });

  const {
    displayedProducts,
    hasMore,
    isLoadingMore,
    loadMore,
    resetPagination,
  } = useInfiniteScroll(searchState.filteredProducts, 20);

  useScrollDetection(loadMore);

  useEffect(() => {
    if (searchState.products.length > 0) {
      const filtered = getFilteredAndSortedProducts(searchState.products, sortBy);
      setSearchState(prev => ({ ...prev, filteredProducts: filtered }));
    }
  }, [searchState.products, filters, sortBy, getFilteredAndSortedProducts]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (searchState.products.length > 0) {
      const priceRange = getPriceRange(searchState.products);
      updateFilter('minPrice', Math.floor(priceRange.min));
      updateFilter('maxPrice', Math.ceil(priceRange.max));
    }
  }, [searchState.products, getPriceRange, updateFilter]);

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
      filteredProducts: [],
    }));

    resetPagination();

    try {
      const results = await searchProducts(searchState.query, searchState.apiKey);
      
      if (results.error) {
        throw new Error(results.error);
      }

      if (results.shopping_results && results.shopping_results.length > 0) {
        const processedProducts = results.shopping_results.map(product => ({
          ...product,
          extracted_price: product.extracted_price || parseFloat(product.price.replace(/[^\d.,]/g, '').replace(',', '.')) || 0,
        }));

        setSearchState(prev => ({
          ...prev,
          products: processedProducts,
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
      className={`group relative ${
        viewMode === 'grid' 
          ? 'p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl' 
          : 'flex p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200'
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      <div className={`${
        viewMode === 'grid' 
          ? 'aspect-square mb-4 rounded-lg bg-white/5 p-4 flex items-center justify-center overflow-hidden' 
          : 'w-20 h-20 rounded-lg bg-white/5 p-2 flex items-center justify-center overflow-hidden flex-shrink-0 mr-4'
      }`}>
        <img 
          src={product.thumbnail} 
          alt={product.title}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://placehold.co/300x300/1e293b/94a3b8?text=No+Image';
          }}
        />
      </div>
      
      <div className="flex-1 flex flex-col">
        <h3 className={`text-white font-medium mb-2 group-hover:text-purple-200 transition-colors duration-200 ${
          viewMode === 'grid' ? 'line-clamp-2 text-sm leading-relaxed' : 'text-sm truncate'
        }`} title={product.title}>
          {product.title}
        </h3>
        
        <div className={`flex items-center ${viewMode === 'grid' ? 'justify-between mb-3' : 'gap-4 mb-2'}`}>
          <span className="text-purple-300/80 text-xs truncate bg-purple-500/10 px-2 py-1 rounded-full">
            {product.source || 'Unknown'}
          </span>
          {product.rating && (
            <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
              <Star size={10} className="text-amber-400 fill-current" />
              <span className="text-amber-300 text-xs font-medium">{product.rating}</span>
            </div>
          )}
        </div>
        
        <div className={`mt-auto flex items-center ${viewMode === 'grid' ? 'justify-between gap-3' : 'gap-6'}`}>
          <p className="text-lg font-bold text-purple-300 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {product.price}
          </p>
          <a 
            href={product.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors duration-200 text-sm font-medium bg-indigo-500/10 px-3 py-1 rounded-full hover:bg-indigo-500/20 border border-indigo-500/20"
          >
            <span>Visit</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950" style={{ fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif" }}>
      
      <div className="absolute inset-0 opacity-30">
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
        {Array.from({ length: 20 }, (_, i) => (
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
      
      <main className="relative z-10 min-h-screen pt-6 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col lg:flex-row gap-8">
            
            <div className="lg:w-1/3 space-y-6">
              
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-3 mb-4 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm">
                  <div className="p-3 rounded-xl bg-purple-500/20 backdrop-blur-sm">
                    <ShoppingCart className="text-purple-300" size={28} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Marketplace</h1>
                    <p className="text-purple-200 text-sm">Discover amazing products</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="text-purple-300" size={20} />
                  <h2 className="text-lg font-semibold text-white">Search Products</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" size={16} />
                    <input 
                      type="text" 
                      value={searchState.query}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-purple-200/70 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 backdrop-blur-sm transition-all duration-200"
                      placeholder="Search for products..."
                      disabled={searchState.isLoading}
                    />
                  </div>

                  <button 
                    onClick={handleSearch}
                    disabled={searchState.isLoading || !searchState.query.trim()}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400/50 shadow-lg hover:shadow-xl"
                  >
                    {searchState.isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search size={18} />
                        Search Products
                      </>
                    )}
                  </button>
                </div>
              </div>

              {searchState.filteredProducts.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="text-purple-300" size={18} />
                      <span className="text-white font-medium text-sm">Controls</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200 text-purple-200 text-sm"
                      >
                        <Filter size={14} />
                        Filters
                        <ChevronDown className={`transform transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} size={14} />
                      </button>

                      <div className="relative">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="appearance-none bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50 pr-8"
                        >
                          {sortOptions.map(option => (
                            <option key={option.value} value={option.value} className="bg-slate-800">
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-300 pointer-events-none" size={14} />
                      </div>
                    </div>

                    {showFilters && (
                      <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-purple-200 text-sm font-medium">Price Range</span>
                          <button
                            onClick={resetFilters}
                            className="text-purple-300 hover:text-purple-200 text-xs flex items-center gap-1"
                          >
                            <X size={12} />
                            Reset
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={filters.minPrice || ''}
                            onChange={(e) => updateFilter('minPrice', Number(e.target.value) || 0)}
                            className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-400/50"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxPrice || ''}
                            onChange={(e) => updateFilter('maxPrice', Number(e.target.value) || 10000000)}
                            className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-400/50"
                          />
                        </div>

                        <div>
                          <span className="text-purple-200 text-sm font-medium mb-2 block">Minimum Rating</span>
                          <select
                            value={filters.minRating}
                            onChange={(e) => updateFilter('minRating', Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-400/50"
                          >
                            <option value={0}>Any Rating</option>
                            <option value={3}>3+ Stars</option>
                            <option value={4}>4+ Stars</option>
                            <option value={4.5}>4.5+ Stars</option>
                          </select>
                        </div>

                        <div>
                          <span className="text-purple-200 text-sm font-medium mb-2 block">Sources</span>
                          <div className="max-h-24 overflow-y-auto space-y-1">
                            {getAvailableSources(searchState.products).map(source => (
                              <label key={source} className="flex items-center gap-2 text-xs">
                                <input
                                  type="checkbox"
                                  checked={filters.sources.includes(source)}
                                  onChange={(e) => {
                                    const newSources = e.target.checked
                                      ? [...filters.sources, source]
                                      : filters.sources.filter(s => s !== source);
                                    updateFilter('sources', newSources);
                                  }}
                                  className="rounded border-white/20 bg-white/5 text-purple-500"
                                />
                                <span className="text-purple-200">{source}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <label className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={filters.freeShipping}
                            onChange={(e) => updateFilter('freeShipping', e.target.checked)}
                            className="rounded border-white/20 bg-white/5 text-purple-500"
                          />
                          <span className="text-purple-200">Free Shipping Only</span>
                        </label>
                      </div>
                    )}

                    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all duration-200 ${
                          viewMode === 'grid' 
                            ? 'bg-purple-500/30 text-purple-200' 
                            : 'text-purple-300/70 hover:text-purple-200 hover:bg-white/5'
                        }`}
                      >
                        <Grid size={16} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all duration-200 ${
                          viewMode === 'list' 
                            ? 'bg-purple-500/30 text-purple-200' 
                            : 'text-purple-300/70 hover:text-purple-200 hover:bg-white/5'
                        }`}
                      >
                        <List size={16} />
                      </button>
                    </div>

                    <div className="text-purple-200 text-sm">
                      Showing <span className="font-semibold text-purple-300">{displayedProducts.length}</span> of <span className="font-semibold text-purple-300">{searchState.filteredProducts.length}</span> products
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:w-2/3">
              {searchState.error && (
                <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 shadow-2xl mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-red-400/20">
                      <Search className="text-red-400" size={20} />
                    </div>
                    <div>
                      <h3 className="text-red-300 font-medium mb-1">Search Error</h3>
                      <p className="text-red-200/80 text-sm">{searchState.error}</p>
                    </div>
                  </div>
                </div>
              )}

              {searchState.isLoading && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 shadow-2xl">
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
                      <div className="absolute inset-2 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Search className="text-purple-400" size={20} />
                      </div>
                    </div>
                    <h3 className="text-purple-200 font-medium mb-2">Searching Products</h3>
                    <p className="text-purple-300/70 text-sm">Finding the best results for you...</p>
                  </div>
                </div>
              )}

              {searchState.filteredProducts.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                  <div className={`${
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                      : 'space-y-4'
                  }`}>
                    {displayedProducts.map((product, index) => (
                      <ProductCard key={`${product.product_id}-${index}`} product={product} index={index} />
                    ))}
                  </div>

                  {isLoadingMore && (
                    <div className="flex justify-center mt-6 py-4">
                      <div className="flex items-center gap-2 text-purple-300">
                        <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                        <span className="text-sm">Loading more products...</span>
                      </div>
                    </div>
                  )}

                  {!hasMore && displayedProducts.length > 0 && (
                    <div className="text-center mt-6 py-4">
                      <p className="text-purple-300/70 text-sm">You've reached the end of the results</p>
                    </div>
                  )}
                </div>
              )}

              {!searchState.isLoading && !searchState.error && searchState.filteredProducts.length === 0 && searchState.products.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 shadow-2xl">
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20"></div>
                      <div className="absolute inset-4 rounded-full bg-white/5 flex items-center justify-center">
                        <Filter className="text-orange-300" size={24} />
                      </div>
                    </div>
                    <h3 className="text-orange-200 font-medium mb-2">No Results Found</h3>
                    <p className="text-orange-300/70 text-sm max-w-md mx-auto mb-4">No products match your current filters. Try adjusting your search criteria.</p>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg text-orange-200 hover:bg-orange-500/30 transition-all duration-200 text-sm"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}

              {!searchState.isLoading && !searchState.error && searchState.products.length === 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 shadow-2xl">
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20"></div>
                      <div className="absolute inset-4 rounded-full bg-white/5 flex items-center justify-center">
                        <ShoppingCart className="text-purple-300" size={24} />
                      </div>
                    </div>
                    <h3 className="text-purple-200 font-medium mb-2">Ready to Search</h3>
                    <p className="text-purple-300/70 text-sm max-w-md mx-auto">Enter a search query to discover amazing products from Indonesian marketplaces</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
