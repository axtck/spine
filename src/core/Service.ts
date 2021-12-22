import { Logger } from "./Logger";
import { Database } from "./Database";
export abstract class Service {
    protected readonly logger: Logger;
    protected readonly database: Database;

    constructor() {
        this.logger = new Logger();
        this.database = new Database();
    }
}