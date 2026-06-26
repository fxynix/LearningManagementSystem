import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../api/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;

    constructor(
        private fb: FormBuilder,
        public  auth: AuthService,
        private router: Router,
        private message: NzMessageService
    ) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        if (this.auth.getUser()) {
            this.router.navigate(['/']);
        }
    }

    submitForm(): void {
        if (this.loginForm.invalid) {
            Object.values(this.loginForm.controls).forEach(c => c.markAsDirty());
            return;
        }
        this.loading = true;
        const { username, password } = this.loginForm.value;
        this.auth.login({ username, password }).subscribe({
            next: () => {
                this.message.success('Вы вошли как ' + this.auth.getUser()?.roleDescription);
                this.router.navigate(['/']);
                this.loading = false;
            },
            error: (err) => {
                const msg = err.error?.message || 'Ошибка входа';
                this.message.error(msg);
                this.loading = false;
            }
        });
    }
}