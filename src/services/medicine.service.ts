import axios from 'axios';
import { ISerpAPIResponse, ISerpAPIProductResponse, IProductDetails, IProduct } from '../interfaces/IProduct';

const SERPAPI_BASE_URL = 'https://serpapi.com/search.json';
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/get?url=',
  'https://cors-anywhere.herokuapp.com/',
];

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

  for (let i = 0; i < CORS_PROXIES.length; i++) {
    try {
      let proxyUrl;
      let response;

      if (CORS_PROXIES[i].includes('allorigins')) {
        proxyUrl = `${CORS_PROXIES[i]}${encodeURIComponent(endpoint)}`;
        response = await axios.get(proxyUrl);
        
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
      } else {
        proxyUrl = `${CORS_PROXIES[i]}${endpoint}`;
        response = await axios.get(proxyUrl);
        
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = response.data;
        
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
      }
    } catch (error) {
      console.warn(`CORS proxy ${CORS_PROXIES[i]} failed:`, error);
      
      if (i === CORS_PROXIES.length - 1) {
        throw new Error(`All CORS proxies failed. Last error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  throw new Error('No proxy available');
};

export const getProductDetails = async (
  productId: string,
  apiKey: string,
  fallbackProduct?: IProduct
): Promise<IProductDetails> => {
  const cacheKey = `product_${productId}_${apiKey}`;
  const cachedResult = getCacheEntry(productCache, cacheKey);
  
  if (cachedResult) {
    console.log('Using cached product details for:', productId);
    return cachedResult;
  }

  if (fallbackProduct) {
    console.log('Using fallback product data for:', productId);
    const fallbackDetails: IProductDetails = {
      ...fallbackProduct,
      description: `${fallbackProduct.title} - Available from ${fallbackProduct.source}`,
      specifications: {},
      images: fallbackProduct.thumbnail ? [fallbackProduct.thumbnail] : [],
      seller_info: {
        name: fallbackProduct.source || 'Unknown Store',
        rating: fallbackProduct.rating,
        reviews_count: fallbackProduct.reviews
      },
      availability: 'Available',
      shipping_info: {
        cost: 'Varies',
        time: '3-7 days',
        free_shipping: fallbackProduct.delivery?.toLowerCase().includes('free') || false
      },
      variants: {},
      reviews_data: {
        total_reviews: fallbackProduct.reviews || 0,
        rating_breakdown: {},
        recent_reviews: []
      },
      product_highlights: [fallbackProduct.title],
      brand: fallbackProduct.source || '',
      category: 'General',
      model: '',
      sku: productId
    };
    
    setCacheEntry(productCache, cacheKey, fallbackDetails);
    return fallbackDetails;
  }

  console.log('Attempting to fetch detailed product info for:', productId);
  
  const endpoint = `${SERPAPI_BASE_URL}?engine=google_product&product_id=${encodeURIComponent(productId)}&location=Indonesia&gl=id&hl=id&api_key=${apiKey}`;

  for (let i = 0; i < CORS_PROXIES.length; i++) {
    try {
      let proxyUrl;
      let response;

      if (CORS_PROXIES[i].includes('allorigins')) {
        proxyUrl = `${CORS_PROXIES[i]}${encodeURIComponent(endpoint)}`;
        response = await axios.get(proxyUrl);
        
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
      } else {
        proxyUrl = `${CORS_PROXIES[i]}${endpoint}`;
        response = await axios.get(proxyUrl);
        
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = response.data;
        
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
      }
    } catch (error) {
      console.warn(`CORS proxy ${CORS_PROXIES[i]} failed for product details:`, error);
      
      if (i === CORS_PROXIES.length - 1) {
        const fallbackDetails: IProductDetails = {
          position: 1,
          title: 'Product not available',
          link: '',
          product_link: '',
          product_id: productId,
          thumbnail: '',
          source: '',
          price: 'N/A',
          extracted_price: 0,
          rating: 0,
          reviews: 0,
          delivery: '',
          description: 'Unable to fetch detailed product information. Please try again later.',
          specifications: {},
          images: [],
          seller_info: { name: 'Unknown', rating: 0, reviews_count: 0 },
          availability: 'Unknown',
          shipping_info: { cost: 'N/A', time: 'N/A', free_shipping: false },
          variants: {},
          reviews_data: { total_reviews: 0, rating_breakdown: {}, recent_reviews: [] },
          product_highlights: [],
          brand: '',
          category: '',
          model: '',
          sku: ''
        };
        
        return fallbackDetails;
      }
    }
  }

  throw new Error('No proxy available');
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
