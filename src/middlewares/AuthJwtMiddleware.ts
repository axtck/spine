import { Database } from "./../core/Database";
import { ApiError } from "./../lib/errors/ApiError";
import { AuthService } from "../controllers/auth/AuthService";
import { Request, Response, NextFunction } from "express";
import { penv } from "../config/penv";
import { Middleware } from "../core/Middleware";
import { Logger } from "../core/Logger";
import jwt, { JwtPayload } from "jsonwebtoken";
import { injectable } from "tsyringe";
import { Id } from "../types";

@injectable()
export class AuthJwtMiddleware extends Middleware {
    private readonly authService: AuthService;
    constructor(logger: Logger, database: Database, authService: AuthService) {
        super(logger, database);
        this.authService = authService;
    }

    public verifyToken(req: Request, res: Response, next: NextFunction): Response | void {
        const token = req.header("x-access-token");

        if (!token) {
            next(ApiError.forbidden("no token provided"));
            return;
        }

        if (!penv.auth.jwtAuthkey) throw new Error("no JWT authkey provided");

        try {
            const decoded: string | JwtPayload = jwt.verify(token, penv.auth.jwtAuthkey);
            if (!decoded || typeof decoded === "string") {
                next(ApiError.internal("decoding token failed"));
                return;
            }

            req.id = decoded.id;
            next();
        } catch (e) {
            next(ApiError.internal(`token authorization failed: ${e}`));
            return;
        }
    }

    private authenticateRole(id: Id, userRoleNames: string[], role: string, next: NextFunction): void {
        if (!userRoleNames) {
            next(ApiError.internal(`no roles found for user with id '${id}'`));
            return;
        }

        if (userRoleNames.includes(role)) {
            next();
            return;
        }

        next(ApiError.forbidden(`require '${role}' role`));
        return;
    }

    public isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        if (!req.id) {
            next(ApiError.forbidden("no id in request"));
            return;
        }

        const userRoleNames = await this.authService.getUserRoleNames(req.id);
        this.authenticateRole(req.id, userRoleNames, "admin", next);
    };

    public isModerator = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        if (!req.id) {
            next(ApiError.forbidden("no id in request"));
            return;
        }

        const userRoleNames = await this.authService.getUserRoleNames(req.id);
        this.authenticateRole(req.id, userRoleNames, "moderator", next);
    };
}