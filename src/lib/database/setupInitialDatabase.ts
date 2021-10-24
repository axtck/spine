import { Logger } from "../../core/Logger";
import { Database } from "../../core/Database";
import penv from "../../config/penv";
import createRoles from "./createRoles";
import createBaseUsers from "./createBaseUsers";

async function setupInitialDatabase(): Promise<void> {
    const logger = new Logger();
    const db = new Database(logger);

    const dbName = penv.environment === "production" ? "prod" : "dev";
    const createDbQuery = "CREATE DATABASE [IF NOT EXISTS] ?;";
    const useDbQuery = "USE ?";

    try {
        await db.query(createDbQuery, dbName);
        await db.query(useDbQuery, dbName);
        // await createRoles();
        // await createBaseUsers();
        db.logger.info("Initial database setup succeeded.");
    } catch {
        throw new Error("Initial database setup failed.");
    }

}

export default setupInitialDatabase;