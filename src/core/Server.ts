import { Application, RequestHandler } from "express";
import http from "http"
import {Controller} from "./Controller";
import { Logger } from "./Logger";
import { ILogger } from "./types";

export default class Server {
    private app: Application;
    private readonly port: number;
    private readonly logger: ILogger;

    constructor(app: Application, port: number) {
        this.logger = new Logger();
        this.app = app;
        this.port = port;
    }

    public listen(): http.Server {
        return this.app.listen(this.port, () => {
            this.logger.info(`Listening on ${this.port}.`);
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
            const multipleSlashesRegExp = new RegExp(/\/+/, "g")
            const crashProofPath = fullBasePath.replace(multipleSlashesRegExp, "/");
            this.logger.info(`Using path ${crashProofPath}`)
            this.app.use(crashProofPath, controller.setRoutes());
        }
    }
}