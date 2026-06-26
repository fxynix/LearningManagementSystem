import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../api/course.service';
import { AuthService } from '../../api/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-courses-page',
    templateUrl: './courses-page.component.html',
    styleUrls: ['./courses-page.component.scss']
})
export class CoursesPageComponent implements OnInit {
    courses: any[] = [];
    loading = true;

    constructor(
        private courseService: CourseService,
        private auth: AuthService,
        private router: Router,
        private message: NzMessageService
    ) {}

    ngOnInit(): void {
        this.loadCourses();
    }

    loadCourses(): void {
        this.loading = true;
        const user = this.auth.getUser();
        if (!user) {
            this.message.error('Пользователь не авторизован');
            this.loading = false;
            return;
        }
        const params = {
            userId: user.id,
            roles: this.auth.getRolesString(),
            size: 100
        };
        this.courseService.getCourses(params)
            .pipe(
                catchError(() => {
                    this.message.error('Не удалось загрузить курсы');
                    this.courses = [];
                    this.loading = false;
                    return of({ content: [] });
                }),
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe({
                next: (res) => {
                    this.courses = res.content || [];
                }
            });
    }

    get groupedCourses(): { [key: string]: any[] } {
        if (!Array.isArray(this.courses)) return {};
        return this.courses.reduce((acc, course) => {
            const catName = course.category?.name || 'Без категории';
            if (!acc[catName]) acc[catName] = [];
            acc[catName].push(course);
            return acc;
        }, {} as { [key: string]: any[] });
    }

    navigateToCourse(id: number): void {
        this.router.navigate(['/courses', id]);
    }

    trackByCategory(index: number, item: any): string {
        return item.key;
    }

    trackByCourse(index: number, course: any): number {
        return course.id;
    }
}