import { apiErrorHandler } from "./middlewares/apiErrorHandler";
// app
import express, { Application, RequestHandler } from "express";
const app: Application = express();
import routes from "./routes";

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
import setupInitialDatabase from "./lib/database/setupInitialDatabase";
import { Controller } from "./core/Controller";
import { AuthControllerClass } from "./controllers/AuthControllerClass";
import Server from "./core/Server";
logger.info(`Environment variables:\n${transformJSON(penv)}`);

const server: Server = new Server(app, 3002);
// // basic middleware
// app.use(morgan("dev"));
// app.use(helmet());
// app.use(cors({
//     origin: "http://localhost:3000" // access for origin 3000 (front-end) 
// }));
// app.use(express.json()); // parse requests
// app.use(express.urlencoded({ extended: true }));

app.get("/setupInitialDatabase", async (req, res, next) => {
    await setupInitialDatabase();
    res.json("qsdf")
});

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

setupInitialDatabase().then(() => {
    server.loadGlobalMiddlewares(globalMiddleWares);
    server.loadControllers("api/v1/", controllers);
    server.listen();
});

app.use("/api/v1", routes);

app.use(apiErrorHandler);

app.listen(penv.port, () => {
    logger.info(`Listening on ${penv.port}.`);
});