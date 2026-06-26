import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { TestAttempt } from '../models/test-attempt.model';

@Injectable({
    providedIn: 'root'
})
export class TestAttemptService {
    constructor(private api: ApiService) {}

    getTestAttempts(params?: any): Observable<any> {
        return this.api.get('/test-attempts', params);
    }

    getAllTestAttempts(): Observable<any> {
        return this.api.get('/test-attempts/all');
    }

    getTestAttemptById(id: number): Observable<TestAttempt> {
        return this.api.get(`/test-attempts/${id}`);
    }

    createTestAttempt(data: any): Observable<TestAttempt> {
        return this.api.post('/test-attempts', data);
    }

    updateTestAttempt(id: number, data: any): Observable<TestAttempt> {
        return this.api.patch(`/test-attempts/${id}`, data);
    }

    deleteTestAttempt(id: number): Observable<void> {
        return this.api.delete(`/test-attempts/${id}`);
    }
}