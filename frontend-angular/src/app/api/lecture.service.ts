import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Lecture } from '../models/lecture.model';

@Injectable({
    providedIn: 'root'
})
export class LectureService {
    constructor(private api: ApiService) {}

    getLectures(params?: any): Observable<any> {
        return this.api.get('/lectures', params);
    }

    getAllLectures(): Observable<any> {
        return this.api.get('/lectures/all');
    }

    getLectureById(id: number): Observable<Lecture> {
        return this.api.get(`/lectures/${id}`);
    }

    createLecture(data: any): Observable<Lecture> {
        return this.api.post('/lectures', data);
    }

    updateLecture(id: number, data: any): Observable<Lecture> {
        return this.api.patch(`/lectures/${id}`, data);
    }

    deleteLecture(id: number): Observable<void> {
        return this.api.delete(`/lectures/${id}`);
    }
}