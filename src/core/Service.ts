import { Pool } from "mysql2/promise";
import { Logger } from "./Logger";
import { Database } from "./Database";

export abstract class Service {
    constructor(pool: Pool,
        protected readonly logger: Logger = new Logger(),
        protected readonly database: Database = new Database(pool)) {
    }
}