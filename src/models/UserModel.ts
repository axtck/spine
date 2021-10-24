export interface IUserModel {
    id: number;
    username: string;
    email: string;
    password: string;
}

export class UserModel implements IUserModel {
    private _id: number;
    private _username: string;
    private _email: string;
    private _password: string;

    constructor(id: number, username: string, email: string, password: string) {
        this._id = id;
        this._username = username;
        this._email = email;
        this._password = password;
    }

    public get id(): number {
        return this._id;
    }

    public get username(): string {
        return this._username;
    }

    // do I need a setter?
    public set username(username: string) {
        if (username.length > 20) {
            throw new Error("Username too long.");
        }

        this._username = username;
    }

    public get email(): string {
        return this._email;
    }

    public get password(): string {
        return this._password;
    }
}