import { Id } from "./../types";
type RoleNames = "user" | "admin" | "moderator";

export interface IRoleModel {
    id: number;
    name: RoleNames;
}

export class UserModel implements IRoleModel {

    public id: Id;
    public name: RoleNames;

    constructor(role: IRoleModel) {
        this.id = role.id;
        this.name = role.name;
    }
}