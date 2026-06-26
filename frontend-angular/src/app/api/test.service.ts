import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Test } from '../models/test.model';

@Injectable({
    providedIn: 'root'
})
export class TestService {
    constructor(private api: ApiService) {}

    getTests(params?: any): Observable<any> {
        return this.api.get('/tests', params);
    }

    getAllTests(): Observable<any> {
        return this.api.get('/tests/all');
    }

    getTestById(id: number): Observable<Test> {
        return this.api.get(`/tests/${id}`);
    }

    createTest(data: any): Observable<Test> {
        return this.api.post('/tests', data);
    }

    updateTest(id: number, data: any): Observable<Test> {
        return this.api.patch(`/tests/${id}`, data);
    }

    deleteTest(id: number): Observable<void> {
        return this.api.delete(`/tests/${id}`);
    }
}