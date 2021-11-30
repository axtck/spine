type RoleNames = "user" | "admin" | "moderator";

export interface IRoleModel {
    id?: number;
    name: RoleNames;
}

export class UserModel implements IRoleModel {

    public name: RoleNames;

    constructor(role: IRoleModel) {
        this.name = role.name;
    }
}