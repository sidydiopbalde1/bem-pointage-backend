import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    findAll(department?: string, includeInactive?: string): import("@prisma/client").Prisma.PrismaPromise<{
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
