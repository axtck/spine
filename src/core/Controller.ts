import { Logger } from "./Logger";
import { Router } from "express";
import { ApiMethods } from "../types";
import { IControllerRoute } from "./types";
import { Database } from "./Database";
import { Service } from "./Service";

export abstract class Controller {
    public router: Router = Router();
    public abstract path: string;
    protected abstract service: Service;
    protected abstract readonly routes: IControllerRoute[];
    protected readonly logger: Logger;
    protected readonly database: Database;

    constructor() {
        this.logger = new Logger();
        this.database = new Database(this.logger);
    }

    public setRoutes(): Router {
        for (const route of this.routes) {
            this.logger.info(route.path);
            for (const middleware of route.localMiddleware) {
                this.router.use(route.path, middleware);
            }
            switch (route.method) {
                case ApiMethods.Get:
                    this.router.get(route.path, route.handler);
                    break;
                case ApiMethods.Post:
                    this.router.post(route.path, route.handler);
                    break;
                case ApiMethods.Put:
                    this.router.put(route.path, route.handler);
                    break;
                case ApiMethods.Delete:
                    this.router.delete(route.path, route.handler);
                    break;
                default:
                    this.logger.error("Not a valid method.");
                    break;
            }
        }
        return this.router;
    }
}