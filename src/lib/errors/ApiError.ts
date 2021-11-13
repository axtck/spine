export class ApiError {
    private _code: number;
    private _message: string;

    constructor(code: number, message: string) {
        this._code = code;
        this._message = message;
    }

    public get code(): number {
        return this._code;
    }

    public get message(): string {
        return this._message;
    }

    static badRequest(msg: string): ApiError {
        return new ApiError(400, msg);
    }

    static internal(msg: string): ApiError {
        return new ApiError(500, msg);
    }
}