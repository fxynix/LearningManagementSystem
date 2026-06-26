import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Category } from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    constructor(private api: ApiService) {}

    getCategories(params?: any): Observable<any> {
        return this.api.get('/categories', params);
    }

    getCategoryById(id: number): Observable<Category> {
        return this.api.get(`/categories/${id}`);
    }

    getAllCategories(): Observable<any> {
        return this.api.get('/categories/all');
    }

    createCategory(data: any): Observable<Category> {
        return this.api.post('/categories', data);
    }

    updateCategory(id: number, data: any): Observable<Category> {
        return this.api.patch(`/categories/${id}`, data);
    }

    deleteCategory(id: number): Observable<void> {
        return this.api.delete(`/categories/${id}`);
    }
}