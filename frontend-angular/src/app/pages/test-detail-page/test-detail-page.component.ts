import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestService } from '../../api/test.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Location } from "@angular/common";

@Component({
    selector: 'app-test-detail-page',
    templateUrl: './test-detail-page.component.html',
    styleUrls: ['./test-detail-page.component.scss']
})
export class TestDetailPageComponent implements OnInit {
    test: any = null;
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private testService: TestService,
        private message: NzMessageService,
        private location: Location
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.loadTest(id);
        }
    }

    loadTest(id: number): void {
        this.loading = true;
        this.testService.getTestById(id).subscribe({
            next: (data) => {
                this.test = data;
                this.loading = false;
            },
            error: () => {
                this.message.error('Не удалось загрузить тест');
                this.loading = false;
            }
        });
    }

    goBack(): void {
        this.location.back();
    }

    startTest(): void {
        this.router.navigate(['/tests', this.test.id, 'pass']);
    }
}