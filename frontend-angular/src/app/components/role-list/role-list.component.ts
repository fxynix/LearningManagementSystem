import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../api/role.service';
import { UserService } from '../../api/user.service';
import { AuthService } from '../../api/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-role-list',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {
    roles: any[] = [];
    users: any[] = [];
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
        private roleService: RoleService,
        private userService: UserService,
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
        this.loadUsers();
        this.loadRoles();
    }

    loadUsers(): void {
        this.userService.getAllUsers().subscribe({
            next: (res) => {
                this.users = Array.isArray(res) ? res : res.content || [];
            },
            error: () => this.message.error('Не удалось загрузить пользователей')
        });
    }

    loadRoles(): void {
        this.loading = true;
        const params = {
            page: this.pageIndex - 1,
            size: this.pageSize,
            name: this.searchName || undefined
        };
        this.roleService.getRoles(params).subscribe({
            next: (res) => {
                this.roles = res.content;
                this.total = res.totalElements;
                this.loading = false;
            },
            error: () => {
                this.message.error('Не удалось загрузить роли');
                this.loading = false;
            }
        });
    }

    onPageChange(page: number): void {
        this.pageIndex = page;
        this.loadRoles();
    }

    resetSearch(): void {
        this.searchName = '';
        this.pageIndex = 1;
        this.loadRoles();
    }

    getUserCountForRole(roleId: number): number {
        return this.users.filter(u => u.roles.some((r: any) => r.id === roleId)).length;
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
            ? this.roleService.updateRole(this.editId!, values)
            : this.roleService.createRole(values);
        obs.subscribe({
            next: () => {
                this.message.success(this.isEdit ? 'Роль обновлена' : 'Роль создана');
                this.isVisible = false;
                this.loadRoles();
            },
            error: (err) => {
                if (err.status === 409) {
                    this.message.error('Роль с таким названием уже существует');
                } else {
                    this.message.error(err.error?.message || 'Ошибка сохранения');
                }
            }
        });
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    deleteRole(id: number): void {
        this.modal.confirm({
            nzTitle: 'Удалить роль?',
            nzContent: 'Это действие необратимо.',
            nzOkText: 'Удалить',
            nzCancelText: 'Отмена',
            nzOkDanger: true,
            nzOnOk: () => {
                this.roleService.deleteRole(id).subscribe({
                    next: () => {
                        this.message.success('Роль удалена');
                        this.loadRoles();
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
            this.loadRoles();
        }, 300);
    }
}