import { Database } from "./../core/Database";
import { Logger } from "./../core/Logger";
import jwt from "jsonwebtoken";
import penv from "../config/penv";
import { NextFunction, Request, Response } from "express";

const logger = new Logger;
const db = new Database(logger);

export const verifyToken = (req: Request, res: Response, next: NextFunction): Response | void => {
    const token = req.header("x-access-token");

    if (!token) {
        return res.status(403).send({
            message: "No token provided."
        });
    }

    if (penv.jwtAuthkey) {
        jwt.verify(token, penv.jwtAuthkey, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Unauthorized."
                });
            }

            if (decoded) req.id = decoded.id;
            next();
        });
    }
};

const getUserRolesQuery = `
    SELECT 
        r.name 
    FROM users u 
    LEFT JOIN user_roles ur 
        ON u.id = ur.user_id
    LEFT JOIN roles r 
        ON ur.role_id = r.id
    WHERE user_id = ?
`;

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const roles = await db.query<{ name: string; }>(getUserRolesQuery, [req.id]);

    if (!roles) return;

    if (roles.map(r => r.name).includes("admin")) {
        next();
        return;
    }

    res.status(403).send({
        message: "Require admin role."
    });
    return;
};

export const isModerator = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const roles = await db.query<{ name: string; }>(getUserRolesQuery, [req.id]);

    if (!roles) return;

    if (roles.map(r => r.name).includes("moderator")) {
        next();
        return;
    }

    res.status(403).send({
        message: "Require moderator role."
    });
    return;
};

export const isAdminOrModerator = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const roles = await db.query<{ name: string; }>(getUserRolesQuery, [req.id]);

    if (!roles) return;

    if (roles.map(r => r.name).includes("admin") || roles.map(r => r.name).includes("moderator")) {
        next();
        return;
    }

    res.status(403).send({
        message: "Require admin or moderator role."
    });
    return;
};