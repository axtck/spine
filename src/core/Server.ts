import { Application, RequestHandler } from "express";
import { Controller } from "./Controller";
import { Logger } from "./Logger";
import http from "http";
import { penv } from "../config/penv";

export default class Server {
    private readonly app: Application;
    private readonly logger: Logger;

    constructor(app: Application) {
        this.logger = new Logger();
        this.app = app;
    }

    public listen(): http.Server {
        return this.app.listen(penv.app.port, () => {
            this.logger.info(`Listening on ${penv.app.port}.`);
        });
    }

    public loadGlobalMiddlewares(middlewares: Array<RequestHandler>): void {
        for (const middleware of middlewares) {
            this.app.use(middleware);
        }
    }

    public loadControllers(basePath: string, controllers: Array<Controller>): void {
        for (const controller of controllers) {
            const fullBasePath = `${basePath}/${controller.path}`; // create the full base path e.g. api/v1/auth
            const multipleSlashesRegExp = new RegExp(/\/+/, "g");
            const crashProofPath = fullBasePath.replace(multipleSlashesRegExp, "/");
            this.app.use(crashProofPath, controller.setRoutes());
        }
    }

    public listEnv(): void {
        this.logger.info(`Environment variables: ${JSON.stringify(penv)}`);
    }
}