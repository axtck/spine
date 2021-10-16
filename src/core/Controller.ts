import { ILogger } from "./types";

export class Controller {
    public logger: ILogger;
    constructor(logger: ILogger) {
        this.logger = logger;
    }
}

export default Controller;