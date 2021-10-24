import { InitialDatabaseConstants } from "../InitialDatabaseConstants";
import { Database } from "../../core/Database";
import { Logger } from "../../core/Logger";

async function createBaseUsers(): Promise<void> {
    const logger = new Logger();
    const db = new Database(logger);

    const createUsersTableQuery = `
        CREATE TABLE [IF NOT EXISTS] users (
            id INT NOT NULL AUTO_INCREMENT,
	        username VARCHAR(30) NOT NULL,
            email VARCHAR(50) NOT NULL,
            password VARCHAR(100) NOT NULL,
	        PRIMARY KEY (id)
        );
    `;

    const insertBaseUsersQuery = `
        INSERT INTO roles (
            id, 
            username,
            email,
            password 
        )
        VALUES ?; 
    `;

    const baseUserValues = InitialDatabaseConstants.baseUsers.map((u) => {
        return `(${u.id}, ${u.username}, ${u.email}, ${u.password})`;
    });

    try {
        await db.query(createUsersTableQuery);
        await db.query(insertBaseUsersQuery, baseUserValues);
        db.logger.info("Inserting base users succeeded.");
    } catch {
        throw new Error("Inserting base users failed.");
    }
}

export default createBaseUsers;
