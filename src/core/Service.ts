import { Logger } from "./Logger";
import { Database } from "./Database";

export abstract class Service {
    protected readonly logger: Logger;
    protected readonly database: Database;

    constructor(logger: Logger, database: Database) {
        this.logger = logger;
        this.database = database;
    }
}