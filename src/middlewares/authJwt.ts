import { Database } from "./../core/Database";
import jwt from "jsonwebtoken";
import { penv } from "../config/penv";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/errors/ApiError";

const db = new Database();

export const verifyToken = (req: Request, res: Response, next: NextFunction): Response | void => {
    const token = req.header("x-access-token");

    if (!token) {
        next(ApiError.forbidden("No token provided"));
        return;
    }

    if (!penv.auth.jwtAuthkey) throw new Error("No JWT Authkey provided.");

    jwt.verify(token, penv.auth.jwtAuthkey, (err, decoded) => {
        if (err) {
            next(ApiError.unauthorized("Token authorization failed."));
            return;
        }

        if (!decoded) throw new Error("Couldn't decode token.");
        req.id = decoded.id;

        next();
    });
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

    res.status(403).json({
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

    res.status(403).json({
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

    res.status(403).json({
        message: "Require admin or moderator role."
    });
    return;
};