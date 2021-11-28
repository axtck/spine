import { NextFunction, Request, Response } from "express";
import { Controller } from "../core/Controller";
import { IControllerRoute } from "../core/types";
import { ApiMethods } from "../types";
import penv from "../config/penv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ApiError } from "../lib/errors/ApiError";
import { IUserModel } from "../models/UserModel";
import { checkDuplicateUsernameOrEmail, checkRolesExisted } from "../middlewares/verifySignup";

export class AuthControllerClass extends Controller {
    constructor() {
        super();
    }

    path = "/auth";
    routes: IControllerRoute[] = [
        {
            path: "/signup",
            method: ApiMethods.Post,
            handler: this.handleSignup.bind(this),
            localMiddleware: [checkDuplicateUsernameOrEmail, checkRolesExisted]
        },
        {
            path: "/login",
            method: ApiMethods.Post,
            handler: this.handleLogin.bind(this),
            localMiddleware: []
        }
    ];

    public async handleSignup(req: Request, res: Response, next: NextFunction): Promise<void> {
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
            await this.database.query(createUserQuery, [req.body.username, req.body.email, hashedPassword]);
            const createdUser = await this.database.queryOne<{ id: number; }>(buildSelectIdQuery("users", "username"), [req.body.username]);
            if (!createdUser) throw new Error("authController.signup finding user failed.");

            if (req.body.roles) {
                for (const r of req.body.roles) {
                    const role = await this.database.queryOne<{ id: number; }>(buildSelectIdQuery("roles", "name"), [r]);
                    if (!role) throw new Error("authController.signup finding role failed.");
                    await this.database.query(createUserRoleQuery, [createdUser.id, role.id]);
                }
            } else {
                await this.database.query(createUserRoleQuery, [createdUser.id, 1]); // assign 'user' role 
            }

            res.json({
                message: "User succesfully created."
            });
        }
        catch (e) {
            this.database.logger.error("Creating user failed.");
            if (e instanceof Error)
                ApiError.internal(e.message);
            throw e;
        }
    }

    public async handleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        const findUserQuery = `
            SELECT 
                *
            FROM users
            WHERE username = ?
        `;

        try {
            const user = await this.database.queryOne<IUserModel>(findUserQuery, [req.body.username]);
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

            const userRoles = await this.database.query<{ name: string; }>(getUserRolesQuery, [user.id]);

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
    }
}