import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit {

  categories: any[] = [];
  categoryName = '';

  editMode = false;
  selectedId!: number;

  // Notification properties
  notification = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  addCategory() {
    if (!this.categoryName.trim()) return;

    // Check if category already exists
    const existingCategory = this.categories.find(cat => 
      cat.categoryName.toLowerCase().trim() === this.categoryName.toLowerCase().trim()
    );

    if (existingCategory) {
      this.showNotification('Category already exists!', 'error');
      return;
    }

    this.categoryService.addCategory({ categoryName: this.categoryName })
      .subscribe((res: any) => {
        this.categories.unshift(res);
        this.showNotification('Category added successfully!', 'success');
        this.reset();
      });
  }

  editCategory(cat: any) {
    console.log('EDIT CLICKED', cat); // 🔥 DEBUG
    this.editMode = true;
    this.selectedId = Number(cat.categoryId);
    this.categoryName = cat.categoryName;
  }

  updateCategory() {
    this.categoryService.updateCategory(this.selectedId, {
      categoryName: this.categoryName
    }).subscribe(() => {
      const cat = this.categories.find(
        c => Number(c.categoryId) === this.selectedId
      );
      if (cat) cat.categoryName = this.categoryName;
      this.reset();
    });
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe(() => {
      // Reload categories to show reset IDs
      this.loadCategories();
    });
  }

  reset() {
    this.categoryName = '';
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
}
