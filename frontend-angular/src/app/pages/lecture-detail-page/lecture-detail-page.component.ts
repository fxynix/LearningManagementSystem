import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LectureService } from '../../api/lecture.service';
import { decodeHtml } from '../../utils/decode-html';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Location } from "@angular/common";

@Component({
    selector: 'app-lecture-detail-page',
    templateUrl: './lecture-detail-page.component.html',
    styleUrls: ['./lecture-detail-page.component.scss']
})
export class LectureDetailPageComponent implements OnInit {
    lecture: any = null;
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private lectureService: LectureService,
        private message: NzMessageService,
        private location: Location
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.loadLecture(id);
        }
    }

    loadLecture(id: number): void {
        this.loading = true;
        this.lectureService.getLectureById(id).subscribe({
            next: (data) => {
                this.lecture = data;
                this.loading = false;
            },
            error: () => {
                this.message.error('Не удалось загрузить лекцию');
                this.loading = false;
            }
        });
    }

    goBack(): void {
        this.location.back();
    }

    get decodedContent(): string {
        return decodeHtml(this.lecture?.content || '');
    }
}