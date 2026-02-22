import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ProductInterestService } from '../../../core/services/product-interest.service';
import { Product } from '../../../core/models/product.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <div class="product-detail-container">
      <div class="container">
        <button (click)="goBack()" class="back-button">← Back</button>
        
        @if (loading()) {
          <app-loading-spinner></app-loading-spinner>
        } @else if (product()) {
          <div class="product-detail">
            <div class="product-main">
              <div class="product-images">
                @if (product()!.imageUrl1) {
                  <img [src]="product()!.imageUrl1" [alt]="product()!.name" class="main-image" />
                } @else if (product()!.imageUrl2) {
                  <img [src]="product()!.imageUrl2" [alt]="product()!.name" class="main-image" />
                } @else {
                  <div class="image-placeholder">
                    <span class="product-initial">{{ product()!.name.charAt(0).toUpperCase() }}</span>
                  </div>
                }
                @if (product()!.imageUrl2) {
                  <img [src]="product()!.imageUrl2" [alt]="product()!.name" class="secondary-image" />
                }
              </div>
              
              <div class="product-info">
                <h1 class="product-title">{{ product()!.name }}</h1>
                @if (product()!.shopName) {
                  <p class="shop-link">
                    <a [routerLink]="['/shops', getShopSlug()]">Shop: {{ product()!.shopName }}</a>
                  </p>
                }
                @if (product()!.description) {
                  <p class="product-description">{{ product()!.description }}</p>
                }
                @if (product()!.price) {
                  <p class="product-price">Rs. {{ product()!.price | number:'1.2-2' }}</p>
                }
                @if (product()!.stock !== undefined && product()!.stock !== null) {
                  <p class="product-stock" [class.in-stock]="product()!.stock > 0" [class.out-of-stock]="product()!.stock === 0">
                    {{ product()!.stock > 0 ? 'In Stock (' + product()!.stock + ' available)' : 'Out of Stock' }}
                  </p>
                }
                
                <!-- Interest Section -->
                <div class="interest-section">
                  <h3>Interested in this product?</h3>
                  <p class="interest-count">👆 {{ interestCount() }} people have shown interest</p>
                  
                  @if (!showInterestForm()) {
                    <button (click)="showInterestForm.set(true)" class="interest-button">
                      ✨ Show Interest
                    </button>
                  } @else {
                    <div class="interest-form">
                      <div class="form-group">
                        <label for="userName">Your Name (Optional)</label>
                        <input type="text" id="userName" [(ngModel)]="interestForm.userName" placeholder="Enter your name" />
                      </div>
                      <div class="form-group">
                        <label for="userEmail">Your Email (Optional)</label>
                        <input type="email" id="userEmail" [(ngModel)]="interestForm.userEmail" placeholder="Enter your email" />
                      </div>
                      <div class="form-group">
                        <label for="userPhone">Your Phone (Optional)</label>
                        <input type="tel" id="userPhone" [(ngModel)]="interestForm.userPhone" placeholder="Enter your phone" />
                      </div>
                      <div class="form-actions">
                        <button (click)="expressInterest()" [disabled]="submittingInterest()" class="submit-interest-button">
                          @if (submittingInterest()) {
                            Submitting...
                          } @else {
                            Submit Interest
                          }
                        </button>
                        <button (click)="showInterestForm.set(false)" class="cancel-button">Cancel</button>
                      </div>
                      @if (interestMessage()) {
                        <p class="interest-message" [class.success]="interestSuccess()" [class.error]="!interestSuccess()">
                          {{ interestMessage() }}
                        </p>
                      }
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        } @else {
          <p>Product not found</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .product-detail-container {
      padding: 2rem 0;
      min-height: calc(100vh - 200px);
      background: var(--bg-secondary, #f9fafb);
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .back-button {
      background: none;
      border: 1px solid #e0e0e0;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      margin-bottom: 2rem;
      transition: all 0.3s;
    }
    .back-button:hover {
      background: #f0f0f0;
    }
    .product-detail {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .product-main {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }
    .product-images {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .main-image, .secondary-image {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: 12px;
      background: #f5f5f5;
    }
    .image-placeholder {
      width: 100%;
      height: 400px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .product-initial {
      font-size: 6rem;
      font-weight: 700;
      color: white;
    }
    .product-info {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .product-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0;
      color: var(--text-primary, #1a1a1a);
    }
    .shop-link {
      margin: 0;
    }
    .shop-link a {
      color: var(--primary-color, #3b82f6);
      text-decoration: none;
      font-weight: 500;
    }
    .shop-link a:hover {
      text-decoration: underline;
    }
    .product-description {
      font-size: 1.125rem;
      line-height: 1.6;
      color: var(--text-secondary, #666);
      margin: 0;
    }
    .product-price {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-color, #3b82f6);
      margin: 0;
    }
    .product-stock {
      font-size: 1rem;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      display: inline-block;
      margin: 0;
    }
    .product-stock.in-stock {
      color: #10b981;
      background: #d1fae5;
    }
    .product-stock.out-of-stock {
      color: #ef4444;
      background: #fee2e2;
    }
    .interest-section {
      margin-top: 2rem;
      padding: 2rem;
      background: var(--bg-secondary, #f9fafb);
      border-radius: 12px;
      border: 2px solid var(--border-color, #e0e0e0);
    }
    .interest-section h3 {
      margin: 0 0 0.5rem;
      font-size: 1.5rem;
      color: var(--text-primary, #1a1a1a);
    }
    .interest-count {
      margin: 0 0 1.5rem;
      color: var(--text-secondary, #666);
      font-size: 1rem;
    }
    .interest-button {
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.125rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }
    .interest-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    .interest-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .form-group label {
      font-weight: 500;
      color: var(--text-primary, #1a1a1a);
    }
    .form-group input {
      padding: 0.75rem;
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 8px;
      font-size: 1rem;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
    }
    .submit-interest-button {
      flex: 1;
      padding: 0.75rem 1.5rem;
      background: var(--primary-color, #3b82f6);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }
    .submit-interest-button:hover:not(:disabled) {
      background: #2563eb;
    }
    .submit-interest-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .cancel-button {
      padding: 0.75rem 1.5rem;
      background: #e0e0e0;
      color: #333;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
    }
    .interest-message {
      margin: 1rem 0 0;
      padding: 0.75rem;
      border-radius: 8px;
      font-weight: 500;
    }
    .interest-message.success {
      background: #d1fae5;
      color: #065f46;
    }
    .interest-message.error {
      background: #fee2e2;
      color: #991b1b;
    }
    @media (max-width: 768px) {
      .product-main {
        grid-template-columns: 1fr;
      }
      .product-title {
        font-size: 2rem;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  loading = signal<boolean>(true);
  interestCount = signal<number>(0);
  showInterestForm = signal<boolean>(false);
  submittingInterest = signal<boolean>(false);
  interestMessage = signal<string>('');
  interestSuccess = signal<boolean>(false);
  
  interestForm = {
    userName: '',
    userEmail: '',
    userPhone: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private interestService: ProductInterestService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
      this.loadInterestCount(productId);
    }
  }

  loadProduct(id: string): void {
    this.loading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading.set(false);
      }
    });
  }

  loadInterestCount(productId: string): void {
    this.interestService.getInterestCount(productId).subscribe({
      next: (count) => {
        this.interestCount.set(count);
      },
      error: (error) => {
        console.error('Error loading interest count:', error);
      }
    });
  }

  expressInterest(): void {
    const product = this.product();
    if (!product) return;

    this.submittingInterest.set(true);
    this.interestMessage.set('');

    this.interestService.expressInterest({
      productId: product.id,
      userName: this.interestForm.userName || undefined,
      userEmail: this.interestForm.userEmail || undefined,
      userPhone: this.interestForm.userPhone || undefined
    }).subscribe({
      next: (response) => {
        this.submittingInterest.set(false);
        if (response.success) {
          this.interestSuccess.set(true);
          this.interestMessage.set(response.message);
          this.interestCount.set(response.interestCount);
          this.showInterestForm.set(false);
          // Clear form
          this.interestForm = { userName: '', userEmail: '', userPhone: '' };
        } else {
          this.interestSuccess.set(false);
          this.interestMessage.set(response.message);
        }
      },
      error: (error) => {
        console.error('Error expressing interest:', error);
        this.submittingInterest.set(false);
        this.interestSuccess.set(false);
        this.interestMessage.set('An error occurred. Please try again.');
      }
    });
  }

  getShopSlug(): string {
    // Extract slug from shop name or use a default
    const shopName = this.product()?.shopName || '';
    return shopName.toLowerCase().replace(/\s+/g, '-');
  }

  goBack(): void {
    window.history.back();
  }
}
