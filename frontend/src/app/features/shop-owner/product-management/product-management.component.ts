import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ImageUploadService } from '../../../core/services/image-upload.service';
import { Product } from '../../../core/models/product.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <div class="product-management-container">
      <div class="container">
        <div class="header-section">
          <h1>Product Management</h1>
          <button (click)="showAddForm.set(true)" class="add-button">+ Add Product</button>
        </div>

        @if (showAddForm()) {
          <div class="product-form-card">
            <h2>{{ editingProduct() ? 'Edit Product' : 'Add New Product' }}</h2>
            <form (ngSubmit)="saveProduct()" class="product-form">
              <div class="form-group">
                <label for="name">Product Name</label>
                <input type="text" id="name" [(ngModel)]="productForm.name" name="name" required class="form-input" />
              </div>
              <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" [(ngModel)]="productForm.description" name="description" class="form-input"></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="price">Price</label>
                  <input type="number" id="price" [(ngModel)]="productForm.price" name="price" step="0.01" class="form-input" />
                </div>
                <div class="form-group">
                  <label for="stock">Stock</label>
                  <input type="number" id="stock" [(ngModel)]="productForm.stock" name="stock" class="form-input" />
                </div>
              </div>
              <div class="form-group">
                <label>Product Images</label>
                <div class="image-upload-section">
                  <div class="image-upload-item">
                    <label for="image1" class="image-upload-label">
                      @if (productForm.imageUrl1) {
                        <div class="image-preview">
                          <img [src]="productForm.imageUrl1" alt="Product Image 1" />
                          <button type="button" (click)="removeImage(1)" class="remove-image-btn">×</button>
                        </div>
                      } @else {
                        <div class="upload-placeholder">
                          <span>📷</span>
                          <span>Upload Image 1</span>
                        </div>
                      }
                    </label>
                    <input type="file" id="image1" accept="image/*" (change)="onImageSelected($event, 1)" style="display: none;" />
                    @if (uploadingImage1()) {
                      <div class="upload-progress">Uploading...</div>
                    }
                  </div>
                  <div class="image-upload-item">
                    <label for="image2" class="image-upload-label">
                      @if (productForm.imageUrl2) {
                        <div class="image-preview">
                          <img [src]="productForm.imageUrl2" alt="Product Image 2" />
                          <button type="button" (click)="removeImage(2)" class="remove-image-btn">×</button>
                        </div>
                      } @else {
                        <div class="upload-placeholder">
                          <span>📷</span>
                          <span>Upload Image 2</span>
                        </div>
                      }
                    </label>
                    <input type="file" id="image2" accept="image/*" (change)="onImageSelected($event, 2)" style="display: none;" />
                    @if (uploadingImage2()) {
                      <div class="upload-progress">Uploading...</div>
                    }
                  </div>
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" [disabled]="saving()" class="submit-button">Save</button>
                <button type="button" (click)="cancelEdit()" class="cancel-button">Cancel</button>
              </div>
            </form>
          </div>
        }

        @if (loading()) {
          <app-loading-spinner></app-loading-spinner>
        } @else {
          <div class="products-grid">
            @for (product of products(); track product.id) {
              <div class="product-card">
                @if (product.imageUrl1) {
                  <img [src]="product.imageUrl1" [alt]="product.name" class="product-image" />
                } @else if (product.imageUrl2) {
                  <img [src]="product.imageUrl2" [alt]="product.name" class="product-image" />
                }
                <div class="product-info">
                  <h3>{{ product.name }}</h3>
                  @if (product.description) {
                    <p class="product-description">{{ product.description }}</p>
                  }
                  @if (product.price) {
                    <p class="product-price">Rs. {{ product.price }}</p>
                  }
                  <div class="product-actions">
                    <button (click)="editProduct(product)" class="edit-button">Edit</button>
                    <button (click)="deleteProduct(product.id)" class="delete-button">Delete</button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .product-management-container {
      padding: 2rem 0;
      min-height: calc(100vh - 200px);
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .add-button {
      padding: 0.75rem 1.5rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
    }
    .add-button:hover {
      background: #2980b9;
    }
    .product-form-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    .product-form {
      margin-top: 1rem;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      box-sizing: border-box;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
    }
    .submit-button, .cancel-button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
    }
    .submit-button {
      background: #3498db;
      color: white;
    }
    .cancel-button {
      background: #e0e0e0;
      color: #333;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .product-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .product-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    .product-info {
      padding: 1rem;
    }
    .product-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    .edit-button, .delete-button {
      flex: 1;
      padding: 0.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
    }
    .edit-button {
      background: #3498db;
      color: white;
    }
    .delete-button {
      background: #e74c3c;
      color: white;
    }
    .image-upload-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .image-upload-item {
      position: relative;
    }
    .image-upload-label {
      display: block;
      cursor: pointer;
      border: 2px dashed #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      transition: border-color 0.3s;
    }
    .image-upload-label:hover {
      border-color: #3498db;
    }
    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: #999;
      padding: 2rem 1rem;
    }
    .upload-placeholder span:first-child {
      font-size: 2rem;
    }
    .image-preview {
      position: relative;
      width: 100%;
      height: 150px;
    }
    .image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 6px;
    }
    .remove-image-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: rgba(231, 76, 60, 0.9);
      color: white;
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      cursor: pointer;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .remove-image-btn:hover {
      background: rgba(231, 76, 60, 1);
    }
    .upload-progress {
      margin-top: 0.5rem;
      color: #3498db;
      font-size: 0.9rem;
      text-align: center;
    }
  `]
})
export class ProductManagementComponent implements OnInit {
  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  saving = signal<boolean>(false);
  showAddForm = signal<boolean>(false);
  editingProduct = signal<Product | null>(null);
  uploadingImage1 = signal<boolean>(false);
  uploadingImage2 = signal<boolean>(false);

  productForm: Partial<Product> = {
    name: '',
    description: '',
    price: undefined,
    stock: undefined,
    imageUrl1: '',
    imageUrl2: ''
  };

  constructor(
    private apiService: ApiService,
    private imageUploadService: ImageUploadService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.apiService.get<Product[]>('shopowner/products').subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading.set(false);
      }
    });
  }

  saveProduct(): void {
    this.saving.set(true);
    const product = { ...this.productForm };

    if (this.editingProduct()) {
      this.apiService.put<Product>(`shopowner/products/${this.editingProduct()!.id}`, product).subscribe({
        next: () => {
          this.loadProducts();
          this.cancelEdit();
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.saving.set(false);
        }
      });
    } else {
      this.apiService.post<Product>('shopowner/products', product).subscribe({
        next: () => {
          this.loadProducts();
          this.cancelEdit();
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.saving.set(false);
        }
      });
    }
  }

  editProduct(product: Product): void {
    this.editingProduct.set(product);
    this.productForm = { ...product };
    this.showAddForm.set(true);
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.apiService.delete(`shopowner/products/${productId}`).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  cancelEdit(): void {
    this.showAddForm.set(false);
    this.editingProduct.set(null);
    this.productForm = {
      name: '',
      description: '',
      price: undefined,
      stock: undefined,
      imageUrl1: '',
      imageUrl2: ''
    };
    this.saving.set(false);
  }

  onImageSelected(event: Event, imageNumber: 1 | 2): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      if (imageNumber === 1) {
        this.uploadingImage1.set(true);
        this.imageUploadService.uploadProductImage(file).subscribe({
          next: (response) => {
            this.productForm.imageUrl1 = response.imageUrl;
            this.uploadingImage1.set(false);
          },
          error: (error) => {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
            this.uploadingImage1.set(false);
          }
        });
      } else {
        this.uploadingImage2.set(true);
        this.imageUploadService.uploadProductImage(file).subscribe({
          next: (response) => {
            this.productForm.imageUrl2 = response.imageUrl;
            this.uploadingImage2.set(false);
          },
          error: (error) => {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
            this.uploadingImage2.set(false);
          }
        });
      }
    }
  }

  removeImage(imageNumber: 1 | 2): void {
    if (imageNumber === 1) {
      this.productForm.imageUrl1 = '';
    } else {
      this.productForm.imageUrl2 = '';
    }
  }
}
