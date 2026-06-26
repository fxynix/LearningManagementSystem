import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    constructor(private api: ApiService) {}

    getRoles(params?: any): Observable<any> {
        return this.api.get('/roles', params);
    }

    getAllRoles(): Observable<any> {
        return this.api.get('/roles/all');
    }

    getRoleById(id: number): Observable<Role> {
        return this.api.get(`/roles/${id}`);
    }

    getUsersByRole(id: number): Observable<User[]> {
        return this.api.get(`/roles/${id}/users`);
    }

    createRole(data: any): Observable<Role> {
        return this.api.post('/roles', data);
    }

    updateRole(id: number, data: any): Observable<Role> {
        return this.api.patch(`/roles/${id}`, data);
    }

    deleteRole(id: number): Observable<void> {
        return this.api.delete(`/roles/${id}`);
    }
}