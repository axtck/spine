import { Logger } from "./Logger";
import { Router } from "express";
import { ApiMethods, Middleware } from "../types";
import { ILogger } from "./types";

interface IRoute {
    path: string;
    method: ApiMethods;
    handler: Middleware;
    localMiddleware: Middleware[];
}
export abstract class Controller {
    public router: Router = Router();
    public abstract path: string;
    protected abstract readonly routes: IRoute[];
    private readonly logger: ILogger = new Logger();

    public setRoutes(): Router {
        for (const route of this.routes) {
            for (const mw of route.localMiddleware) {
                this.router.use(route.path, mw);
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
                    this.logger.error("Not a valid method");
                    break;
            }
        }
        return this.router;
    }
}