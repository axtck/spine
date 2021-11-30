// app
import express, { Application, RequestHandler } from "express";
const app: Application = express();
import Server from "./core/Server";
import { Controller } from "./core/Controller";
import { AuthControllerClass } from "./controllers/AuthControllerClass";
import { apiErrorHandler } from "./middlewares/apiErrorHandler";
// import setupInitialDatabase from "./lib/database/setupInitialDatabase";

// dependencies
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

// logging
import { Logger } from "./core/Logger";
const logger = new Logger();

// .env
import { transformJSON } from "./lib/functions/logging";
import penv from "./config/penv";
logger.info(`Environment variables:\n${transformJSON(penv)}`);

const server: Server = new Server(app, penv.port);

const globalMiddleWares: Array<RequestHandler> = [
    morgan("dev"),
    helmet(),
    cors({
        origin: "http://localhost:3000" // access for origin 3000 (front-end) 
    }),
    express.json(), // parse requests
    express.urlencoded({ extended: true })
];

const controllers: Controller[] = [
    new AuthControllerClass()
];

// setupInitialDatabase().then(() => {
server.loadGlobalMiddlewares(globalMiddleWares);
server.loadControllers("/api/v1/", controllers);
server.listen();
app.use(apiErrorHandler);
// });