import { isModerator } from "./../middlewares/authJwt";
import { UserService } from "./../services/UserService";
import { Request, Response } from "express";
import { Controller } from "../core/Controller";
import { IControllerRoute } from "../core/types";
import { ApiMethods } from "../types";
import { isAdmin, verifyToken } from "../middlewares/authJwt";

export class UserControllerClass extends Controller {
    path = "/content";
    routes: IControllerRoute[] = [
        {
            path: "/all",
            method: ApiMethods.Post,
            handler: this.handleAllContent.bind(this),
            localMiddleware: []
        },
        {
            path: "/user",
            method: ApiMethods.Post,
            handler: this.handleUserContent.bind(this),
            localMiddleware: [verifyToken]
        },
        {
            path: "/admin",
            method: ApiMethods.Post,
            handler: this.handleAdminContent.bind(this),
            localMiddleware: [verifyToken, isAdmin]
        },
        {
            path: "/moderator",
            method: ApiMethods.Post,
            handler: this.handleModeratorContent.bind(this),
            localMiddleware: [verifyToken, isModerator]
        }
    ];
    private readonly userService = new UserService();

    constructor() {
        super();
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