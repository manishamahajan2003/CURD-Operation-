import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {

  products: any[] = [];
  categories: any[] = [];

  productName = '';
  categoryId!: number;

  editMode = false;
  selectedId!: number;

  // Pagination properties
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  // Notification properties
  notification = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getProducts(this.currentPage, this.pageSize).subscribe(res => {
      this.products = res.data;
      this.totalItems = res.pagination.total;
      this.totalPages = res.pagination.totalPages;
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  addProduct() {
    if (!this.productName.trim() || !this.categoryId) return;

    // Check if product with same name and category already exists
    const existingProduct = this.products.find(p => 
      p.productName.toLowerCase().trim() === this.productName.toLowerCase().trim() && 
      Number(p.categoryId) === Number(this.categoryId)
    );

    if (existingProduct) {
      this.showNotification('Product with this name and category already exists!', 'error');
      return;
    }

    this.productService.addProduct({
      productName: this.productName,
      categoryId: this.categoryId
    }).subscribe((res: any) => {
      // Add category name to the response
      const category = this.categories.find(c => Number(c.categoryId) === Number(res.categoryId));
      if (category) {
        res.categoryName = category.categoryName;
      }
      
      this.products.unshift(res);
      this.showNotification('Product added successfully!', 'success');
      this.reset();
    });
  }

  editProduct(product: any) {
    this.editMode = true;
    this.selectedId = Number(product.productId);
    this.productName = product.productName;
    this.categoryId = product.categoryId;
  }

  updateProduct() {
    this.productService.updateProduct(this.selectedId, {
      productName: this.productName,
      categoryId: this.categoryId
    }).subscribe(() => {
      const product = this.products.find(
        p => Number(p.productId) === this.selectedId
      );
      if (product) {
        product.productName = this.productName;
        product.categoryId = this.categoryId;
        // Update category name from categories list
        const category = this.categories.find(c => Number(c.categoryId) === this.categoryId);
        if (category) {
          product.categoryName = category.categoryName;
        }
      }
      this.reset();
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(() => {
      // Reload products to show reset IDs
      this.loadProducts();
    });
  }

  reset() {
    this.productName = '';
    this.categoryId = 0;
    this.editMode = false;
    this.selectedId = 0;
    this.hideNotification();
  }

  // Notification methods
  showNotification(message: string, type: 'success' | 'error') {
    this.notification = message;
    this.notificationType = type;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }

  hideNotification() {
    this.notification = '';
  }

  // Pagination methods
  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  onPageSizeChange(newPageSize: number) {
    this.pageSize = newPageSize;
    this.currentPage = 1; // Reset to first page
    this.loadProducts();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  getEndItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  getStartItem(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }
}
