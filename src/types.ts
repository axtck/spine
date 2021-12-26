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

export enum HttpMethod {
    Get = "GET",
    Post = "POST",
    Put = "PUT",
    Delete = "DELETE"
}

export enum UserRole {
    User = "user",
    Admin = "admin",
    Moderator = "moderator"
}

export enum Environment {
    Development = "development",
    Staging = "staging",
    Production = "production"
}

export type Environments = `${Environment}`;