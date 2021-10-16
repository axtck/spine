export type LogMessageTypes = string | number | Record<string, unknown>;

export interface ILogger {
    error(message: LogMessageTypes): void;
    warn(message: LogMessageTypes): void;
    info(message: LogMessageTypes): void;
    http(message: LogMessageTypes): void;
    debug(message: LogMessageTypes): void;
}
