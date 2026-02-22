import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface ExpressInterestRequest {
  productId: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
}

export interface InterestResponse {
  success: boolean;
  message: string;
  interestCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductInterestService {
  constructor(private apiService: ApiService) {}

  expressInterest(request: ExpressInterestRequest): Observable<InterestResponse> {
    return this.apiService.post<InterestResponse>('productinterest', {
      productId: request.productId,
      userEmail: request.userEmail,
      userName: request.userName,
      userPhone: request.userPhone
    });
  }

  getInterestCount(productId: string): Observable<number> {
    return this.apiService.get<number>(`productinterest/product/${productId}/count`);
  }

  getInterestCounts(productIds: string[]): Observable<Record<string, number>> {
    return this.apiService.post<Record<string, number>>('productinterest/counts', productIds);
  }
}
