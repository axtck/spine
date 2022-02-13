import { Database } from "./../../core/Database";
import { IUser, QueryString } from "../../types";
import { Id, Nullable } from "../../types";
import { Repository } from "../../core/Repository";
import { injectable } from "tsyringe";
import { Logger } from "../../core/Logger";

@injectable()
export class AuthRepository extends Repository {
    constructor(logger: Logger, database: Database) {
        super(logger, database);
    }
    public async createUser(username: string, email: string, password: string): Promise<void> {
        const createUserQuery: QueryString = `
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
        const createUserRoleQuery: QueryString = `
            INSERT INTO user_roles (
                userId,
                roleId
            )
            VALUES (?, ?)
        `;
        await this.database.query(createUserRoleQuery, [userId, roleId]);
    }

    public async getCreatedUserId(username: string): Promise<Nullable<{ id: Id; }>> {
        const getUserIdQuery: QueryString = "SELECT id FROM users WHERE username = ?";
        const foundUser: Nullable<{ id: Id; }> = await this.database.queryOne<{ id: Id; }>(getUserIdQuery, [username]);
        return foundUser;
    }

    public async getRole(role: string): Promise<Nullable<{ id: Id; }>> {
        const getRoleIdQuery: QueryString = "SELECT id FROM roles WHERE name = ?";
        const foundRole: Nullable<{ id: Id; }> = await this.database.queryOne<{ id: Id; }>(getRoleIdQuery, [role]);
        return foundRole;
    }

    public async getUser(username: string): Promise<Nullable<IUser>> {
        const getUserQuery: QueryString = "SELECT * FROM users WHERE username = ?";
        const user: Nullable<IUser> = await this.database.queryOne<IUser>(getUserQuery, [username]);
        return user;
    }

    public async getUserRoleNames(userId: Id): Promise<Nullable<Array<{ name: string; }>>> {
        const getUserRolesQuery: QueryString = `
            SELECT r.name 
            FROM user_roles ur
            INNER JOIN roles r ON r.id = ur.roleId
            WHERE ur.userId = ? 
        `;
        const userRoles: Nullable<Array<{ name: string; }>> = await this.database.query<{ name: string; }>(getUserRolesQuery, [userId]);
        return userRoles;
    }

    public async getDuplicateUsernameId(username: string): Promise<Nullable<{ id: Id; }>> {
        const getDuplicateQuery: QueryString = "SELECT id FROM users WHERE username = ?";
        const duplicateUserId = await this.database.queryOne<{ id: Id; }>(getDuplicateQuery, [username]);
        return duplicateUserId;
    }

    public async getDuplicateEmailId(email: string): Promise<Nullable<{ id: Id; }>> {
        const getDuplicateQuery: QueryString = "SELECT id FROM users WHERE email = ?";
        const duplicateUserId = await this.database.queryOne<{ id: Id; }>(getDuplicateQuery, [email]);
        return duplicateUserId;
    }
}