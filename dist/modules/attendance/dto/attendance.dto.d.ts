import type { AttendanceType } from '@prisma/client';
export declare class CheckInDto {
    type: AttendanceType;
    latitude: number;
    longitude: number;
    note?: string;
}
export declare class ManualAttendanceDto {
    userId: string;
    date: string;
    checkIn: string;
    checkOut?: string;
    note?: string;
}
export declare class AttendanceFilterDto {
    startDate?: string;
    endDate?: string;
    userId?: string;
    department?: string;
}
