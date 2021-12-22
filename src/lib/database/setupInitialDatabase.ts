import { Logger } from "../../core/Logger";
import createRoles from "./createRoles";
import createBaseUsers from "./createBaseUsers";
import createUserRoles from "./createUserRoles";
const logger = new Logger();

const setupInitialDatabase = async (): Promise<void> => {
    try {
        await createRoles();
        await createBaseUsers();
        await createUserRoles();
        logger.info("Initial database setup succeeded.");
    } catch (e) {
        logger.error("Initial database setup failed");
        throw e;
    }
};

export default setupInitialDatabase;