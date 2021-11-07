import { Logger } from "../../core/Logger";
import { Database } from "../../core/Database";
import createRoles from "./createRoles";
import createBaseUsers from "./createBaseUsers";
import createUserRoles from "./createUserRoles";
const logger = new Logger();
const db = new Database(logger);

const setupInitialDatabase = async (): Promise<void> => {
    try {
        await createRoles();
        await createBaseUsers();
        await createUserRoles();
        db.logger.info("Initial database setup succeeded.");
    } catch (e) {
        logger.error("Initial database setup failed");
        throw e;
    }
};

export default setupInitialDatabase;