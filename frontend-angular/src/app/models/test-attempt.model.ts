import { Test } from './test.model';
import { User } from './user.model';

export interface TestAttempt {
    id: number;
    test: Test;
    user: User;
    attemptNumber: number;
    startTime: string;
    endTime: string | null;
    score: number | null;
    status: 'IN_PROGRESS' | 'COMPLETED';
}