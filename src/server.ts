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
Object.entries(penv).map(([k, v]) => logger.info(`${k}: \t\t\t${v}`));

// database
import { Database } from "./core/Database";
const database = new Database(logger);
database.connection.connect((err) => {
    if (err) {
        logger.error(err.message);
        throw new Error("MySQL connect");
    }
    logger.info("Connected");
});

// api
import api from "./api";

// basic middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "TS setup!"
    });
});

app.use("/api/v1", api);

const port = penv.port || 3001;
app.listen(port, () => {
    logger.info(`Listening on ${port}.`);
});