import { IRole, IUser, UserRole } from "../types";

export class InitialDatabaseConstants {
    static readonly userRoles: IRole[] = [
        {
            id: 1,
            name: UserRole.User
        },
        {
            id: 2,
            name: UserRole.Admin
        },
        {
            id: 3,
            name: UserRole.Moderator
        }
    ];

    static readonly baseUsers: IUser[] = [
        {
            id: 1,
            username: UserRole.User,
            email: "user@user.com",
            password: "user"
        },
        {
            id: 2,
            username: UserRole.Admin,
            email: "admin@admin.com",
            password: "admin"
        },
        {
            id: 3,
            username: UserRole.Moderator,
            email: "moderator@moderator.com",
            password: "moderator"
        }
    ];
}