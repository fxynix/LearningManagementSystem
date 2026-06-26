import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    get<T>(url: string, params?: any): Observable<T> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                const value = params[key];
                if (value !== undefined && value !== null && value !== '') {
                    httpParams = httpParams.set(key, value);
                }
            });
        }
        return this.http.get<T>(`${this.baseUrl}${url}`, { params: httpParams });
    }

    post<T>(url: string, body: any): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}${url}`, body);
    }

    patch<T>(url: string, body: any): Observable<T> {
        return this.http.patch<T>(`${this.baseUrl}${url}`, body);
    }

    delete<T>(url: string): Observable<T> {
        return this.http.delete<T>(`${this.baseUrl}${url}`);
    }
}