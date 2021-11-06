import { InitialDatabaseConstants } from "../InitialDatabaseConstants";
import { Database } from "../../core/Database";
import { Logger } from "../../core/Logger";

const createRoles = async (): Promise<void> => {
    const logger = new Logger();
    const db = new Database(logger);

    const createRolesTableQuery = `
        CREATE TABLE IF NOT EXISTS roles (
            id INT NOT NULL AUTO_INCREMENT,
	        name VARCHAR(30) NOT NULL,
	        PRIMARY KEY (id)
        );
    `;

    const roleValues = InitialDatabaseConstants.userRoles.map((r, i, a) => {
        return `(${r.id}, '${r.name}')${i === a.length - 1 ? "" : ","}`;
    }).join("");

    const insertRolesQuery = `
        INSERT IGNORE INTO roles (
            id, 
            name
        )
        VALUES ${roleValues};
    `;

    try {
        await db.query(createRolesTableQuery);
        await db.query(insertRolesQuery, roleValues);
        db.logger.info("Inserting roles succeeded.");
    } catch (e) {
        console.log(e);
        logger.error(`${e}`);
        throw new Error("Inserting roles failed.");
    }
};

export default createRoles;
