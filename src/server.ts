import express from "express";
import envv from "./config/envConfig";
import api from "./api";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

const app = express();

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

const port = envv.port || 3001;
app.listen(port, () => {
    console.log(`Listening on ${port}.`);
});