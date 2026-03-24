import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare class UsersService {
    private readonly prisma;
    private readonly mailService;
    constructor(prisma: PrismaService, mailService: MailService);
    create(dto: CreateUserDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        department: string | null;
        position: string | null;
        phone: string | null;
        isActive: boolean;
        workStartTime: string;
        workEndTime: string;
        workDays: string;
        createdAt: Date;
    }>;
    findAll(department?: string, includeInactive?: boolean): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        department: string | null;
        position: string | null;
        phone: string | null;
        isActive: boolean;
        workStartTime: string;
        workEndTime: string;
        workDays: string;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        department: string | null;
        position: string | null;
        phone: string | null;
        isActive: boolean;
        workStartTime: string;
        workEndTime: string;
        workDays: string;
        createdAt: Date;
        qrCode: {
            token: string;
        } | null;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        department: string | null;
        position: string | null;
        phone: string | null;
        isActive: boolean;
        workStartTime: string;
        workEndTime: string;
        workDays: string;
        createdAt: Date;
    }>;
    deactivate(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        department: string | null;
        position: string | null;
        phone: string | null;
        isActive: boolean;
        workStartTime: string;
        workEndTime: string;
        workDays: string;
        createdAt: Date;
    }>;
}
