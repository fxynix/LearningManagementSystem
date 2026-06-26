import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../api/course.service';
import { CategoryService } from '../../api/category.service';
import { UserService } from '../../api/user.service';
import { RoleService } from '../../api/role.service';
import { AuthService } from '../../api/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-course-list',
    templateUrl: './course-list.component.html',
    styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
    courses: any[] = [];
    categories: any[] = [];
    teachers: any[] = [];
    roles: any[] = [];
    loading = false;
    pageIndex = 1;
    pageSize = 10;
    total = 0;
    searchTitle = '';
    filterCategoryId: number | null = null;
    filterTeacherId: number | null = null;
    isVisible = false;
    isEdit = false;
    editId: number | null = null;
    form: FormGroup;

    constructor(
        private courseService: CourseService,
        private categoryService: CategoryService,
        private userService: UserService,
        private roleService: RoleService,
        public auth: AuthService,
        private fb: FormBuilder,
        private message: NzMessageService,
        private modal: NzModalService,
        private cdr: ChangeDetectorRef
    ) {
        this.form = this.fb.group({
            title: ['', Validators.required],
            description: [''],
            categoryId: [null],
            teacherId: [null, Validators.required],
            roleIds: [[]]
        });
    }

    ngOnInit(): void {
        this.loadSelectData();
        this.loadCourses();
    }

    loadSelectData(): void {
        this.categoryService.getAllCategories().subscribe({
            next: (res) => {
                this.categories = Array.isArray(res) ? res : res.content || [];
                this.cdr.detectChanges();
            },
            error: () => this.message.error('Не удалось загрузить категории')
        });
        this.userService.getAllUsers().subscribe({
            next: (res) => {
                this.teachers = Array.isArray(res) ? res : res.content || [];
                this.cdr.detectChanges();
            },
            error: () => this.message.error('Не удалось загрузить преподавателей')
        });
        this.roleService.getAllRoles().subscribe({
            next: (res) => {
                this.roles = Array.isArray(res) ? res : res.content || [];
                this.cdr.detectChanges();
            },
            error: () => this.message.error('Не удалось загрузить роли')
        });
    }

    loadCourses(): void {
        this.loading = true;
        const params: any = {
            page: this.pageIndex - 1,
            size: this.pageSize,
            userId: this.auth.getUser()?.id,
            roles: this.auth.getRolesString()
        };
        if (this.searchTitle) params.title = this.searchTitle;
        if (this.filterCategoryId) params.categoryId = this.filterCategoryId;
        if (this.filterTeacherId) params.teacherId = this.filterTeacherId;
        this.courseService.getCourses(params).subscribe({
            next: (res) => {
                this.courses = res.content;
                this.total = res.totalElements;
                this.loading = false;
            },
            error: () => {
                this.message.error('Не удалось загрузить курсы');
                this.loading = false;
            }
        });
    }

    onPageChange(page: number): void {
        this.pageIndex = page;
        this.loadCourses();
    }

    resetFilters(): void {
        this.searchTitle = '';
        this.filterCategoryId = null;
        this.filterTeacherId = null;
        this.pageIndex = 1;
        this.loadCourses();
    }

    canEdit(course: any): boolean {
        return this.auth.isAdmin() || (this.auth.isTeacher() && course.teacher?.id === this.auth.getUser()?.id);
    }

    canCreate(): boolean {
        return this.auth.isAdmin() || this.auth.isTeacher();
    }

    showModal(data?: any): void {
        if (this.categories.length === 0 || this.teachers.length === 0 || this.roles.length === 0) {
            this.loadSelectData();
        }
        this.isEdit = !!data;
        this.editId = data?.id || null;
        this.form.reset();
        if (data) {
            this.form.patchValue({
                title: data.title,
                description: data.description,
                categoryId: data.category?.id || null,
                teacherId: data.teacher?.id || null,
                roleIds: data.roles?.map((r: any) => r.id) || []
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
            ? this.courseService.updateCourse(this.editId!, values)
            : this.courseService.createCourse(values);
        obs.subscribe({
            next: () => {
                this.message.success(this.isEdit ? 'Курс обновлён' : 'Курс создан');
                this.isVisible = false;
                this.loadCourses();
            },
            error: (err) => {
                this.message.error(err.error?.message || 'Ошибка сохранения');
            }
        });
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    deleteCourse(id: number): void {
        this.modal.confirm({
            nzTitle: 'Удалить курс?',
            nzContent: 'Это действие необратимо.',
            nzOkText: 'Удалить',
            nzCancelText: 'Отмена',
            nzOkDanger: true,
            nzOnOk: () => {
                this.courseService.deleteCourse(id).subscribe({
                    next: () => {
                        this.message.success('Курс удалён');
                        this.loadCourses();
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
            this.loadCourses();
        }, 300);
    }

    onFilterChange(): void {
        this.pageIndex = 1;
        this.loadCourses();
    }
}