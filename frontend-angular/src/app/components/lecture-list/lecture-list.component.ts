import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LectureService } from '../../api/lecture.service';
import { CourseService } from '../../api/course.service';
import { AuthService } from '../../api/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-lecture-list',
    templateUrl: './lecture-list.component.html',
    styleUrls: ['./lecture-list.component.scss']
})
export class LectureListComponent implements OnInit {
    lectures: any[] = [];
    courses: any[] = [];
    loading = false;
    pageIndex = 1;
    pageSize = 10;
    total = 0;
    searchTitle = '';
    filterCourseId: number | null = null;
    isVisible = false;
    isEdit = false;
    editId: number | null = null;
    form: FormGroup;

    constructor(
        private lectureService: LectureService,
        private courseService: CourseService,
        public auth: AuthService,
        private fb: FormBuilder,
        private message: NzMessageService,
        private modal: NzModalService,
        private cdr: ChangeDetectorRef
    ) {
        this.form = this.fb.group({
            title: ['', Validators.required],
            content: [''],
            orderNumber: [null],
            courseId: [null, Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadCourses();
        this.loadLectures();
    }

    loadCourses(): void {
        this.courseService.getAllCourses().subscribe({
            next: (res) => {
                this.courses = Array.isArray(res) ? res : res.content || [];
                this.cdr.detectChanges();
            },
            error: () => this.message.error('Не удалось загрузить курсы')
        });
    }

    loadLectures(): void {
        this.loading = true;
        const params: any = {
            page: this.pageIndex - 1,
            size: this.pageSize,
            userId: this.auth.getUser()?.id,
            roles: this.auth.getRolesString()
        };
        if (this.searchTitle) params.title = this.searchTitle;
        if (this.filterCourseId) params.courseId = this.filterCourseId;
        this.lectureService.getLectures(params).subscribe({
            next: (res) => {
                this.lectures = res.content;
                this.total = res.totalElements;
                this.loading = false;
            },
            error: () => {
                this.message.error('Не удалось загрузить лекции');
                this.loading = false;
            }
        });
    }

    onPageChange(page: number): void {
        this.pageIndex = page;
        this.loadLectures();
    }

    resetFilters(): void {
        this.searchTitle = '';
        this.filterCourseId = null;
        this.pageIndex = 1;
        this.loadLectures();
    }

    canEdit(lecture: any): boolean {
        return this.auth.isAdmin() || (this.auth.isTeacher() && lecture.course?.teacher?.id === this.auth.getUser()?.id);
    }

    canCreate(): boolean {
        return this.auth.isAdmin() || this.auth.isTeacher();
    }

    showModal(data?: any): void {
        if (this.courses.length === 0) {
            this.loadCourses();
        }
        this.isEdit = !!data;
        this.editId = data?.id || null;
        this.form.reset();
        if (data) {
            this.form.patchValue({
                title: data.title,
                content: data.content,
                orderNumber: data.orderNumber,
                courseId: data.course?.id || null
            });
        }
        this.isVisible = true;
    }

    handleOk(): void {
        if (this.form.invalid) {
            Object.values(this.form.controls).forEach(c => c.markAsDirty());
            return;
        }
        const values = this.form.value;
        const obs = this.isEdit
            ? this.lectureService.updateLecture(this.editId!, values)
            : this.lectureService.createLecture(values);
        obs.subscribe({
            next: () => {
                this.message.success(this.isEdit ? 'Лекция обновлена' : 'Лекция создана');
                this.isVisible = false;
                this.loadLectures();
            },
            error: (err) => {
                this.message.error(err.error?.message || 'Ошибка сохранения');
            }
        });
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    deleteLecture(id: number): void {
        this.modal.confirm({
            nzTitle: 'Удалить лекцию?',
            nzContent: 'Это действие необратимо.',
            nzOkText: 'Удалить',
            nzCancelText: 'Отмена',
            nzOkDanger: true,
            nzOkType: 'primary',
            nzOnOk: () => {
                this.lectureService.deleteLecture(id).subscribe({
                    next: () => {
                        this.message.success('Лекция удалена');
                        this.loadLectures();
                    },
                    error: () => this.message.error('Ошибка удаления')
                });
            }
        });
    }

    searchTimeout: any;

    onSearchChange(value: string): void {
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.searchTitle = value;
            this.pageIndex = 1;
            this.loadLectures();
        }, 300);
    }
}