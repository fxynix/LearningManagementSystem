import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Course } from '../models/course.model';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    constructor(private api: ApiService) {}

    getCourses(params?: any): Observable<any> {
        return this.api.get('/courses', params);
    }

    getCourseById(id: number): Observable<Course> {
        return this.api.get(`/courses/${id}`);
    }

    getAllCourses(): Observable<any> {
        return this.api.get('/courses/all');
    }

    createCourse(data: any): Observable<Course> {
        return this.api.post('/courses', data);
    }

    updateCourse(id: number, data: any): Observable<Course> {
        return this.api.patch(`/courses/${id}`, data);
    }

    deleteCourse(id: number): Observable<void> {
        return this.api.delete(`/courses/${id}`);
    }
}