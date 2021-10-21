import { OkPacket, RowDataPacket } from "mysql2";

export type LogMessageTypes = string | number | Record<string, unknown>;

export interface ILogger {
    error(message: LogMessageTypes): void;
    warn(message: LogMessageTypes): void;
    info(message: LogMessageTypes): void;
    http(message: LogMessageTypes): void;
    debug(message: LogMessageTypes): void;
}

export interface IDatabase {
    logger: ILogger;
}

export interface IPerson {
    name: string;
    id: number;
}

export type DbDefaults = RowDataPacket[] | RowDataPacket[][] | OkPacket[] | OkPacket;
export type DbQueryResult<T> = T & DbDefaults;