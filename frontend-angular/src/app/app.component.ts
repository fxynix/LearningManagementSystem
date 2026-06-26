import { Component } from '@angular/core';
import { AuthService } from './api/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(public auth: AuthService, private router: Router) {}

    logout(): void {
        this.auth.logout();
        this.router.navigate(['/login']);
    }
}