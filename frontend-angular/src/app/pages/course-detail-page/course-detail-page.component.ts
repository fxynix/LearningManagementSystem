import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../api/course.service';
import { LectureService } from '../../api/lecture.service';
import { TestService } from '../../api/test.service';
import { AuthService } from '../../api/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Location } from "@angular/common";

@Component({
    selector: 'app-course-detail-page',
    templateUrl: './course-detail-page.component.html',
    styleUrls: ['./course-detail-page.component.scss']
})
export class CourseDetailPageComponent implements OnInit {
    course: any = null;
    lectures: any[] = [];
    tests: any[] = [];
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private courseService: CourseService,
        private lectureService: LectureService,
        private testService: TestService,
        public  auth: AuthService,
        private message: NzMessageService,
        private location: Location
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.loadData(id);
        }
    }

    loadData(courseId: number): void {
        this.loading = true;
        const userId = this.auth.getUser()?.id;
        const roles = this.auth.getRolesString();
        const params = { userId, roles, size: 100 };

        this.courseService.getCourseById(courseId).subscribe({
            next: (course) => {
                this.course = course;
                // load lectures
                this.lectureService.getLectures({ ...params, courseId }).subscribe({
                    next: (res) => { this.lectures = res.content || []; },
                    error: () => this.message.error('Не удалось загрузить лекции')
                });
                this.testService.getTests({ ...params, courseId }).subscribe({
                    next: (res) => { this.tests = res.content || []; },
                    error: () => this.message.error('Не удалось загрузить тесты')
                });
                this.loading = false;
            },
            error: () => {
                this.message.error('Не удалось загрузить курс');
                this.loading = false;
            }
        });
    }

    goBack(): void {
        this.location.back();
    }
}