import { Category } from './category.model';
import { User } from './user.model';
import { Role } from './role.model';

export interface Course {
    id: number;
    title: string;
    description: string;
    category: Category | null;
    teacher: User | null;
    roles: Role[];
    createdAt: string;
}