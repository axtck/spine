import { Id, Nullable } from "./../types";
import { Service } from "../core/Service";
import { IUserModel } from "../models/UserModel";

export class AuthService extends Service {

    public async createUser(username: string, email: string, password: string): Promise<void> {
        const createUserQuery = `
            INSERT INTO users (
                username,
                email,
                password 
            )
            VALUES (?, ?, ?)  
        `;
        await this.database.query(createUserQuery, [username, email, password]);
    }

    public async createUserRole(userId: Id, roleId: Id): Promise<void> {
        const createUserRoleQuery = `
            INSERT INTO user_roles (
                user_id,
                role_id
            )
            VALUES (?, ?)
        `;
        await this.database.query(createUserRoleQuery, [userId, roleId]);
    }

    public async getCreatedUserId(username: string): Promise<Nullable<{ id: number; }>> {
        const getUserIdQuery = "SELECT id FROM users WHERE username = ?";
        const foundUser = await this.database.queryOne<{ id: number; }>(getUserIdQuery, [username]);
        return foundUser;
    }

    public async getRole(role: string): Promise<Nullable<{ id: number; }>> {
        const getRoleIdQuery = "SELECT id FROM roles WHERE name = ?";
        const foundRole = await this.database.queryOne<{ id: number; }>(getRoleIdQuery, [role]);
        return foundRole;
    }

    public async getUser(username: string): Promise<Nullable<IUserModel>> {
        const getUserQuery = "SELECT * FROM users WHERE username = ?";
        const user = await this.database.queryOne<IUserModel>(getUserQuery, [username]);
        return user;
    }
}