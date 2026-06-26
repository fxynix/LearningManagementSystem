import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    id: number;
    username: string;
    roles: string[];
    roleDescription: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly storageKey = 'user';
    private user: LoginResponse | null = null;

    constructor(private http: HttpClient) {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            this.user = JSON.parse(saved);
        }
    }

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
            tap(user => {
                this.user = user;
                localStorage.setItem(this.storageKey, JSON.stringify(user));
            })
        );
    }

    logout(): void {
        this.user = null;
        localStorage.removeItem(this.storageKey);
    }

    getUser(): LoginResponse | null {
        return this.user;
    }

    isAdmin(): boolean {
        return this.user?.roles?.includes('ADMIN') || false;
    }

    isTeacher(): boolean {
        return this.user?.roles?.includes('TEACHER') || false;
    }

    isStudent(): boolean {
        return !this.isAdmin() && !this.isTeacher();
    }

    getRolesString(): string {
        return this.user?.roles?.join(',') || '';
    }
}