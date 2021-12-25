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
    public path = "/auth";
    protected readonly routes: IControllerRoute[] = [
        {
            path: "/signup",
            method: ApiMethods.Post,
            handler: this.handleSignup.bind(this),
            localMiddleware: [checkDuplicateUsernameOrEmail, checkRolesExisted]
        },
        {
            path: "/login",
            method: ApiMethods.Post,
            handler: this.handleLogin,
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

            this.sendSuccess(res, undefined, `user '${req.body.username}' succesfully created`);
        } catch (e) {
            if (e instanceof Error) {
                next(ApiError.internal(`signup failed: ${e.message}`));
                return;
            }
            next(ApiError.internal(`signup failed: ${e}`));
            return;
        }
    }

    public async handleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user: Nullable<IUserModel> = await this.authService.getUserByUsername(req.body.username);
            if (!user) {
                next(ApiError.unauthorized(`user '${req.body.username}' not found`));
                return;
            }

            const passwordIsValid: boolean = this.authService.validatePassword(req.body.password, user.password);
            if (!passwordIsValid) {
                next(ApiError.unauthorized(`invalid password for user '${req.body.username}'`));
                return;
            }

            const token = this.authService.signToken(user.id, penv.auth.jwtAuthkey);
            const userRoles = await this.authService.getUserRoleNames(user.id);

            const loginResponse: ILoginResponse = {
                id: user.id,
                username: user.username,
                email: user.email,
                roles: userRoles,
                accessToken: token
            };

            this.sendSuccess(res, loginResponse, `user '${user.username}' successfully logged in`);
        } catch (e) {
            if (e instanceof Error) {
                next(ApiError.internal(`login failed: ${e.message}`));
                return;
            }
            next(ApiError.internal(`login failed: ${e}`));
            return;
        }
    }
}