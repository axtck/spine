import { Logger } from "./Logger";
import { Database } from "./Database";
import { Pool } from "mysql2/promise";

export abstract class Middleware {
    constructor(pool: Pool,
        protected readonly logger: Logger = new Logger(),
        protected readonly database: Database = new Database(pool)) { }
}