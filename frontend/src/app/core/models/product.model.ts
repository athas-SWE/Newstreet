export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  stock?: number;
  shopId: string;
  shopName?: string;
}

export interface SearchResponse {
  products: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface PopularProductsResponse {
  popularSearches: string[];
  popularProducts: Product[];
}
