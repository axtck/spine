import { IDatabase, ILogger } from "./types";

export class Controller {
    public logger: ILogger;
    public database: IDatabase;
    constructor(logger: ILogger, database: IDatabase) {
        this.logger = logger;
        this.database = database;
    }


}

export default Controller;