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
    return cachedResult;
  }

  const endpoint = `${SERPAPI_BASE_URL}?engine=google_shopping&q=${encodeURIComponent(query)}&num=20&api_key=${apiKey}`;

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
        shopping_results: data.shopping_results.slice(0, 50).map((product: any, index: number) => {
          const enhancedProduct = {
            ...product,
            product_id: product.product_id || product.link?.split('?')[0]?.split('/').pop() || `${Date.now()}_${Math.random()}_${index}`
          };
          
          const productDetails: IProductDetails = {
            ...enhancedProduct,
            description: product.snippet || product.description || `${product.title} - Available from ${product.source}. Visit the product page for full details and customer reviews.`,
            specifications: product.specifications || {},
            images: product.thumbnail ? [product.thumbnail] : [],
            seller_info: { 
              name: product.source || 'Unknown Seller',
              rating: product.seller_rating || undefined,
              reviews_count: product.seller_reviews || undefined
            },
            availability: product.availability || 'Available',
            shipping_info: {
              time: product.delivery || product.shipping || 'Standard delivery',
              free_shipping: product.free_shipping || false,
              cost: product.shipping_cost || undefined
            },
            variants: product.variants || {},
            reviews_data: {
              total_reviews: product.reviews || 0,
              rating_breakdown: product.rating_breakdown || {},
              recent_reviews: (product.reviews && product.reviews > 0 && product.rating) ? [{
                rating: Math.round(product.rating) || 5,
                title: 'Customer Experience',
                text: `This product has ${product.reviews} customer reviews with an average rating of ${product.rating} stars. Customers found this product helpful. Click "Buy Now" to read detailed reviews on the seller's website.`,
                date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                author: `${product.reviews} Verified Customers`
              }] : []
            },
            product_highlights: product.highlights || product.features || [
              `Available from ${product.source}`,
              `Price: ${product.price}`,
              ...(product.rating ? [`Customer Rating: ${product.rating} stars`] : []),
              ...(product.reviews ? [`${product.reviews} customer reviews`] : [])
            ],
            brand: product.brand || '',
            category: product.category || '',
            model: product.model || '',
            sku: enhancedProduct.product_id
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
    return cachedResult;
  }

  const cachedProduct = getProductFromCache(productId);
  
  if (cachedProduct) {
    const productDetails: IProductDetails = {
      ...cachedProduct,
      description: (cachedProduct as any).snippet || 
                   (cachedProduct as any).description || 
                   `${cachedProduct.title} - Available from ${cachedProduct.source}. Visit the product page for full details and customer reviews.`,
      specifications: (cachedProduct as any).specifications || {},
      images: cachedProduct.thumbnail ? [cachedProduct.thumbnail] : [],
      seller_info: { 
        name: cachedProduct.source || 'Unknown Seller',
        rating: (cachedProduct as any).seller_rating || undefined,
        reviews_count: (cachedProduct as any).seller_reviews || undefined
      },
      availability: (cachedProduct as any).availability || 'Available for purchase',
      shipping_info: {
        time: cachedProduct.delivery || 'Standard delivery time applies',
        free_shipping: (cachedProduct as any).free_shipping || false,
        cost: (cachedProduct as any).shipping_cost || undefined
      },
      variants: (cachedProduct as any).variants || {},
      reviews_data: {
        total_reviews: cachedProduct.reviews || 0,
        rating_breakdown: (cachedProduct as any).rating_breakdown || {},
        recent_reviews: (cachedProduct.reviews && cachedProduct.reviews > 0 && cachedProduct.rating) ? [{
          rating: Math.round(cachedProduct.rating) || 5,
          title: 'Customer Experience',
          text: `This product has ${cachedProduct.reviews} customer reviews with an average rating of ${cachedProduct.rating} stars. Customers found this product helpful. Click "Buy Now" to read detailed reviews on the seller's website.`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          author: `${cachedProduct.reviews} Verified Customers`
        }] : []
      },
      product_highlights: (cachedProduct as any).highlights || 
                          (cachedProduct as any).features || [
                            `Available from ${cachedProduct.source}`,
                            `Price: ${cachedProduct.price}`,
                            ...(cachedProduct.rating ? [`Customer Rating: ${cachedProduct.rating} stars`] : []),
                            ...(cachedProduct.reviews ? [`${cachedProduct.reviews} customer reviews`] : [])
                          ],
      brand: (cachedProduct as any).brand || '',
      category: (cachedProduct as any).category || '',
      model: (cachedProduct as any).model || '',
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
};

export const getCacheStats = () => {
  return {
    searchEntries: searchCache.size,
    productEntries: productDetailsCache.size,
    totalMemoryUsage: `${searchCache.size + productDetailsCache.size} entries`
  };
};
