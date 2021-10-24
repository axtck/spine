type RoleNames = "user" | "admin" | "moderator";

export interface IRoleModel {
    id: number;
    name: RoleNames;
}

export class UserModel implements IRoleModel {
    private _id: number;
    private _name: RoleNames;

    constructor(id: number, name: RoleNames) {
        this._id = id;
        this._name = name;
    }

    public get id(): number {
        return this._id;
    }

    public get name(): RoleNames {
        return this._name;
    }
}