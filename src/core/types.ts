type LoggerMessage = string | Record<string, unknown>;

export interface ILogger {
    error(message: LoggerMessage): void;
}