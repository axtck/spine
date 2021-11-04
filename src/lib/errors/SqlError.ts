import { QueryError } from "mysql2";
export class SqlError extends Error implements QueryError {
    code: string;
    sqlStateMarker?: string | undefined;
    sqlState?: string | undefined;
    fieldCount?: number | undefined;
    fatal: boolean;
    errno?: number | undefined;
    path?: string | undefined;
    syscall?: string | undefined;

    constructor(
        code: string,
        sqlStateMarker: string | undefined,
        sqlState: string | undefined,
        fieldCount: number | undefined,
        fatal: boolean,
        errno: number | undefined,
        path: string | undefined,
        syscall: string | undefined
    ) {
        super();
        this.code = code;
        this.sqlStateMarker = sqlStateMarker;
        this.sqlState = sqlState;
        this.fieldCount = fieldCount;
        this.fatal = fatal;
        this.errno = errno;
        this.path = path;
        this.syscall = syscall;
    }
}