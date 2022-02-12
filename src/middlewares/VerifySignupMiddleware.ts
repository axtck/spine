import { Pool } from "mysql2/promise";
import { lazyHandleException } from "../lib/functions/exceptionHandling";
import { Constants } from "./../Constants";
import { UserRole } from "./../types";
import { ApiError } from "./../lib/errors/ApiError";
import { AuthService } from "../services/auth/AuthService";
import { Request, Response, NextFunction } from "express";
import { Middleware } from "../core/Middleware";

export class VerifySignupMiddleware extends Middleware {
    constructor(pool: Pool,
        private readonly authService: AuthService = new AuthService(pool)) {
        super(pool);
    }

    public checkDuplicateUsernameOrEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const duplicateUsername = await this.authService.getDuplicateUsernameId(req.body.username);
            if (duplicateUsername) {
                next(ApiError.badRequest(`username '${req.body.username}' already in use`));
                return;
            }

            const duplicateEmail = await this.authService.getDuplicateEmailId(req.body.email);
            if (duplicateEmail) {
                next(ApiError.badRequest(`email '${req.body.email}' already in use`));
                return;
            }

            next();
        } catch (e) {
            lazyHandleException(e, "verifying signup failed", this.logger);
        }
    };

    public checkRolesExisted(req: Request, res: Response, next: NextFunction): void {
        const roleNames: UserRole[] = Constants.userRoles;
        if (req.body.roles?.length) {
            for (const role of req.body.roles) {
                if (!roleNames.includes(role)) {
                    next(ApiError.badRequest(`invalid role '${role}'`));
                    return;
                }
            }
        }

        next();
    }
}