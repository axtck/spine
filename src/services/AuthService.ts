import { IUserModel } from "./../models/UserModel";
import { Id, Nullable } from "./../types";
import { AuthRepository } from "./../repositories/AuthRepository";
import { Service } from "../core/Service";
import { InfoError } from "../lib/errors/InfoError";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService extends Service {
    private readonly authRepository = new AuthRepository();

    constructor() {
        super();
    }

    public async createUser(username: string, email: string, password: string): Promise<void> {
        const hashedPassword: string = bcrypt.hashSync(password, 8); // hash the password using bcrypt
        await this.authRepository.createUser(username, email, hashedPassword);
    }

    public async assignRoles(username: string, roles: Nullable<string[]>): Promise<void> {
        // get created user
        const createdUserId: Nullable<{ id: Id; }> = await this.authRepository.getCreatedUserId(username);
        if (!createdUserId) throw new InfoError(this.assignRoles.name, path.basename(__filename), "finding created user");

        // assign roles
        if (roles) {
            for (const r of roles) {
                const role = await this.authRepository.getRole(r);
                if (!role) throw new InfoError(this.assignRoles.name, path.basename(__filename), "finding role");
                await this.authRepository.createUserRole(createdUserId.id, role.id);
            }
        } else {
            await this.authRepository.createUserRole(createdUserId.id, 1); // assign 'user' role 
        }
    }

    public async getUserByUsername(username: string): Promise<Nullable<IUserModel>> {
        const user: Nullable<IUserModel> = await this.authRepository.getUser(username);
        return user;
    }

    public validatePassword(passwordToValidate: string, passwordToCompareTo: string): boolean {
        // compare the input passwords with the existing password using bcrypt
        const passwordIsValid: boolean = bcrypt.compareSync(
            passwordToValidate,
            passwordToCompareTo
        );
        return passwordIsValid;
    }

    public signToken(userId: Id, jwtAuthKey: string | undefined): unknown {
        if (!jwtAuthKey) throw new Error("No JWT Authkey provided.");
        // sign a token that expires in 1 day
        const oneDayInS = 60 * 60 * 24;
        const token = jwt.sign({ id: userId }, jwtAuthKey, {
            expiresIn: oneDayInS
        });
        return token;
    }

    public async getUserRoles(userId: Id): Promise<string[]> {
        const userRoles: Nullable<{ name: string; }[]> = await this.authRepository.getUserRoles(userId);
        if (!userRoles || !userRoles?.length) throw new Error(`No roles found for user with id "${userId}".`);
        const roleNames: string[] = userRoles.map(r => r.name);
        return roleNames;
    }
}