import axios from 'axios';
import { ISerpAPIResponse, ISerpAPIProductResponse, IProductDetails, IProduct } from '../interfaces/IProduct';

const SERPAPI_BASE_URL = 'https://serpapi.com/search.json';
const CORS_PROXY = 'https://api.allorigins.win/get?url=';

const searchCache = new Map<string, CacheEntry<ISerpAPIResponse>>();
const productCache = new Map<string, CacheEntry<IProductDetails>>();
const CACHE_DURATION = 30 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const isValidCache = <T>(entry: CacheEntry<T> | undefined): entry is CacheEntry<T> => {
  return entry !== undefined && (Date.now() - entry.timestamp) < CACHE_DURATION;
};

const setCacheEntry = <T>(cache: Map<string, CacheEntry<T>>, key: string, data: T) => {
  cache.set(key, { data, timestamp: Date.now() });
};

const getCacheEntry = <T>(cache: Map<string, CacheEntry<T>>, key: string): T | null => {
  const entry = cache.get(key);
  if (isValidCache(entry)) {
    return entry.data;
  }
  cache.delete(key);
  return null;
};

export const searchProducts = async (
  query: string,
  apiKey: string,
): Promise<ISerpAPIResponse> => {
  const cacheKey = `search_${query}_${apiKey}`;
  const cachedResult = getCacheEntry(searchCache, cacheKey);
  
  if (cachedResult) {
    console.log('Using cached search results for:', query);
    return cachedResult;
  }

  const endpoint = `${SERPAPI_BASE_URL}?engine=google_shopping&q=${encodeURIComponent(query)}&location=Indonesia&gl=id&hl=id&num=150&api_key=${apiKey}`;

  try {
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(endpoint)}`;
    const response = await axios.get(proxyUrl);
    
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = JSON.parse(response.data.contents);
    
    if (data.shopping_results) {
      const enhancedResults = {
        ...data,
        shopping_results: data.shopping_results.map((product: IProduct) => ({
          ...product,
          product_id: product.product_id || product.link?.split('?')[0]?.split('/').pop() || `${Date.now()}_${Math.random()}`
        }))
      };
      setCacheEntry(searchCache, cacheKey, enhancedResults);
      return enhancedResults;
    }
    
    setCacheEntry(searchCache, cacheKey, data);
    return data;
  } catch (error) {
    throw new Error(`CORS proxy failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getProductDetails = async (
  productId: string,
  apiKey: string
): Promise<IProductDetails> => {
  const cacheKey = `product_${productId}_${apiKey}`;
  const cachedResult = getCacheEntry(productCache, cacheKey);
  
  if (cachedResult) {
    console.log('Using cached product details for:', productId);
    return cachedResult;
  }

  console.log('Attempting to fetch detailed product info for:', productId);
  
  const endpoint = `${SERPAPI_BASE_URL}?engine=google_product&product_id=${encodeURIComponent(productId)}&location=Indonesia&gl=id&hl=id&api_key=${apiKey}`;

  try {
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(endpoint)}`;
    const response = await axios.get(proxyUrl);
    
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = JSON.parse(response.data.contents);
    
    if (data.error) {
      throw new Error(data.error);
    }

    const productResult = data.product_results || {};
    
    const productDetails: IProductDetails = {
      position: 1,
      title: productResult.title || 'Product Details',
      link: productResult.link || '',
      product_link: productResult.product_link || '',
      product_id: productId,
      thumbnail: productResult.thumbnail || '',
      source: productResult.source || '',
      price: productResult.price || '',
      extracted_price: productResult.extracted_price || 0,
      rating: productResult.rating || 0,
      reviews: productResult.reviews || 0,
      delivery: productResult.delivery || '',
      description: productResult.description || '',
      specifications: productResult.specifications || {},
      images: productResult.images || [],
      seller_info: productResult.seller_info || {},
      availability: productResult.availability || '',
      shipping_info: productResult.shipping_info || {},
      variants: productResult.variants || {},
      reviews_data: productResult.reviews_data || {
        total_reviews: productResult.reviews || 0,
        rating_breakdown: {},
        recent_reviews: []
      },
      product_highlights: productResult.product_highlights || [],
      brand: productResult.brand || '',
      category: productResult.category || '',
      model: productResult.model || '',
      sku: productResult.sku || ''
    };
    
    setCacheEntry(productCache, cacheKey, productDetails);
    return productDetails;
  } catch (error) {
    throw new Error(`CORS proxy failed for product details: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getProductFromCache = (productId: string): IProduct | null => {
  for (const [_, cacheEntry] of searchCache.entries()) {
    if (isValidCache(cacheEntry) && cacheEntry.data.shopping_results) {
      const product = cacheEntry.data.shopping_results.find(
        (p: IProduct) => p.product_id === productId
      );
      if (product) {
        return product;
      }
    }
  }
  return null;
};

export const clearCache = () => {
  searchCache.clear();
  productCache.clear();
  console.log('Cache cleared');
};

export const getCacheStats = () => {
  return {
    searchEntries: searchCache.size,
    productEntries: productCache.size,
    totalMemoryUsage: `${searchCache.size + productCache.size} entries`
  };
};
