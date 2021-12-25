import { Constants } from "./../Constants";
import { UserRole } from "./../types";
import { ApiError } from "./../lib/errors/ApiError";
import { AuthService } from "./../services/AuthService";
import { Request, Response, NextFunction } from "express";
import { Middleware } from "../core/Middleware";

export class VerifySignupMiddleware extends Middleware {
    private readonly authService: AuthService = new AuthService();

    constructor() {
        super();
    }

    public checkDuplicateUsernameOrEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const duplicateUsername = await this.authService.getDuplicateUsernameId(req.body.username);
            if (duplicateUsername) {
                next(ApiError.badRequest(`username '${req.body.username}' is already in use`));
                return;
            }

            const duplicateEmail = await this.authService.getDuplicateEmailId(req.body.email);
            if (duplicateEmail) {
                next(ApiError.badRequest(`email '${req.body.email}' is already in use`));
                return;
            }

            next();
        } catch (e) {
            if (e instanceof Error) {
                this.logger.error(`verifying signup failed: ${e.message}`);
            } else {
                this.logger.error(e);
            }
        }
    };

    public checkRolesExisted(req: Request, res: Response, next: NextFunction): void {
        const roleNames: UserRole[] = Constants.userRoles;
        if (req.body.roles && req.body.roles.length) {
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