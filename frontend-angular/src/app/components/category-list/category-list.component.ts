import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../api/category.service';
import { AuthService } from '../../api/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
    categories: any[] = [];
    loading = false;
    pageIndex = 1;
    pageSize = 10;
    total = 0;
    searchName = '';
    isVisible = false;
    isEdit = false;
    editId: number | null = null;
    form: FormGroup;

    constructor(
        private categoryService: CategoryService,
        public auth: AuthService,
        private fb: FormBuilder,
        private message: NzMessageService,
        private modal: NzModalService
    ) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            description: ['']
        });
    }

    ngOnInit(): void {
        this.loadCategories();
    }

    canManage(): boolean {
        return this.auth.isAdmin() || this.auth.isTeacher();
    }

    loadCategories(): void {
        this.loading = true;
        const params = {
            page: this.pageIndex - 1,
            size: this.pageSize,
            name: this.searchName || undefined
        };
        this.categoryService.getCategories(params).subscribe({
            next: (res) => {
                this.categories = res.content;
                this.total = res.totalElements;
                this.loading = false;
            },
            error: () => {
                this.message.error('Не удалось загрузить категории');
                this.loading = false;
            }
        });
    }

    onPageChange(page: number): void {
        this.pageIndex = page;
        this.loadCategories();
    }

    resetSearch(): void {
        this.searchName = '';
        this.pageIndex = 1;
        this.loadCategories();
    }

    showModal(data?: any): void {
        this.isEdit = !!data;
        this.editId = data?.id || null;
        this.form.reset();
        if (data) {
            this.form.patchValue({
                name: data.name,
                description: data.description
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
            ? this.categoryService.updateCategory(this.editId!, values)
            : this.categoryService.createCategory(values);
        obs.subscribe({
            next: () => {
                this.message.success(this.isEdit ? 'Категория обновлена' : 'Категория создана');
                this.isVisible = false;
                this.loadCategories();
            },
            error: (err) => {
                if (err.status === 409) {
                    this.message.error('Категория с таким названием уже существует');
                } else {
                    this.message.error(err.error?.message || 'Ошибка сохранения');
                }
            }
        });
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    deleteCategory(id: number): void {
        this.modal.confirm({
            nzTitle: 'Удалить категорию?',
            nzContent: 'Это действие необратимо.',
            nzOkText: 'Удалить',
            nzCancelText: 'Отмена',
            nzOkDanger: true,
            nzOkType: 'primary',
            nzOnOk: () => {
                this.categoryService.deleteCategory(id).subscribe({
                    next: () => {
                        this.message.success('Категория удалена');
                        this.loadCategories();
                    },
                    error: () => this.message.error('Ошибка удаления')
                });
            }
        });
    }

    isAdmin(): boolean {
        return this.auth.isAdmin();
    }

    searchTimeout: any;

    onSearchChange(value: string): void {
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.searchName = value;
            this.pageIndex = 1;
            this.loadCategories();
        }, 300);
    }
}