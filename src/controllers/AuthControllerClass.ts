import { InfoError } from "./../lib/errors/InfoError";
import { NextFunction, Request, Response } from "express";
import { Controller } from "../core/Controller";
import { IControllerRoute } from "../core/types";
import { ApiMethods } from "../types";
import penv from "../config/penv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ApiError } from "../lib/errors/ApiError";
import { checkDuplicateUsernameOrEmail, checkRolesExisted } from "../middlewares/verifySignup";
import { AuthService } from "../services/AuthService";
import path from "path";

export class AuthControllerClass extends Controller {
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
    authService = new AuthService();

    constructor() {
        super();
    }

    public async handleSignup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // create user
            const hashedPassword = bcrypt.hashSync(req.body.password, 8);
            await this.authService.createUser(req.body.username, req.body.email, hashedPassword);

            // get created user
            const createdUser = await this.authService.getCreatedUserId(req.body.username);
            if (!createdUser) throw new InfoError(this.handleSignup.name, path.basename(__filename), "finding created user");

            // assign roles
            if (req.body.roles) {
                for (const r of req.body.roles) {
                    const role = await this.authService.getRole(r);
                    if (!role) throw new InfoError(this.handleSignup.name, path.basename(__filename), "finding role");
                    await this.authService.createUserRole(createdUser.id, role.id);
                }
            } else {
                await this.authService.createUserRole(createdUser.id, 1); // assign 'user' role 
            }

            res.json({
                message: "User succesfully created."
            });
        }
        catch (e) {
            this.database.logger.error("Signup failed.");
            if (e instanceof ApiError) {
                next(ApiError.internal("Signup failed"));
                return;
            }
        }

    }



    public async handleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.authService.getUser(req.body.username);
            if (!user) throw new Error(`User ${req.body.username} not found.`);


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
            this.logger.error("Login failed.");
            if (e instanceof ApiError) {
                next(ApiError.internal("Login failed."));
                return;
            }
        }
    }
}