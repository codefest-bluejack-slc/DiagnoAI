import axios from 'axios';
import { ISerpAPIResponse, ISerpAPIProductResponse, IProductDetails, IProduct } from '../interfaces/IProduct';

const SERPAPI_BASE_URL = 'https://serpapi.com/search.json';
const CORS_PROXY = 'https://api.allorigins.win/get?url=';

const searchCache = new Map<string, CacheEntry<ISerpAPIResponse>>();
const productDetailsCache = new Map<string, CacheEntry<IProductDetails>>();
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
        shopping_results: data.shopping_results.map((product: IProduct) => {
          const enhancedProduct = {
            ...product,
            product_id: product.product_id || product.link?.split('?')[0]?.split('/').pop() || `${Date.now()}_${Math.random()}`
          };
          
          const productDetails: IProductDetails = {
            ...enhancedProduct,
            description: product.description || '',
            specifications: {},
            images: [product.thumbnail],
            seller_info: { name: product.source || '' },
            availability: 'Available',
            shipping_info: {},
            variants: {},
            reviews_data: {
              total_reviews: product.reviews || 0,
              rating_breakdown: {},
              recent_reviews: []
            },
            product_highlights: [],
            brand: '',
            category: '',
            model: '',
            sku: ''
          };
          
          setCacheEntry(productDetailsCache, enhancedProduct.product_id, productDetails);
          
          return enhancedProduct;
        })
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
  const cacheKey = `product_${productId}`;
  const cachedResult = getCacheEntry(productDetailsCache, cacheKey);
  
  if (cachedResult) {
    console.log('Using cached product details for:', productId);
    return cachedResult;
  }

  const cachedProduct = getProductFromCache(productId);
  
  if (cachedProduct) {
    console.log('Creating product details from cached search result for:', productId);
    const productDetails: IProductDetails = {
      ...cachedProduct,
      description: cachedProduct.description || 'No description available',
      specifications: {},
      images: cachedProduct.thumbnail ? [cachedProduct.thumbnail] : [],
      seller_info: { name: cachedProduct.source || 'Unknown Seller' },
      availability: 'Available',
      shipping_info: {
        time: cachedProduct.delivery || 'Standard delivery',
        free_shipping: false
      },
      variants: {},
      reviews_data: {
        total_reviews: cachedProduct.reviews || 0,
        rating_breakdown: {},
        recent_reviews: []
      },
      product_highlights: [],
      brand: '',
      category: '',
      model: '',
      sku: productId
    };
    
    setCacheEntry(productDetailsCache, cacheKey, productDetails);
    return productDetails;
  }

  throw new Error('Product not found. Please search for products first.');
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
  productDetailsCache.clear();
  console.log('Cache cleared');
};

export const getCacheStats = () => {
  return {
    searchEntries: searchCache.size,
    productEntries: productDetailsCache.size,
    totalMemoryUsage: `${searchCache.size + productDetailsCache.size} entries`
  };
};
