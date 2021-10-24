import { Logger } from "../../core/Logger";
import { Database } from "../../core/Database";
import penv from "../../config/penv";
import createRoles from "./createRoles";
import createBaseUsers from "./createBaseUsers";

async function setupInitialDatabase(): Promise<void> {
    const logger = new Logger();
    const db = new Database(logger);

    const dbName = penv.environment === "production" ? "prod" : "dev";
    const createDbQuery = `CREATE DATABASE IF NOT EXISTS ${dbName};`;
    const useDbQuery = `USE ${dbName};`;

    try {
        await db.query(createDbQuery);
        await db.query(useDbQuery);
        await createRoles();
        await createBaseUsers();
        db.logger.info("Initial database setup succeeded.");
    } catch(e) {
        console.log(e);
        logger.error(`${e}`);
        throw new Error("Initial database setup failed.");
    }

}

export default setupInitialDatabase;