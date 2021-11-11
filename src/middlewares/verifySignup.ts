import { Logger } from "./../core/Logger";
import { NextFunction, Request, Response } from "express";
import { Database } from "../core/Database";
import { InitialDatabaseConstants } from "../lib/InitialDatabaseConstants";

const logger = new Logger();
const db = new Database(logger);

export const checkDuplicateUsernameOrEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const buildSelectQueryBulder = (column: string) => {
        return `
            SELECT 
                * 
            FROM users 
            WHERE ${column} = ?; 
        `;
    };

    try {
        const usernameCheck = await db.query(buildSelectQueryBulder("username"), req.body.username);
        if (usernameCheck) {
            res.status(400).send({
                message: "Username is already in use."
            });
            return;
        }
        const emailCheck = await db.query("email", req.body.email);
        if (emailCheck) {
            res.status(400).send({
                message: "Email is already in use."
            });
            return;
        }

        next();
    } catch (e) {
        logger.error("Verifying signup failed.");
    }
};

export const checkRolesExisted = (req: Request, res: Response, next: NextFunction): void => {
    const roleNames: string[] = InitialDatabaseConstants.userRoles.map(u => u.name);
    if (req.body.roles) {
        req.body.roles.forEach((r: string) => {
            if (!roleNames.includes(r)) {
                res.status(400).send({
                    message: `Role ${r} does not exist.`
                });
                return;
            }
        });
    }

    next();
};