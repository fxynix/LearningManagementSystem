import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestService } from '../../api/test.service';
import { TestAttemptService } from '../../api/test-attempt.service';
import { AuthService } from '../../api/auth.service';
import { parseGift, GiftQuestion } from '../../utils/gift-parser';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Location } from '@angular/common';

@Component({
    selector: 'app-test-pass-page',
    templateUrl: './test-pass-page.component.html',
    styleUrls: ['./test-pass-page.component.scss']
})
export class TestPassPageComponent implements OnInit {
    test: any = null;
    questions: GiftQuestion[] = [];
    answers: { [key: number]: any } = {};
    currentIndex = 0;
    loading = true;
    submitting = false;
    attemptId: number | null = null;
    testId: number = 0;

    // Для чекбоксов будем хранить отдельно массивы выбранных значений
    // Но можно и так: answers уже хранит массив выбранных текстов.

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private testService: TestService,
        private testAttemptService: TestAttemptService,
        public auth: AuthService,
        private message: NzMessageService,
        private location: Location
    ) {}

    ngOnInit(): void {
        this.testId = Number(this.route.snapshot.paramMap.get('id'));
        if (this.testId) {
            this.initTest();
        }
    }

    initTest(): void {
        this.loading = true;
        const userId = this.auth.getUser()?.id;
        const roles = this.auth.getRolesString();

        this.testService.getTestById(this.testId).subscribe({
            next: (test) => {
                this.test = test;
                const parsed = parseGift(test.content);
                this.questions = parsed;
                this.answers = {};
                this.questions.forEach((q, idx) => {
                    if (q.type === 'short' || q.type === 'numeric' || q.type === 'essay') {
                        this.answers[idx] = '';
                    } else if (q.type === 'choice') {
                        this.answers[idx] = null;
                    } else if (q.type === 'multi') {
                        this.answers[idx] = [];
                    }
                });
                this.loadAttempt();
            },
            error: () => {
                this.message.error('Ошибка загрузки теста');
                this.loading = false;
            }
        });
    }

    loadAttempt(): void {
        const userId = this.auth.getUser()?.id;
        const roles = this.auth.getRolesString();

        this.testAttemptService.getTestAttempts({
            testId: this.testId,
            userId,
            currentUserId: userId,
            roles,
            size: 10000
        }).subscribe({
            next: (res) => {
                const attempts = res.content || [];
                const inProgress = attempts.find((a: any) => a.status === 'IN_PROGRESS');
                if (inProgress) {
                    this.attemptId = inProgress.id;
                    this.message.info('Продолжаем предыдущую попытку');
                    this.loading = false;
                } else {
                    const attemptNumber = attempts.length > 0 ? Math.max(...attempts.map((a: any) => a.attemptNumber)) + 1 : 1;
                    const attemptData = {
                        testId: this.testId,
                        userId,
                        attemptNumber,
                        startTime: new Date().toISOString(),
                        endTime: null,
                        score: null,
                        status: 'IN_PROGRESS'
                    };
                    this.testAttemptService.createTestAttempt(attemptData).subscribe({
                        next: (created) => {
                            this.attemptId = created.id;
                            this.message.success('Начат новый тест');
                            this.loading = false;
                        },
                        error: (err) => {
                            if (err.status === 409 || err.error?.message?.includes('duplicate')) {
                                this.retryFetchAttempt();
                            } else {
                                this.message.error('Не удалось создать попытку');
                                this.loading = false;
                            }
                        }
                    });
                }
            },
            error: () => {
                this.message.error('Ошибка загрузки попыток');
                this.loading = false;
            }
        });
    }

    retryFetchAttempt(): void {
        const userId = this.auth.getUser()?.id;
        const roles = this.auth.getRolesString();
        this.testAttemptService.getTestAttempts({
            testId: this.testId,
            userId,
            currentUserId: userId,
            roles,
            size: 10000
        }).subscribe({
            next: (retryRes) => {
                const all = retryRes.content || [];
                const existing = all.find((a: any) => a.status === 'IN_PROGRESS');
                if (existing) {
                    this.attemptId = existing.id;
                    this.message.info('Продолжаем предыдущую попытку');
                    this.loading = false;
                } else {
                    this.message.error('Не удалось создать попытку: конфликт');
                    this.loading = false;
                }
            },
            error: () => {
                this.message.error('Ошибка загрузки попытки');
                this.loading = false;
            }
        });
    }

    get currentQuestion(): GiftQuestion | null {
        return this.questions[this.currentIndex] || null;
    }

    get progressPercent(): number {
        if (this.questions.length === 0) return 0;
        return Math.round((this.currentIndex + 1) / this.questions.length * 100);
    }

    onAnswerChange(value: any): void {
        this.answers[this.currentIndex] = value;
    }

    onMultiChange(value: any, checked: boolean): void {
        const current = this.answers[this.currentIndex] || [];
        if (checked) {
            current.push(value);
        } else {
            const index = current.indexOf(value);
            if (index !== -1) current.splice(index, 1);
        }
        this.answers[this.currentIndex] = current;
    }

    isChecked(optionText: string): boolean {
        return (this.answers[this.currentIndex] || []).includes(optionText);
    }

    onShortChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.answers[this.currentIndex] = input.value;
    }

    prevQuestion(): void {
        if (this.currentIndex > 0) this.currentIndex--;
    }

    nextQuestion(): void {
        if (this.currentIndex < this.questions.length - 1) this.currentIndex++;
    }

    submitTest(): void {
        let correctCount = 0;
        const totalQuestions = this.questions.length;
        this.questions.forEach((q, idx) => {
            const userAnswer = this.answers[idx];
            if (q.type === 'choice') {
                const correctOption = q.options?.find(opt => opt.correct);
                if (correctOption && userAnswer === correctOption.text) correctCount++;
            } else if (q.type === 'multi') {
                const correctOptions = q.options?.filter(opt => opt.correct).map(opt => opt.text) || [];
                const userOptions = userAnswer || [];
                const sortedCorrect = [...correctOptions].sort();
                const sortedUser = [...userOptions].sort();
                if (JSON.stringify(sortedCorrect) === JSON.stringify(sortedUser)) correctCount++;
            } else if (q.type === 'short' || q.type === 'numeric') {
                if (q.correct && userAnswer && userAnswer.trim().toLowerCase() === q.correct.toLowerCase()) correctCount++;
            } else if (q.type === 'essay') {
                if (userAnswer && userAnswer.trim() !== '') correctCount++;
            }
        });
        const score = Math.round((correctCount / totalQuestions) * 100);

        this.submitting = true;
        this.testAttemptService.updateTestAttempt(this.attemptId!, {
            endTime: new Date().toISOString(),
            score: score,
            status: 'COMPLETED'
        }).subscribe({
            next: () => {
                this.message.success(`Тест завершён! Вы набрали ${score}%`);
                this.router.navigate(['/tests', this.testId]);
            },
            error: () => {
                this.message.error('Ошибка сохранения результатов');
                this.submitting = false;
            }
        });
    }

    toggleOption(optionText: string): void {
        const current = this.answers[this.currentIndex] || [];
        const index = current.indexOf(optionText);
        if (index === -1) {
            current.push(optionText);
        } else {
            current.splice(index, 1);
        }
        this.answers[this.currentIndex] = [...current];
    }
}