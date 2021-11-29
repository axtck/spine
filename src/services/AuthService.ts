import { Service } from "../core/Service";

export class AuthService extends Service {

    public async insertUser(username: string, email: string, password: string): Promise<void> {
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
}