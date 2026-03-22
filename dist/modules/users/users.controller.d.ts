import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<{
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        department: string | null;
        position: string | null;
        phone: string | null;
        isActive: boolean;
        workStartTime: string;
        workEndTime: string;
        createdAt: Date;
    }>;
    findAll(department?: string): import("@prisma/client").Prisma.PrismaPromise<{
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        department: string | null;
        position: string | null;
        phone: string | null;
        isActive: boolean;
        workStartTime: string;
        workEndTime: string;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        qrCode: {
            token: string;
        } | null;
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        department: string | null;
        position: string | null;
        phone: string | null;
        isActive: boolean;
        workStartTime: string;
        workEndTime: string;
        createdAt: Date;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        department: string | null;
        position: string | null;
        phone: string | null;
        isActive: boolean;
        workStartTime: string;
        workEndTime: string;
        createdAt: Date;
    }>;
    deactivate(id: string): Promise<{
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        department: string | null;
        position: string | null;
        phone: string | null;
        isActive: boolean;
        workStartTime: string;
        workEndTime: string;
        createdAt: Date;
    }>;
}
