export interface IProduct {
  position: number;
  title: string;
  link: string;
  product_link: string;
  product_id: string;
  thumbnail: string;
  source: string;
  price: string;
  extracted_price?: number;
  rating?: number;
  reviews?: number;
  delivery?: string;
}

export interface IProductDetails extends IProduct {
  description?: string;
  specifications?: Record<string, string>;
  images?: string[];
  seller_info?: {
    name: string;
    rating?: number;
    reviews_count?: number;
  };
  availability?: string;
  shipping_info?: {
    cost?: string;
    time?: string;
    free_shipping?: boolean;
  };
  variants?: {
    size?: string[];
    color?: string[];
    other?: Record<string, string[]>;
  };
  reviews_data?: {
    total_reviews: number;
    rating_breakdown: Record<string, number>;
    recent_reviews: Array<{
      rating: number;
      title?: string;
      text: string;
      date: string;
      author: string;
    }>;
  };
  product_highlights?: string[];
  brand?: string;
  category?: string;
  model?: string;
  sku?: string;
}

export interface ISerpAPIResponse {
  shopping_results?: IProduct[];
  error?: string;
  search_metadata?: {
    status: string;
  };
}

export interface ISerpAPIProductResponse {
  product_results?: IProductDetails;
  error?: string;
  search_metadata?: {
    status: string;
  };
}

export interface ISearchFilters {
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sources: string[];
  freeShipping: boolean;
}

export interface ISortOption {
  value: string;
  label: string;
}

export interface ISearchState {
  query: string;
  apiKey: string;
  isLoading: boolean;
  products: IProduct[];
  filteredProducts: IProduct[];
  displayedProducts: IProduct[];
  error: string | null;
  filters: ISearchFilters;
  sortBy: string;
  currentPage: number;
  itemsPerPage: number;
  hasMore: boolean;
}
