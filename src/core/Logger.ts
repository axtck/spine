import { LogMessageTypes } from "./types";
import winston from "winston";
import { penv } from "../config/penv";
import { Constants } from "../Constants";
import path from "path";

export class Logger {
    private levels = Constants.logLevels;
    private colors = Constants.logColors;

    constructor() {
        winston.addColors(this.colors);
    }

    private get level(): string {
        return penv.app.environment === "development" ? "debug" : "warn";
    }

    private format = winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.colorize({ level: true }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    );

    private transports = [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: path.join(".", "log", "error.log"),
            level: "error"
        }),
        new winston.transports.File({ filename: path.join(".", "log", "all.log") })
    ];

    private logger = winston.createLogger({
        level: this.level,
        levels: this.levels,
        format: this.format,
        transports: this.transports
    });

    error(message: LogMessageTypes): void {
        this.logger.error(message);
    }

    warn(message: LogMessageTypes): void {
        this.logger.warn(message);
    }

    info(message: LogMessageTypes): void {
        this.logger.info(message);
    }

    http(message: LogMessageTypes): void {
        this.logger.http(message);
    }

    debug(message: LogMessageTypes): void {
        this.logger.debug(message);
    }
}
