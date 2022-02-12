import { Pool } from "mysql2/promise";
import { AuthJwtMiddleware } from "./../middlewares/AuthJwtMiddleware";
import { UserService } from "../services/user/UserService";
import { Request, Response } from "express";
import { Controller } from "../core/Controller";
import { IControllerRoute } from "../core/types";
import { HttpMethod } from "../types";

export class UserController extends Controller {
    public path = "/content";
    protected readonly routes: IControllerRoute[] = [
        {
            path: "/all",
            method: HttpMethod.Get,
            handler: this.handleAllContent.bind(this),
            localMiddleware: []
        },
        {
            path: "/user",
            method: HttpMethod.Get,
            handler: this.handleUserContent.bind(this),
            localMiddleware: [
                this.authJwtMiddleware.verifyToken
            ]
        },
        {
            path: "/admin",
            method: HttpMethod.Get,
            handler: this.handleAdminContent.bind(this),
            localMiddleware: [
                this.authJwtMiddleware.verifyToken,
                this.authJwtMiddleware.isAdmin
            ]
        },
        {
            path: "/moderator",
            method: HttpMethod.Get,
            handler: this.handleModeratorContent.bind(this),
            localMiddleware: [
                this.authJwtMiddleware.verifyToken,
                this.authJwtMiddleware.isModerator
            ]
        }
    ];

    constructor(pool: Pool,
        private readonly userService: UserService = new UserService(pool),
        private readonly authJwtMiddleware: AuthJwtMiddleware = new AuthJwtMiddleware(pool)) {
        super(pool);
    }

    public async handleAllContent(req: Request, res: Response): Promise<void> {
        this.sendSuccess(res, undefined, "All content.");
    }

    public async handleUserContent(req: Request, res: Response): Promise<void> {
        this.sendSuccess(res, undefined, "User content.");
    }

    public async handleAdminContent(req: Request, res: Response): Promise<void> {
        this.sendSuccess(res, undefined, "Admin content.");
    }

    public async handleModeratorContent(req: Request, res: Response): Promise<void> {
        this.sendSuccess(res, undefined, "Moderator content.");
    }
}