import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestAttemptService } from '../../api/test-attempt.service';
import { TestService } from '../../api/test.service';
import { UserService } from '../../api/user.service';
import { AuthService } from '../../api/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { formatDateTime } from '../../utils/date-utils';

@Component({
    selector: 'app-test-attempt-list',
    templateUrl: './test-attempt-list.component.html',
    styleUrls: ['./test-attempt-list.component.scss']
})
export class TestAttemptListComponent implements OnInit {
    attempts: any[] = [];
    tests: any[] = [];
    users: any[] = [];
    loading = false;
    pageIndex = 1;
    pageSize = 10;
    total = 0;
    searchTestTitle = '';
    searchUserUsername = '';
    isVisible = false;
    isEdit = false;
    editId: number | null = null;
    form: FormGroup;

    constructor(
        private testAttemptService: TestAttemptService,
        private testService: TestService,
        private userService: UserService,
        public auth: AuthService,
        private fb: FormBuilder,
        private message: NzMessageService,
        private modal: NzModalService,
        private cdr: ChangeDetectorRef
    ) {
        this.form = this.fb.group({
            testId: [null, Validators.required],
            userId: [null, Validators.required],
            attemptNumber: [null, [Validators.required, Validators.min(1)]],
            startTime: [null],
            endTime: [null],
            score: [null],
            status: [null]
        });
    }

    ngOnInit(): void {
        this.loadSelectData();
        this.loadAttempts();
    }

    formatDate(date: string): string {
        return formatDateTime(date);
    }

    translateStatus(status: string): string {
        const map: { [key: string]: string } = {
            'IN_PROGRESS': 'В процессе',
            'COMPLETED': 'Завершено'
        };
        return map[status] || status;
    }

    formatDateForInput(date: string | null): string | null {
        if (!date) return null;
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    loadSelectData(): void {
        this.testService.getAllTests().subscribe({
            next: (res) => {
                this.tests = Array.isArray(res) ? res : res.content || [];
                this.cdr.detectChanges();
            },
            error: () => {
                this.message.error('Не удалось загрузить тесты');
            }
        });
        this.userService.getAllUsers().subscribe({
            next: (res) => {
                this.users = Array.isArray(res) ? res : res.content || [];
                this.cdr.detectChanges();
            },
            error: () => {
                this.message.error('Не удалось загрузить пользователей');
            }
        });
    }

    loadAttempts(): void {
        this.loading = true;
        const params: any = {
            page: this.pageIndex - 1,
            size: this.pageSize,
            currentUserId: this.auth.getUser()?.id,
            roles: this.auth.getRolesString()
        };
        if (this.searchTestTitle) params.testTitle = this.searchTestTitle;
        if (this.searchUserUsername) params.userUsername = this.searchUserUsername;
        this.testAttemptService.getTestAttempts(params).subscribe({
            next: (res) => {
                this.attempts = res.content;
                this.total = res.totalElements;
                this.loading = false;
            },
            error: () => {
                this.message.error('Не удалось загрузить попытки');
                this.loading = false;
            }
        });
    }

    onPageChange(page: number): void {
        this.pageIndex = page;
        this.loadAttempts();
    }

    resetFilters(): void {
        this.searchTestTitle = '';
        this.searchUserUsername = '';
        this.pageIndex = 1;
        this.loadAttempts();
    }

    canManage(): boolean {
        return this.auth.isAdmin();
    }

    showModal(data?: any): void {
        if (this.tests.length === 0 || this.users.length === 0) {
            this.loadSelectData();
        }
        this.isEdit = !!data;
        this.editId = data?.id || null;
        this.form.reset();
        if (data) {
            this.form.patchValue({
                testId: data.test?.id || null,
                userId: data.user?.id || null,
                attemptNumber: data.attemptNumber,
                startTime: this.formatDateForInput(data.startTime),
                endTime: this.formatDateForInput(data.endTime),
                score: data.score,
                status: data.status
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
            ? this.testAttemptService.updateTestAttempt(this.editId!, values)
            : this.testAttemptService.createTestAttempt(values);
        obs.subscribe({
            next: () => {
                this.message.success(this.isEdit ? 'Попытка обновлена' : 'Попытка создана');
                this.isVisible = false;
                this.loadAttempts();
            },
            error: (err) => {
                this.message.error(err.error?.message || 'Ошибка сохранения');
            }
        });
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    deleteAttempt(id: number): void {
        this.modal.confirm({
            nzTitle: 'Удалить попытку?',
            nzContent: 'Это действие необратимо.',
            nzOkText: 'Удалить',
            nzCancelText: 'Отмена',
            nzOkDanger: true,
            nzOkType: 'primary',
            nzOnOk: () => {
                this.testAttemptService.deleteTestAttempt(id).subscribe({
                    next: () => {
                        this.message.success('Попытка удалена');
                        this.loadAttempts();
                    },
                    error: () => this.message.error('Ошибка удаления')
                });
            }
        });
    }

    searchTimeout: any;

    onSearchChange1(value: string): void {
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.searchTestTitle = value;
            this.pageIndex = 1;
            this.loadAttempts();
        }, 300);
    }

    onSearchChange2(value: string): void {
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.searchUserUsername = value;
            this.pageIndex = 1;
            this.loadAttempts();
        }, 300);
    }
}