import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../../api/role.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Location } from "@angular/common";

@Component({
    selector: 'app-role-detail-page',
    templateUrl: './role-detail-page.component.html',
    styleUrls: ['./role-detail-page.component.scss']
})
export class RoleDetailPageComponent implements OnInit {
    role: any = null;
    users: any[] = [];
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private roleService: RoleService,
        private message: NzMessageService,
        private location: Location
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.loadData(id);
        }
    }

    loadData(roleId: number): void {
        this.loading = true;
        this.roleService.getRoleById(roleId).subscribe({
            next: (role) => {
                this.role = role;
                this.roleService.getUsersByRole(roleId).subscribe({
                    next: (users) => {
                        this.users = users;
                        this.loading = false;
                    },
                    error: () => {
                        this.message.error('Не удалось загрузить пользователей');
                        this.loading = false;
                    }
                });
            },
            error: () => {
                this.message.error('Не удалось загрузить роль');
                this.loading = false;
            }
        });
    }

    goBack(): void {
        this.location.back();
    }
}