import { IPerson } from "./core/types";
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
const db = new Database(logger);

// api
import api from "./api";

// basic middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    const sql = `
        select *
        from users where id = 1;
    `;

    const people = await db.queryOne<IPerson>(sql);

    res.json({
        result: people
    });
});

app.use("/api/v1", api);

app.listen(penv.port, () => {
    logger.info(`Listening on ${penv.port}.`);
});