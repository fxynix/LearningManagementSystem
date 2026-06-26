import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestService } from '../../api/test.service';
import { CourseService } from '../../api/course.service';
import { AuthService } from '../../api/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { formatDateTime } from '../../utils/date-utils';

@Component({
    selector: 'app-test-list',
    templateUrl: './test-list.component.html',
    styleUrls: ['./test-list.component.scss']
})
export class TestListComponent implements OnInit {
    tests: any[] = [];
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
        private testService: TestService,
        private courseService: CourseService,
        public auth: AuthService,
        private fb: FormBuilder,
        private message: NzMessageService,
        private modal: NzModalService,
        private cdr: ChangeDetectorRef
    ) {
        this.form = this.fb.group({
            title: ['', Validators.required],
            description: [''],
            content: ['', Validators.required],
            questionsCount: [null, [Validators.required, Validators.min(1)]],
            courseId: [null, Validators.required],
            startDate: [null],
            endDate: [null],
            maxDurationMinutes: [null],
            maxAttempts: [null]
        });
    }

    ngOnInit(): void {
        this.loadCourses();
        this.loadTests();
    }

    formatDate(date: string): string {
        return formatDateTime(date);
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

    loadTests(): void {
        this.loading = true;
        const params: any = {
            page: this.pageIndex - 1,
            size: this.pageSize,
            userId: this.auth.getUser()?.id,
            roles: this.auth.getRolesString()
        };
        if (this.searchTitle) params.title = this.searchTitle;
        if (this.filterCourseId) params.courseId = this.filterCourseId;
        this.testService.getTests(params).subscribe({
            next: (res) => {
                this.tests = res.content;
                this.total = res.totalElements;
                this.loading = false;
            },
            error: () => {
                this.message.error('Не удалось загрузить тесты');
                this.loading = false;
            }
        });
    }

    onPageChange(page: number): void {
        this.pageIndex = page;
        this.loadTests();
    }

    resetFilters(): void {
        this.searchTitle = '';
        this.filterCourseId = null;
        this.pageIndex = 1;
        this.loadTests();
    }

    canEdit(test: any): boolean {
        return this.auth.isAdmin() || (this.auth.isTeacher() && test.course?.teacher?.id === this.auth.getUser()?.id);
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
                description: data.description,
                content: data.content,
                questionsCount: data.questionsCount,
                courseId: data.course?.id || null,
                startDate: data.startDate,
                endDate: data.endDate,
                maxDurationMinutes: data.maxDurationMinutes,
                maxAttempts: data.maxAttempts
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
            ? this.testService.updateTest(this.editId!, values)
            : this.testService.createTest(values);
        obs.subscribe({
            next: () => {
                this.message.success(this.isEdit ? 'Тест обновлён' : 'Тест создан');
                this.isVisible = false;
                this.loadTests();
            },
            error: (err) => {
                this.message.error(err.error?.message || 'Ошибка сохранения');
            }
        });
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    deleteTest(id: number): void {
        this.modal.confirm({
            nzTitle: 'Удалить тест?',
            nzContent: 'Это действие необратимо.',
            nzOkText: 'Удалить',
            nzCancelText: 'Отмена',
            nzOkDanger: true,
            nzOkType: 'primary',
            nzOnOk: () => {
                this.testService.deleteTest(id).subscribe({
                    next: () => {
                        this.message.success('Тест удалён');
                        this.loadTests();
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
            this.loadTests();
        }, 300);
    }
}