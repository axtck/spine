// root types

import { Request, Response, NextFunction } from "express";

export interface IInsertResponse {
    warningStatus: number,
    serverStatus: number,
    insertId: number,
    info: string,
    fieldCount: number,
    affectedRows: number;
}

export type Id = number;

export type Nullable<T> = T | null;

export enum ApiMethods {
    Get = "GET",
    Post = "POST",
    Put = "PUT",
    Delete = "DELETE"
}

export type Middleware = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;