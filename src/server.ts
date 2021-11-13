import { apiErrorHandler } from "./middlewares/apiErrorHandler";
// app
import express, { Application } from "express";
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
logger.info(`Environment variables:\n${transformJSON(penv)}`);

// basic middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(cors({
    origin: "http://localhost:3000" // access for origin 3000 (front-end) 
}));
app.use(express.json()); // parse requests
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);
app.use(apiErrorHandler);

app.listen(penv.port, () => {
    logger.info(`Listening on ${penv.port}.`);
});