// import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { Database } from "../core/Database";
import { Logger } from "../core/Logger";

const logger = new Logger();
const db = new Database(logger);

export const signup = async (req: Request, res: Response): Promise<void> => {
    const createUserQuery = `
        INSERT INTO users (
            username,
            email,
            password 
        )
        VALUES (
            ?,
            ?,
            ?
        )  
    `;

    const buildSelectIdQuery = (table: string, column: string): string => {
        return `
            SELECT 
                id
            FROM ${table} 
            WHERE ${column} = ?
        `;
    };

    const createUserRoleQuery = `
        INSERT INTO user_roles (
            user_id,
            role_id
        )
        VALUES (
            ?,
            ?
        )
    `;

    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 8);
        await db.query(createUserQuery, [req.body.username, req.body.email, hashedPassword]);
        const createdUser = await db.queryOne<{ id: number; }>(buildSelectIdQuery("users", "username"), [req.body.username]);
        if (!createdUser) throw new Error("authController.signup finding user failed.");

        if (req.body.roles) {
            for (const r of req.body.roles) {
                const role = await db.queryOne<{ id: number; }>(buildSelectIdQuery("roles", "name"), [r]);
                if (!role) throw new Error("authController.signup finding role failed.");
                await db.query(createUserRoleQuery, [createdUser.id, role.id]);
            }
        } else {
            await db.query(createUserRoleQuery, [createdUser.id, 1]); // assign user role 
        }
        res.json({
            message: "User succesfully created."
        });
    }
    catch (e) {
        logger.error("Creating user failed.");
        if (e instanceof Error)
            res.status(500).json({
                message: e.message
            });
        throw e;
    }
};