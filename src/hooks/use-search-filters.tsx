import { useState, useMemo, useCallback } from 'react';
import { IProduct, ISearchFilters, ISortOption } from '../interfaces/IProduct';

export const useSortOptions = (): ISortOption[] => {
  return [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating_desc', label: 'Highest Rated' },
    { value: 'reviews_desc', label: 'Most Reviewed' },
  ];
};

export const useSearchFilters = () => {
  const [filters, setFilters] = useState<ISearchFilters>({
    minPrice: 0,
    maxPrice: 10000000,
    minRating: 0,
    sources: [],
    freeShipping: false,
  });

  const updateFilter = useCallback(
    <K extends keyof ISearchFilters>(key: K, value: ISearchFilters[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters({
      minPrice: 0,
      maxPrice: 10000000,
      minRating: 0,
      sources: [],
      freeShipping: false,
    });
  }, []);

  const applyFilters = useCallback(
    (products: IProduct[]): IProduct[] => {
      return products.filter((product) => {
        const price = product.extracted_price || 0;
        const rating = product.rating || 0;

        if (price < filters.minPrice || price > filters.maxPrice) return false;
        if (rating < filters.minRating) return false;
        if (
          filters.sources.length > 0 &&
          !filters.sources.includes(product.source)
        )
          return false;
        if (
          filters.freeShipping &&
          !product.delivery?.toLowerCase().includes('free')
        )
          return false;

        return true;
      });
    },
    [filters],
  );

  const sortProducts = useCallback(
    (products: IProduct[], sortBy: string): IProduct[] => {
      const sorted = [...products];

      switch (sortBy) {
        case 'price_asc':
          return sorted.sort(
            (a, b) => (a.extracted_price || 0) - (b.extracted_price || 0),
          );
        case 'price_desc':
          return sorted.sort(
            (a, b) => (b.extracted_price || 0) - (a.extracted_price || 0),
          );
        case 'rating_desc':
          return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        case 'reviews_desc':
          return sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        default:
          return sorted;
      }
    },
    [],
  );

  const getFilteredAndSortedProducts = useCallback(
    (products: IProduct[], sortBy: string): IProduct[] => {
      const filtered = applyFilters(products);
      return sortProducts(filtered, sortBy);
    },
    [filters],
  );

  const getAvailableSources = useCallback((products: IProduct[]): string[] => {
    const sources = products.map((product) => product.source).filter(Boolean);
    return [...new Set(sources as string[])];
  }, []);

  const getPriceRange = useCallback(
    (products: IProduct[]): { min: number; max: number } => {
      const prices = products
        .map((product) => product.extracted_price)
        .filter((price): price is number => typeof price === 'number' && price > 0);

      if (prices.length === 0) {
        return { min: 0, max: 10000000 };
      }

      return {
        min: Math.min(...prices),
        max: Math.max(...prices),
      };
    },
    [],
  );

  return {
    filters,
    updateFilter,
    resetFilters,
    getFilteredAndSortedProducts,
    getAvailableSources,
    getPriceRange,
  };
};