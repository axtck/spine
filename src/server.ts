import { createPoolConnection } from "./lib/database/createConnections";
import express, { Application, RequestHandler } from "express";
import Server from "./core/Server";
import { Logger } from "./core/Logger";
import { Controller } from "./core/Controller";
import { AuthController } from "./controllers/AuthController";
import { UserController } from "./controllers/UserController";
import { apiErrorHandler } from "./middlewares/apiErrorHandler";
import { lazyHandleException } from "./lib/functions/exceptionHandling";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { Pool } from "mysql2/promise";

const app: Application = express();
const pool: Pool = createPoolConnection();
const server: Server = new Server(app, pool);
const logger: Logger = new Logger();

const globalMiddleWares: RequestHandler[] = [
    morgan("dev"),
    helmet(),
    cors({
        origin: "http://localhost:3000" // access for origin 3000 (front-end) 
    }),
    express.json(), // parse requests
    express.urlencoded({ extended: true })
];

const controllers: Controller[] = [
    new AuthController(pool),
    new UserController(pool)
];

server.initDatabase(path.join(__dirname, "migrations")).then(() => {
    server.listEnv();
    server.loadGlobalMiddlewares(globalMiddleWares);
    server.loadControllers("/api/v1", controllers);
    app.use(apiErrorHandler);
    server.listen();
}).catch((e: unknown) => {
    lazyHandleException(e, "initializing database failed", logger);
});
