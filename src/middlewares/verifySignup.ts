import { Logger } from "./../core/Logger";
import { NextFunction, Request, Response } from "express";
import { Database } from "../core/Database";
import { InitialDatabaseConstants } from "../lib/InitialDatabaseConstants";
import { ApiError } from "../lib/errors/ApiError";

const logger = new Logger();
const db = new Database(logger);

export const checkDuplicateUsernameOrEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const buildSelectQuery = (column: string) => {
        return `
            SELECT 
                * 
            FROM users 
            WHERE ${column} = ?; 
        `;
    };

    try {
        const usernameCheck = await db.queryOne<{ username: string; }>(buildSelectQuery("username"), [req.body.username]);
        if (usernameCheck) {
            next(ApiError.badRequest(`Username '${usernameCheck.username}' is already in use.`));
            return;
        }

        const emailCheck = await db.queryOne<{ email: string; }>(buildSelectQuery("email"), [req.body.email]);
        if (emailCheck) {
            next(ApiError.badRequest(`Email '${emailCheck.email}' is already in use.`));
            return;
        }

        next();
    } catch (e) {
        logger.error("Verifying signup failed.");
        throw (e);
    }
};

export const checkRolesExisted = (req: Request, res: Response, next: NextFunction): void => {
    const roleNames: string[] = InitialDatabaseConstants.userRoles.map(u => u.name);
    if (req.body.roles) {
        req.body.roles.forEach((r: string) => {
            if (!roleNames.includes(r)) {
                next(ApiError.badRequest(`Role ${r} does not exist.`));
                return;
            }
        });
    }

    next();
};