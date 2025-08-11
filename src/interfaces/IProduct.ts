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

export interface ISerpAPIResponse {
  shopping_results?: IProduct[];
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
