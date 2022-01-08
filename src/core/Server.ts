import { Database } from "./Database";
import { Application, RequestHandler } from "express";
import { Controller } from "./Controller";
import { Logger } from "./Logger";
import http from "http";
import { penv } from "../config/penv";

export default class Server {
    private readonly app: Application;
    private readonly database: Database;
    private readonly logger: Logger;

    constructor(app: Application) {
        this.database = new Database();
        this.logger = new Logger();
        this.app = app;
    }

    public listen(): http.Server {
        return this.app.listen(penv.app.port, () => {
            this.logger.debug(`listening on ${penv.app.port}`);
        });
    }

    public loadGlobalMiddlewares(middlewares: RequestHandler[]): void {
        for (const middleware of middlewares) {
            this.app.use(middleware);
        }
    }

    public loadControllers(basePath: string, controllers: Controller[]): void {
        for (const controller of controllers) {
            const controllerPath = `${basePath}/${controller.path}`.replace(/\/+/g, "/"); // create the full base path e.g. api/v1/auth
            this.app.use(controllerPath, controller.setRoutes());
        }
    }

    public listEnv(): void {
        this.logger.debug(`environment variables: ${JSON.stringify(penv)}`);
    }

    public async initDb(): Promise<void> {
        await this.database.query("");
        await this.database.createDatabase();
    }
}