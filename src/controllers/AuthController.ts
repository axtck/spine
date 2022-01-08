import { VerifySignupMiddleware } from "./../middlewares/VerifySignupMiddleware";
import { AuthService } from "../services/auth/AuthService";
import { NextFunction, Request, Response } from "express";
import { Controller } from "../core/Controller";
import { IControllerRoute } from "../core/types";
import { HttpMethod, IUser, Nullable } from "../types";
import { ApiError } from "../lib/errors/ApiError";
import { penv } from "../config/penv";
import { ILoginResponse } from "./types";

export class AuthController extends Controller {
    public path = "/auth";
    private readonly verifySignupMiddleware: VerifySignupMiddleware = new VerifySignupMiddleware();
    protected readonly routes: IControllerRoute[] = [
        {
            path: "/signup",
            method: HttpMethod.Post,
            handler: this.handleSignup.bind(this),
            localMiddleware: [
                this.verifySignupMiddleware.checkDuplicateUsernameOrEmail,
                this.verifySignupMiddleware.checkRolesExisted
            ]
        },
        {
            path: "/login",
            method: HttpMethod.Post,
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
            const user: Nullable<IUser> = await this.authService.getUserByUsername(req.body.username);
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