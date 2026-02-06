import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = environment.apiUrl + '/categories';

  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<any[]>(this.apiUrl);
  }

  addCategory(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  updateCategory(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
