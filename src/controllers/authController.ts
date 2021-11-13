import { IUserModel } from "./../models/UserModel";
import { ApiError } from "./../lib/errors/ApiError";
import { NextFunction, Request, Response } from "express";
import { Database } from "../core/Database";
import { Logger } from "../core/Logger";
import penv from "../config/penv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const logger = new Logger();
const db = new Database(logger);

export const signup = async (req: Request, res: Response): Promise<void> => {
    const buildSelectIdQuery = (table: string, column: string): string => {
        return `
            SELECT 
                id
            FROM ${table} 
            WHERE ${column} = ?
        `;
    };

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
            await db.query(createUserRoleQuery, [createdUser.id, 1]); // assign 'user' role 
        }

        res.json({
            message: "User succesfully created."
        });
    }
    catch (e) {
        logger.error("Creating user failed.");
        if (e instanceof Error)
            ApiError.internal(e.message);
        throw e;
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const findUserQuery = `
        select 
            *
        from users
        where username = ?
    `;

    try {
        const user = await db.queryOne<IUserModel>(findUserQuery, [req.body.username]);
        if (!user) {
            next(ApiError.badRequest(`User ${req.body.username} not found.`));
            return;
        }

        const passwordIsValid: boolean = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            next(ApiError.unauthorized("Invalid password."));
            return;
        }


        if (!penv.jwtAuthkey) throw new Error("No JWT Authkey provided.");
        const oneDayInS = 60 * 60 * 24;
        const token = jwt.sign({ id: user.id }, penv.jwtAuthkey, {
            expiresIn: oneDayInS
        });

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

        const userRoles = await db.query<{ name: string; }>(getUserRolesQuery, [user.id]);

        if (!userRoles?.length) throw new Error("No user roles found.");

        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: userRoles,
            accessToken: token
        });
    } catch (e) {
        if (e instanceof ApiError) {
            next(ApiError.internal("Login failed."));
            return;
        }
        throw (e);
    }
};
