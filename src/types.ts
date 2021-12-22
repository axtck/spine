// root types

export interface IInsertResponse {
    warningStatus: number,
    serverStatus: number,
    insertId: number,
    info: string,
    fieldCount: number,
    affectedRows: number;
}

export type Id = number;

export type QueryString = string;

export type Nullable<T> = T | null;

export enum ApiMethods {
    Get = "GET",
    Post = "POST",
    Put = "PUT",
    Delete = "DELETE"
}