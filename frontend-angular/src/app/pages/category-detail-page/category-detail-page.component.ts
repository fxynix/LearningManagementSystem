import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../api/category.service';
import { CourseService } from '../../api/course.service';
import { AuthService } from '../../api/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Location } from "@angular/common";

@Component({
    selector: 'app-category-detail-page',
    templateUrl: './category-detail-page.component.html',
    styleUrls: ['./category-detail-page.component.scss']
})
export class CategoryDetailPageComponent implements OnInit {
    category: any = null;
    courses: any[] = [];
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private categoryService: CategoryService,
        private courseService: CourseService,
        public  auth: AuthService,
        private message: NzMessageService,
        private location: Location
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.loadData(id);
        }
    }

    loadData(categoryId: number): void {
        this.loading = true;
        this.categoryService.getCategoryById(categoryId).subscribe({
            next: (cat) => {
                this.category = cat;
                const params = {
                    categoryId,
                    userId: this.auth.getUser()?.id,
                    roles: this.auth.getRolesString(),
                    size: 100
                };
                this.courseService.getCourses(params).subscribe({
                    next: (res) => {
                        this.courses = res.content || [];
                        this.loading = false;
                    },
                    error: () => {
                        this.message.error('Не удалось загрузить курсы');
                        this.loading = false;
                    }
                });
            },
            error: () => {
                this.message.error('Не удалось загрузить категорию');
                this.loading = false;
            }
        });
    }

    goBack(): void {
        this.location.back();
    }

    navigateToCourse(id: number): void {
        this.router.navigate(['/courses', id]);
    }
}