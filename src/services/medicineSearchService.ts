import axios from 'axios';
import { ISerpAPIResponse } from '../interfaces/IProduct';

const SERPAPI_BASE_URL = 'https://serpapi.com/search.json';
const CORS_PROXY = 'https://api.allorigins.win/get';

export const searchProducts = async (
  query: string,
  apiKey: string,
): Promise<ISerpAPIResponse> => {
  const endpoint = `${SERPAPI_BASE_URL}?engine=google_shopping&q=${encodeURIComponent(query)}&location=Indonesia&gl=id&hl=id&num=150&api_key=${apiKey}`;

  const proxyUrl = `${CORS_PROXY}?url=${encodeURIComponent(endpoint)}`;

  const response = await axios.get(proxyUrl);

  if (response.status !== 200) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = JSON.parse(response.data.contents);
  return data;
};
