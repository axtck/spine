import { InitialDatabaseConstants } from "../InitialDatabaseConstants";
import { Database } from "../../core/Database";
import { Logger } from "../../core/Logger";

async function createRoles(): Promise<void> {
    const logger = new Logger();
    const db = new Database(logger);

    const createRolesTableQuery = `
        CREATE TABLE [IF NOT EXISTS] roles (
            id INT NOT NULL AUTO_INCREMENT,
	        name VARCHAR(30) NOT NULL,
	        PRIMARY KEY (id)
        );
    `;

    const insertRolesQuery = `
        INSERT INTO roles (
            id, 
            name
        )
        VALUES ?; 
    `;

    const roleValues = InitialDatabaseConstants.userRoles.map((r) => {
        return `(${r.id}, ${r.name})`;
    });

    try {
        await db.query(createRolesTableQuery);
        await db.query(insertRolesQuery, roleValues);
        db.logger.info("Inserting roles succeeded.");
    } catch {
        throw new Error("Inserting roles failed.");
    }
}

export default createRoles;
