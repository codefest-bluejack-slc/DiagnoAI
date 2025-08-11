import { useState, useEffect, useCallback } from 'react';
import { IProduct } from '../interfaces/IProduct';

export const useInfiniteScroll = (
  products: IProduct[],
  itemsPerPage: number = 20,
) => {
  const [displayedProducts, setDisplayedProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
    const initialProducts = products.slice(0, itemsPerPage);
    setDisplayedProducts(initialProducts);
    setHasMore(products.length > itemsPerPage);
  }, [products, itemsPerPage]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = currentPage * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const nextProducts = products.slice(startIndex, endIndex);

      setDisplayedProducts((prev) => [...prev, ...nextProducts]);
      setCurrentPage(nextPage);
      setHasMore(endIndex < products.length);
      setIsLoadingMore(false);
    }, 300);
  }, [currentPage, products, itemsPerPage, hasMore, isLoadingMore]);

  const resetPagination = () => {
    setCurrentPage(1);
    setDisplayedProducts(products.slice(0, itemsPerPage));
    setHasMore(products.length > itemsPerPage);
    setIsLoadingMore(false);
  };

  return {
    displayedProducts,
    hasMore,
    isLoadingMore,
    loadMore,
    resetPagination,
  };
};
