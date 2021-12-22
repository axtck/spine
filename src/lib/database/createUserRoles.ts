import { Database } from "../../core/Database";
import { Logger } from "../../core/Logger";
import { InitialDatabaseConstants } from "../InitialDatabaseConstants";
const logger = new Logger();
const db = new Database();

const createUserRoles = async (): Promise<void> => {
    const createUserRolesTableQuery = `
        CREATE TABLE IF NOT EXISTS user_roles (
            id INT NOT NULL AUTO_INCREMENT,
            user_id INT NOT NULL,
            role_id INT NOT NULL,
	        PRIMARY KEY (id),
	        FOREIGN KEY (user_id) REFERENCES users(id),
	        FOREIGN KEY (role_id) REFERENCES roles(id)
        )
    `;

    const userRolesValues = InitialDatabaseConstants.baseUsers.map((u, i, a) => {
        return `(${i + 1}, '${u.id}', '${InitialDatabaseConstants.userRoles[i].id}')${i === a.length - 1 ? "" : ","}`;
    }).join("");

    const insertUserRolesQuery = `
        INSERT IGNORE INTO user_roles (
            id,
            user_id,
            role_id
        )
        VALUES ${userRolesValues}
    `;

    try {
        await db.query(createUserRolesTableQuery);
        await db.query(insertUserRolesQuery);
        logger.info("Creating user roles succeeded.");
    } catch (e) {
        logger.error("Creating user roles failed.");
        throw e;
    }
};

export default createUserRoles;
