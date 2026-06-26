import { Course } from './course.model';

export interface Test {
    id: number;
    title: string;
    description: string;
    content: string;
    questionsCount: number;
    startDate: string | null;
    endDate: string | null;
    maxDurationMinutes: number | null;
    maxAttempts: number | null;
    course: Course;
    createdAt: string;
}