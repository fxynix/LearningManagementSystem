import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../api/user.service';
import { RoleService } from '../../api/role.service';
import { AuthService } from '../../api/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
    users: any[] = [];
    roles: any[] = [];
    loading = false;
    pageIndex = 1;
    pageSize = 10;
    total = 0;
    searchUsername = '';
    isVisible = false;
    isEdit = false;
    editId: number | null = null;
    form: FormGroup;

    constructor(
        private userService: UserService,
        private roleService: RoleService,
        public auth: AuthService,
        private fb: FormBuilder,
        private message: NzMessageService,
        private modal: NzModalService,
        private cdr: ChangeDetectorRef
    ) {
        this.form = this.fb.group({
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.minLength(6)]],
            fullName: [''],
            roleIds: [[]]
        });
    }

    ngOnInit(): void {
        this.loadUsers();
        this.loadRoles();
    }

    loadUsers(): void {
        this.loading = true;
        const params = {
            page: this.pageIndex - 1,
            size: this.pageSize,
            username: this.searchUsername || undefined
        };
        this.userService.getUsers(params).subscribe({
            next: (res) => {
                this.users = res.content;
                this.total = res.totalElements;
                this.loading = false;
            },
            error: () => {
                this.message.error('Не удалось загрузить пользователей');
                this.loading = false;
            }
        });
    }

    loadRoles(): void {
        this.roleService.getAllRoles().subscribe({
            next: (res) => {
                this.roles = Array.isArray(res) ? res : res.content || [];
                this.cdr.detectChanges();
            },
            error: () => this.message.error('Не удалось загрузить роли')
        });
    }

    onPageChange(page: number): void {
        this.pageIndex = page;
        this.loadUsers();
    }

    resetSearch(): void {
        this.searchUsername = '';
        this.pageIndex = 1;
        this.loadUsers();
    }

    showModal(data?: any): void {
        if (this.roles.length === 0) {
            this.loadRoles();
        }
        this.isEdit = !!data;
        this.editId = data?.id || null;
        this.form.reset();
        if (data) {
            this.form.patchValue({
                username: data.username,
                email: data.email,
                fullName: data.fullName,
                roleIds: data.roles.map((r: any) => r.id)
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
            ? this.userService.updateUser(this.editId!, values)
            : this.userService.createUser(values);
        obs.subscribe({
            next: () => {
                this.message.success(this.isEdit ? 'Пользователь обновлён' : 'Пользователь создан');
                this.isVisible = false;
                this.loadUsers();
            },
            error: (err) => {
                const msg = err.error?.message || 'Ошибка сохранения';
                this.message.error(msg);
            }
        });
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    deleteUser(id: number): void {
        this.modal.confirm({
            nzTitle: 'Удалить пользователя?',
            nzContent: 'Это действие необратимо.',
            nzOkText: 'Удалить',
            nzCancelText: 'Отмена',
            nzOkDanger: true,
            nzOnOk: () => {
                this.userService.deleteUser(id).subscribe({
                    next: () => {
                        this.message.success('Пользователь удалён');
                        this.loadUsers();
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
            this.searchUsername = value;
            this.pageIndex = 1;
            this.loadUsers();
        }, 300);
    }
}