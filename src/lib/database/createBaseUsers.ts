import { InitialDatabaseConstants } from "../InitialDatabaseConstants";
import { Database } from "../../core/Database";
import { Logger } from "../../core/Logger";
const logger = new Logger();
const db = new Database();

const createBaseUsers = async (): Promise<void> => {
    const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT NOT NULL AUTO_INCREMENT,
	        username VARCHAR(30) NOT NULL,
            email VARCHAR(50) NOT NULL,
            password VARCHAR(100) NOT NULL,
	        PRIMARY KEY (id)
        )
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
        VALUES ${baseUserValues}
    `;

    try {
        await db.query(createUsersTableQuery);
        await db.query(insertBaseUsersQuery);
        logger.info("Creating base users succeeded.");
    } catch (e) {
        logger.error("Creating base users failed.");
        throw e;
    }
};

export default createBaseUsers;
