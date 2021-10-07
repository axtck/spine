import { ILogger } from './types';

interface IController {
    logger: ILogger;
}

class Controller implements IController {
    private readonly _logger: ILogger;
    constructor(logger: ILogger) {
        this._logger = logger;
    }

    public get logger(): ILogger {
        return this._logger;
    }
}

export default Controller;