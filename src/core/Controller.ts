import { Logger } from "./Logger";
import { Response, Router } from "express";
import { ApiMethods } from "../types";
import { IControllerRoute } from "./types";
import { Database } from "./Database";

export abstract class Controller {
    public router: Router = Router();
    public abstract path: string;
    protected abstract readonly routes: IControllerRoute[];
    protected readonly logger: Logger;
    protected readonly database: Database;

    constructor() {
        this.logger = new Logger();
        this.database = new Database();
    }

    public setRoutes(): Router {
        for (const route of this.routes) {
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

    protected sendSuccess(res: Response, data?: unknown, message?: string): Response {
        return res.status(200).json({
            message: message || "success",
            payload: data
        });
    }
}