import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  ExternalLink,
  ShoppingCart,
  Filter,
  Grid,
  List,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Navbar from '../components/common/navbar';
import { ProductCard, SkeletonCard } from '../components/common/product-card';
import { searchProducts } from '../services/medicine.service';
import { IProduct } from '../interfaces/IProduct';
import { useSearchFilters, useSortOptions } from '../hooks/use-search-filters';
import { usePagination } from '../hooks/use-pagination';
import { useMouseTracking } from '../hooks/use-mouse-tracking';
import { useToastContext } from '../contexts/toast-context';

export default function MarketPage() {
  const navigate = useNavigate();
  const mousePosition = useMouseTracking();
  const { addToast } = useToastContext();
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
      size: 0.15 + Math.random() * 0.25,
    })),
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const SERPAPI_KEY = import.meta.env.VITE_SERPAPI_KEY;

  const sortOptions = useSortOptions();
  const {
    filters,
    updateFilter,
    resetFilters,
    getFilteredAndSortedProducts,
    getAvailableSources,
    getPriceRange,
  } = useSearchFilters();

  const [searchState, setSearchState] = useState<{
    query: string;
    apiKey: string;
    isLoading: boolean;
    products: IProduct[];
    error: string | null;
  }>({
    query: '',
    apiKey: SERPAPI_KEY,
    isLoading: false,
    products: [],
    error: null,
  });

  const filteredProducts = useMemo(() => {
    return getFilteredAndSortedProducts(searchState.products, sortBy);
  }, [searchState.products, getFilteredAndSortedProducts, sortBy]);

  const {
    currentPage,
    totalPages,
    displayedProducts,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    resetPagination,
    hasNextPage,
    hasPreviousPage,
    totalItems,
  } = usePagination(filteredProducts, 20);

  const handleNavigateToProduct = useCallback(
    (productId: string) => {
      const stateToSave = {
        searchState,
        filters,
        sortBy,
        viewMode,
        showFilters,
        currentPage,
        timestamp: Date.now(),
      };
      sessionStorage.setItem('marketPageState', JSON.stringify(stateToSave));
      navigate(`/product/${encodeURIComponent(productId)}`);
    },
    [
      navigate,
      searchState,
      filters,
      sortBy,
      viewMode,
      showFilters,
      currentPage,
    ],
  );

  const handleSearch = async () => {
    if (!searchState.query.trim()) {
      setSearchState((prev) => ({
        ...prev,
        error: 'Please enter a product name to search.',
      }));
      return;
    }

    setSearchState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      products: [],
    }));

    resetPagination();

    try {
      const results = await searchProducts(
        searchState.query,
        searchState.apiKey,
      );

      if (results.error) {
        throw new Error(results.error);
      }

      if (results.shopping_results && results.shopping_results.length > 0) {
        const processedProducts = results.shopping_results.map((product) => ({
          ...product,
          extracted_price:
            product.extracted_price ||
            parseFloat(
              product.price.replace(/[^\d.,]/g, '').replace(',', '.'),
            ) ||
            0,
        }));

        setSearchState((prev) => ({
          ...prev,
          products: processedProducts,
          isLoading: false,
        }));
      } else {
        setSearchState((prev) => ({
          ...prev,
          error: 'No products found. Try different keywords.',
          isLoading: false,
        }));
      }
    } catch (error) {
      let errorMessage = 'Search failed: ';

      if (error instanceof Error) {
        if (error.message.includes('All CORS proxies failed')) {
          errorMessage +=
            'Unable to connect to search service. Please try again later.';
        } else if (error.message.includes('HTTP error')) {
          errorMessage += 'Server temporarily unavailable. Please try again.';
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += 'Unknown error occurred.';
      }

      setSearchState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
    }
  };

  const handleInputChange = (value: string) => {
    setSearchState((prev) => ({ ...prev, query: value, error: null }));
  };

  useEffect(() => {
    const savedState = sessionStorage.getItem('marketPageState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);

        const isRecent =
          parsedState.timestamp &&
          Date.now() - parsedState.timestamp < 5 * 60 * 1000;

        if (isRecent) {
          if (parsedState.searchState) {
            setSearchState(parsedState.searchState);
          }

          if (parsedState.sortBy) setSortBy(parsedState.sortBy);
          if (parsedState.viewMode) setViewMode(parsedState.viewMode);
          if (typeof parsedState.showFilters === 'boolean')
            setShowFilters(parsedState.showFilters);

          if (parsedState.filters) {
            Object.keys(parsedState.filters).forEach((key) => {
              updateFilter(key as any, parsedState.filters[key]);
            });
          }

          if (parsedState.currentPage && parsedState.currentPage > 1) {
            setTimeout(() => {
              goToPage(parsedState.currentPage);
            }, 300);
          }
        }

        sessionStorage.removeItem('marketPageState');
      } catch (error) {
        console.error('Failed to restore market page state:', error);
        sessionStorage.removeItem('marketPageState');
      }
    }
  }, [updateFilter, goToPage]);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          'linear-gradient(to bottom right, var(--background-dark), var(--primary-purple-darker), var(--tertiary-indigo-darker))',
        fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
      }}
    >
      <div className="absolute inset-0 opacity-30">
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
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3 space-y-6">
              <div className="text-center lg:text-left">
                <div
                  className="inline-flex items-center gap-3 mb-4 p-4 rounded-2xl border backdrop-blur-sm"
                  style={{
                    background:
                      'linear-gradient(to right, var(--primary-purple-100), var(--secondary-pink-100))',
                    borderColor: 'var(--border-primary)',
                  }}
                >
                  <div
                    className="p-3 rounded-xl backdrop-blur-sm"
                    style={{ background: 'var(--primary-purple-200)' }}
                  >
                    <ShoppingCart className="text-purple-300" size={28} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      Marketplace
                    </h1>
                    <p className="text-purple-200 text-sm">
                      Discover amazing products
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="backdrop-blur-xl border rounded-2xl p-6 shadow-2xl"
                style={{
                  background: 'var(--background-glass)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="text-purple-300" size={20} />
                  <h2 className="text-lg font-semibold text-white">
                    Search Products
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Search
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300"
                      size={16}
                    />
                    <input
                      type="text"
                      value={searchState.query}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-12 pr-4 py-3 border rounded-xl text-white placeholder:text-purple-200/70 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 backdrop-blur-sm transition-all duration-200"
                      style={{
                        background: 'var(--background-glass)',
                        borderColor: 'var(--border-default)',
                      }}
                      placeholder="Search for products..."
                      disabled={searchState.isLoading}
                    />
                  </div>

                  <button
                    onClick={handleSearch}
                    disabled={
                      searchState.isLoading || !searchState.query.trim()
                    }
                    className="w-full py-3 px-4 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400/50 shadow-lg hover:shadow-xl"
                    style={{
                      background:
                        searchState.isLoading || !searchState.query.trim()
                          ? 'linear-gradient(to right, var(--text-disabled), var(--text-disabled))'
                          : 'linear-gradient(to right, var(--primary-purple), var(--secondary-pink))',
                      backgroundImage:
                        !searchState.isLoading && searchState.query.trim()
                          ? 'linear-gradient(to right, var(--primary-purple), var(--secondary-pink))'
                          : undefined,
                    }}
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

              {filteredProducts.length > 0 && (
                <div
                  className="backdrop-blur-xl border rounded-2xl p-6 shadow-2xl space-y-4"
                  style={{
                    background: 'var(--background-glass)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal
                        className="text-purple-300"
                        size={18}
                      />
                      <span className="text-white font-medium text-sm">
                        Controls
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 text-purple-200 text-sm"
                        style={{
                          background: 'var(--background-glass)',
                          borderColor: 'var(--border-default)',
                        }}
                      >
                        <Filter size={14} />
                        Filters
                        <ChevronDown
                          className={`transform transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
                          size={14}
                        />
                      </button>

                      <div className="relative">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="appearance-none border rounded-lg px-3 py-2 text-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50 pr-8"
                          style={{
                            background: 'var(--background-glass)',
                            borderColor: 'var(--border-default)',
                          }}
                        >
                          {sortOptions.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              className="bg-slate-800"
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ArrowUpDown
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-300 pointer-events-none"
                          size={14}
                        />
                      </div>
                    </div>

                    {showFilters && (
                      <div
                        className="space-y-4 p-4 rounded-lg border"
                        style={{
                          background: 'var(--background-glass)',
                          borderColor: 'var(--border-default)',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-purple-200 text-sm font-medium">
                            Price Range
                          </span>
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
                            onChange={(e) =>
                              updateFilter(
                                'minPrice',
                                Number(e.target.value) || 0,
                              )
                            }
                            className="border rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-400/50"
                            style={{
                              background: 'var(--background-glass)',
                              borderColor: 'var(--border-default)',
                            }}
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxPrice || ''}
                            onChange={(e) =>
                              updateFilter(
                                'maxPrice',
                                Number(e.target.value) || 10000000,
                              )
                            }
                            className="border rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-400/50"
                            style={{
                              background: 'var(--background-glass)',
                              borderColor: 'var(--border-default)',
                            }}
                          />
                        </div>

                        <div>
                          <span className="text-purple-200 text-sm font-medium mb-2 block">
                            Minimum Rating
                          </span>
                          <select
                            value={filters.minRating}
                            onChange={(e) =>
                              updateFilter('minRating', Number(e.target.value))
                            }
                            className="w-full border rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-400/50"
                            style={{
                              background: 'var(--background-glass)',
                              borderColor: 'var(--border-default)',
                            }}
                          >
                            <option value={0}>Any Rating</option>
                            <option value={3}>3+ Stars</option>
                            <option value={4}>4+ Stars</option>
                            <option value={4.5}>4.5+ Stars</option>
                          </select>
                        </div>

                        <div>
                          <span className="text-purple-200 text-sm font-medium mb-2 block">
                            Sources
                          </span>
                          <div className="max-h-24 overflow-y-auto space-y-1">
                            {getAvailableSources(searchState.products).map(
                              (source) => (
                                <label
                                  key={source}
                                  className="flex items-center gap-2 text-xs"
                                >
                                  <input
                                    type="checkbox"
                                    checked={filters.sources.includes(source)}
                                    onChange={(e) => {
                                      const newSources = e.target.checked
                                        ? [...filters.sources, source]
                                        : filters.sources.filter(
                                            (s) => s !== source,
                                          );
                                      updateFilter('sources', newSources);
                                    }}
                                    className="rounded border-white/20 bg-white/5 text-purple-500"
                                  />
                                  <span className="text-purple-200">
                                    {source}
                                  </span>
                                </label>
                              ),
                            )}
                          </div>
                        </div>

                        <label className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={filters.freeShipping}
                            onChange={(e) =>
                              updateFilter('freeShipping', e.target.checked)
                            }
                            className="rounded border-white/20 bg-white/5 text-purple-500"
                          />
                          <span className="text-purple-200">
                            Free Shipping Only
                          </span>
                        </label>
                      </div>
                    )}

                    <div
                      className="flex items-center gap-1 rounded-lg p-1 border"
                      style={{
                        background: 'var(--background-glass)',
                        borderColor: 'var(--border-default)',
                      }}
                    >
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
                      Page{' '}
                      <span className="font-semibold text-purple-300">
                        {currentPage}
                      </span>{' '}
                      of{' '}
                      <span className="font-semibold text-purple-300">
                        {totalPages}
                      </span>{' '}
                      ({totalItems} total products)
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:w-2/3">
              {searchState.error && (
                <div
                  className="backdrop-blur-xl border rounded-2xl p-6 shadow-2xl mb-6"
                  style={{
                    background:
                      'linear-gradient(to right, var(--error-red-100), var(--secondary-pink-100))',
                    borderColor: 'var(--border-error)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 rounded-xl"
                      style={{ background: 'var(--error-red-200)' }}
                    >
                      <Search className="text-red-400" size={20} />
                    </div>
                    <div>
                      <h3 className="text-red-300 font-medium mb-1">
                        Search Error
                      </h3>
                      <p className="text-red-200/80 text-sm">
                        {searchState.error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {searchState.isLoading && (
                <div
                  className="backdrop-blur-xl border rounded-2xl p-6 shadow-2xl"
                  style={{
                    background: 'var(--background-glass)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <div
                    className={`${
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                        : 'space-y-4'
                    }`}
                  >
                    {Array.from({ length: 20 }).map((_, index) => (
                      <SkeletonCard key={index} viewMode={viewMode} />
                    ))}
                  </div>
                </div>
              )}

              {filteredProducts.length > 0 && (
                <div
                  className="backdrop-blur-xl border rounded-2xl p-6 shadow-2xl"
                  style={{
                    background: 'var(--background-glass)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <div
                    className={`${
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                        : 'space-y-4'
                    }`}
                  >
                    {displayedProducts.map((product, index) => (
                      <ProductCard
                        key={product.product_id}
                        product={product}
                        index={index}
                        viewMode={viewMode}
                        onNavigate={handleNavigateToProduct}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center mt-8 gap-4">
                      <button
                        onClick={goToPreviousPage}
                        disabled={!hasPreviousPage}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-purple-200"
                        style={{
                          background: 'var(--background-glass)',
                          borderColor: 'var(--border-default)',
                        }}
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </button>

                      <div className="flex items-center gap-2">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNumber;
                            if (totalPages <= 5) {
                              pageNumber = i + 1;
                            } else if (currentPage <= 3) {
                              pageNumber = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNumber = totalPages - 4 + i;
                            } else {
                              pageNumber = currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNumber}
                                onClick={() => goToPage(pageNumber)}
                                className={`w-10 h-10 rounded-lg border transition-all duration-200 hover:scale-105 text-sm font-medium ${
                                  currentPage === pageNumber
                                    ? 'text-white'
                                    : 'text-purple-300'
                                }`}
                                style={{
                                  background:
                                    currentPage === pageNumber
                                      ? 'linear-gradient(to right, var(--primary-purple), var(--secondary-pink))'
                                      : 'var(--background-glass)',
                                  borderColor:
                                    currentPage === pageNumber
                                      ? 'var(--border-primary)'
                                      : 'var(--border-default)',
                                }}
                              >
                                {pageNumber}
                              </button>
                            );
                          },
                        )}
                      </div>

                      <button
                        onClick={goToNextPage}
                        disabled={!hasNextPage}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-purple-200"
                        style={{
                          background: 'var(--background-glass)',
                          borderColor: 'var(--border-default)',
                        }}
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}

                  {totalItems > 0 && (
                    <div className="text-center mt-4">
                      <p className="text-purple-300/70 text-sm">
                        Showing{' '}
                        {Math.min((currentPage - 1) * 20 + 1, totalItems)} -{' '}
                        {Math.min(currentPage * 20, totalItems)} of {totalItems}{' '}
                        products
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!searchState.isLoading &&
                !searchState.error &&
                filteredProducts.length === 0 &&
                searchState.products.length > 0 && (
                  <div
                    className="backdrop-blur-xl border rounded-2xl p-12 shadow-2xl"
                    style={{
                      background: 'var(--background-glass)',
                      borderColor: 'var(--border-default)',
                    }}
                  >
                    <div className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-6">
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              'linear-gradient(to right, var(--warning-yellow-200), var(--error-red-200))',
                          }}
                        ></div>
                        <div
                          className="absolute inset-4 rounded-full flex items-center justify-center"
                          style={{
                            background: 'var(--background-glass)',
                          }}
                        >
                          <Filter className="text-orange-300" size={24} />
                        </div>
                      </div>
                      <h3 className="text-orange-200 font-medium mb-2">
                        No Results Found
                      </h3>
                      <p className="text-orange-300/70 text-sm max-w-md mx-auto mb-4">
                        No products match your current filters. Try adjusting
                        your search criteria.
                      </p>
                      <button
                        onClick={resetFilters}
                        className="px-4 py-2 border rounded-lg text-orange-200 transition-all duration-200 text-sm"
                        style={{
                          background:
                            'linear-gradient(to right, var(--warning-yellow-200), var(--error-red-200))',
                          borderColor: 'var(--border-warning)',
                        }}
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                )}

              {!searchState.isLoading &&
                !searchState.error &&
                searchState.products.length === 0 && (
                  <div
                    className="backdrop-blur-xl border rounded-2xl p-12 shadow-2xl"
                    style={{
                      background: 'var(--background-glass)',
                      borderColor: 'var(--border-default)',
                    }}
                  >
                    <div className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-6">
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              'linear-gradient(to right, var(--primary-purple-200), var(--secondary-pink-200))',
                          }}
                        ></div>
                        <div
                          className="absolute inset-4 rounded-full flex items-center justify-center"
                          style={{
                            background: 'var(--background-glass)',
                          }}
                        >
                          <ShoppingCart className="text-purple-300" size={24} />
                        </div>
                      </div>
                      <h3 className="text-purple-200 font-medium mb-2">
                        Ready to Search
                      </h3>
                      <p className="text-purple-300/70 text-sm max-w-md mx-auto">
                        Enter a search query to discover amazing products from
                        Indonesian marketplaces
                      </p>
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
