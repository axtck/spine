import { Logger } from "./../core/Logger";
import { Request, Response } from "express";
import { ApiError } from "../lib/errors/ApiError";

const logger = new Logger();
export const apiErrorHandler = (err: Error, req: Request, res: Response): void => {
    logger.error(err.message);

    if (err instanceof ApiError) {
        res.status(err.code).json(err.message);
        return;
    }

    res.status(500).json("Something went wrong");
};