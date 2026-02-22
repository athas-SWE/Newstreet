export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  imageUrl1?: string;
  imageUrl2?: string;
  stock?: number;
  shopId: string;
  shopName?: string;
  interestCount?: number;
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
