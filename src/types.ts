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