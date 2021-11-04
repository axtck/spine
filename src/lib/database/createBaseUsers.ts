import { InitialDatabaseConstants } from "../InitialDatabaseConstants";
import { Database } from "../../core/Database";
import { Logger } from "../../core/Logger";

async function createBaseUsers(): Promise<void> {
    const logger = new Logger();
    const db = new Database(logger);

    const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT NOT NULL AUTO_INCREMENT,
	        username VARCHAR(30) NOT NULL,
            email VARCHAR(50) NOT NULL,
            password VARCHAR(100) NOT NULL,
	        PRIMARY KEY (id)
        );
    `;

    const baseUserValues = InitialDatabaseConstants.baseUsers.map((u, i, a) => {
        return `(${u.id}, '${u.username}', '${u.email}', '${u.password}')${i === a.length - 1 ? "" : ","}`;
    }).join("");

    const insertBaseUsersQuery = `
        INSERT IGNORE INTO users (
            id,
            username,
            email,
            password 
        )
        VALUES ${baseUserValues}; 
    `;

    try {
        await db.query(createUsersTableQuery);
        await db.query(insertBaseUsersQuery, baseUserValues);
        db.logger.info("Inserting base users succeeded.");
    } catch (e) {
        console.log(e);
        logger.error(`${e}`);
        throw new Error("Inserting base users failed.");
    }
}

export default createBaseUsers;
