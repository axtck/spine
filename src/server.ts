// app
import express, { Application } from "express";
const app: Application = express();

// .env
import * as dotenv from "dotenv";
dotenv.config();
import penv from "./config/penv";
Object.entries(penv).map(([k, v]) => console.log(`${k}: \t\t\t${v}`));

// api
import api from "./api";

import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

// basic middleware
app.use(morgan("short"));
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
    console.log(`Listening on ${port}.`);
});