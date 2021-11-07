import { transformJSON } from './lib/functions/logging';
// app
import express, { Application } from "express";
const app: Application = express();

// dependencies
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

// logging
import { Logger } from "./core/Logger";
const logger = new Logger();

// .env
import penv from "./config/penv";
logger.info(`Environment variables:\n${transformJSON(penv)}`);

// api
import api from "./api";
import setupInitialDatabase from "./lib/database/setupInitialDatabase";

// basic middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json()); // parse requests
app.use(express.urlencoded({ extended: true }));

app.get("/setupInitialDatabase", async (req, res) => {
    try {
        await setupInitialDatabase();
    } catch {
        logger.error("Initial database setup failed (server.ts).");
    }

    res.json({
        message: "Setting up initial database"
    });
});

app.use("/api/v1", api);

app.listen(penv.port, () => {
    logger.info(`Listening on ${penv.port}.`);
});