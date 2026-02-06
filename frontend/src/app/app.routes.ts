import { Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';

export const routes: Routes = [
  { path: 'categories', component: CategoryComponent },
  { path: 'products', component: ProductComponent },
  { path: '', redirectTo: 'categories', pathMatch: 'full' }
];


