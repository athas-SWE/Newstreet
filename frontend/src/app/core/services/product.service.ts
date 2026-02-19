import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { SearchResponse, PopularProductsResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private apiService: ApiService) {}

  searchProducts(query: string, page: number = 1, pageSize: number = 20): Observable<SearchResponse> {
    return this.apiService.get<SearchResponse>(`products/search?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`);
  }

  getPopularProducts(count: number = 10): Observable<PopularProductsResponse> {
    return this.apiService.get<PopularProductsResponse>(`products/popular?count=${count}`);
  }
}
