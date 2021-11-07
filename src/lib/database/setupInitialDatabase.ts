import { Logger } from "../../core/Logger";
import { Database } from "../../core/Database";
import createRoles from "./createRoles";
import createBaseUsers from "./createBaseUsers";

const setupInitialDatabase = async (): Promise<void> => {
    const logger = new Logger();
    const db = new Database(logger);

    try {
        await createRoles();
        await createBaseUsers();
        db.logger.info("Initial database setup succeeded.");
    } catch (e) {
        logger.error("Initial database setup failed");
        throw e;
    }
};

export default setupInitialDatabase;