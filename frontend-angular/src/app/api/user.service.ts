import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private api: ApiService) {}

    getUsers(params?: any): Observable<any> {
        return this.api.get('/users', params);
    }

    getAllUsers(): Observable<any> {
        return this.api.get('/users/all');
    }

    getUserById(id: number): Observable<User> {
        return this.api.get(`/users/${id}`);
    }

    createUser(data: any): Observable<User> {
        return this.api.post('/users', data);
    }

    updateUser(id: number, data: any): Observable<User> {
        return this.api.patch(`/users/${id}`, data);
    }

    deleteUser(id: number): Observable<void> {
        return this.api.delete(`/users/${id}`);
    }
}