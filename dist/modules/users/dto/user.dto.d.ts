import type { Role } from '@prisma/client';
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: Role;
    department?: string;
    position?: string;
    phone?: string;
    workStartTime?: string;
    workEndTime?: string;
    workDays?: string;
}
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    role?: Role;
    department?: string;
    position?: string;
    workStartTime?: string;
    workEndTime?: string;
    workDays?: string;
}
