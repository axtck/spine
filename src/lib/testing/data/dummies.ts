import { IUserModel } from "../../../models/UserModel";
import { IRoleModel } from "../../../models/RoleModel";

export const userRoles: IRoleModel[] = [
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

export const dummyUserRole: IRoleModel = userRoles[0];
export const dummyAdminRole: IRoleModel = userRoles[1];
export const dummyModeratorRole: IRoleModel = userRoles[2];

export const baseUsers: IUserModel[] = [
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

export const dummyUser: IUserModel = baseUsers[0];
export const dummyAdmin: IUserModel = baseUsers[1];
export const dummyModerator: IUserModel = baseUsers[2];