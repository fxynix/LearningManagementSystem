import { Role } from "./role.model";

export interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    roles: Role[];
    createdAt: string;
}