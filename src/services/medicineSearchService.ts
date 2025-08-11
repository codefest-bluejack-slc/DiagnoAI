import axios from 'axios';
import { ISerpAPIResponse, ISerpAPIProductResponse, IProductDetails } from '../interfaces/IProduct';

const SERPAPI_BASE_URL = 'https://serpapi.com/search.json';
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/get?url=',
  'https://cors-anywhere.herokuapp.com/',
];

export const searchProducts = async (
  query: string,
  apiKey: string,
): Promise<ISerpAPIResponse> => {
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
        return data;
      } else {
        proxyUrl = `${CORS_PROXIES[i]}${endpoint}`;
        response = await axios.get(proxyUrl);
        
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.data;
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
): Promise<IProductDetails> => {
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
        
        return {
          position: 1,
          title: productResult.title || '',
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
        
        return {
          position: 1,
          title: productResult.title || '',
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
      }
    } catch (error) {
      console.warn(`CORS proxy ${CORS_PROXIES[i]} failed for product details:`, error);
      
      if (i === CORS_PROXIES.length - 1) {
        throw new Error(`All CORS proxies failed. Last error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  throw new Error('No proxy available');
};
