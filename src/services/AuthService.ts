import { Id, Nullable } from "./../types";
import { Service } from "../core/Service";

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

    public async getCreatedUser(username: string): Promise<Nullable<{ id: number; }>> {
        const getIdQuery = "SELECT id FROM users WHERE username = ?";
        const foundUser = await this.database.queryOne<{ id: number; }>(getIdQuery, [username]);
        return foundUser;
    }

    public async getRole(role: string): Promise<Nullable<{ id: number; }>> {
        const getIdQuery = "SELECT id FROM roles WHERE name = ?";
        const foundRole = await this.database.queryOne<{ id: number; }>(getIdQuery, [role]);
        return foundRole;
    }
}