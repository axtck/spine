import { ILogger, LogMessageTypes } from "./types";
import winston from "winston";
import penv from "../config/penv";
import { Constants } from "../Constants";

export class Logger implements ILogger {
    private levels = Constants.logLevels;
    private colors = Constants.logColors;

    constructor() {
        winston.addColors(this.colors);
    }

    private get level(): string {
        return (penv.environment === "development") ? "debug" : "warn";
    }

    private format = winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
        winston.format.colorize({ all: true }),
        winston.format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
    );

    private transports = [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "./log/error.log",
            level: "error"
        }),
        new winston.transports.File({ filename: "./log/all.log" })
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
