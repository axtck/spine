type RoleNames = "user" | "admin" | "moderator";

export interface IRoleModel {
    id?: number;
    name: RoleNames;
}

export class UserModel implements IRoleModel {
    private _name: RoleNames;

    constructor(name: RoleNames) {
        this._name = name;
    }

    public get name(): RoleNames {
        return this._name;
    }
}