import { IUserModel } from "../models/UserModel";
import { AuthService } from "../services/AuthService";
import { NextFunction, Request, Response } from "express";
import { Controller } from "../core/Controller";
import { IControllerRoute } from "../core/types";
import { ApiMethods, Nullable } from "../types";
import { ApiError } from "../lib/errors/ApiError";
import { checkDuplicateUsernameOrEmail, checkRolesExisted } from "../middlewares/verifySignup";
import { penv } from "../config/penv";
import { ILoginResponse } from "./types";

export class AuthController extends Controller {
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

    constructor(private readonly authService: AuthService = new AuthService()) {
        super();
    }

    public async handleSignup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.authService.createUser(req.body.username, req.body.email, req.body.password);
            await this.authService.assignRoles(req.body.username, req.body.roles);

            this.sendSuccess(res, undefined, `User "${req.body.username}" succesfully created.`);
        } catch (e) {
            this.logger.error("Signup failed.");
            if (e instanceof ApiError) {
                next(ApiError.internal("Signup failed"));
                return;
            }
        }
    }

    public async handleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user: Nullable<IUserModel> = await this.authService.getUserByUsername(req.body.username);
            if (!user) {
                next(ApiError.unauthorized(`Invalid username "${req.body.username}".`));
                return;
            }

            const passwordIsValid: boolean = this.authService.validatePassword(req.body.password, user.password);
            if (!passwordIsValid) {
                next(ApiError.unauthorized("Invalid password."));
                return;
            }

            const token = this.authService.signToken(user.id, penv.auth.jwtAuthkey);
            const userRoles = await this.authService.getUserRoles(user.id);

            const loginResponse: ILoginResponse = {
                id: user.id,
                username: user.username,
                email: user.email,
                roles: userRoles,
                accessToken: token
            };

            this.sendSuccess(res, loginResponse, `User "${user.username}" successfully logged in.`);
        } catch (e) {
            this.logger.error("Login failed.");
            if (e instanceof ApiError) {
                next(ApiError.internal("Login failed."));
                return;
            }
        }
    }
}