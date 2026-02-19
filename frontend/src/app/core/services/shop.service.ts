import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Shop } from '../models/shop.model';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  constructor(private apiService: ApiService) {}

  getShops(): Observable<Shop[]> {
    return this.apiService.get<Shop[]>('shops');
  }

  getShopBySlug(slug: string): Observable<Shop> {
    return this.apiService.get<Shop>(`shops/${slug}`);
  }

  getShopCount(): Observable<number> {
    return this.apiService.get<number>('shops/count');
  }
}
