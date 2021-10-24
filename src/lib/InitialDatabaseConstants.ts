import { IRoleModel } from "../models/RoleModel";
import { IUserModel } from "../models/UserModel";

export class InitialDatabaseConstants {
    static readonly userRoles: IRoleModel[] = [
        {
            id: 1,
            name: "user"
        },
        {
            id: 2,
            name: "admin"
        },
        {
            id: 3,
            name: "moderator"
        }
    ];

    static readonly baseUsers: IUserModel[] = [
        {
            id: 1,
            username: "user",
            email: "user@user.com",
            password: "user"
        },
        {
            id: 2,
            username: "admin",
            email: "admin@admin.com",
            password: "admin"
        },
        {
            id: 3,
            username: "moderator",
            email: "moderator@moderator.com",
            password: "moderator"
        }
    ];
}