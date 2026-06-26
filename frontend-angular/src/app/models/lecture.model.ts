import { Course } from './course.model';

export interface Lecture {
    id: number;
    title: string;
    content: string;
    orderNumber: number | null;
    course: Course;
    createdAt: string;
}