import express, { Application, RequestHandler } from "express";
import Server from "./core/Server";
import { Controller } from "./core/Controller";
import { AuthControllerClass } from "./controllers/AuthControllerClass";
import { UserControllerClass } from "./controllers/UserControllerClass";
import { Logger } from "./core/Logger";
import { apiErrorHandler } from "./middlewares/apiErrorHandler";

const app: Application = express();
const server: Server = new Server(app);

// dependencies
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

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
    new AuthControllerClass(),
    new UserControllerClass()
];

// setupInitialDatabase().then(() => {
server.listEnv();
server.loadGlobalMiddlewares(globalMiddleWares);
server.loadControllers("/api/v1/", controllers);
server.listen();
app.use(apiErrorHandler);
// });