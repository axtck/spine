import { Request, Response, NextFunction } from "express";

export const setHeaders = (req: Request, res: Response, next: NextFunction): void => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
};