import { Application, NextFunction, Request, Response } from "express";
import { checkDuplicateUsernameOrEmail, checkRolesExisted } from "../middlewares/verifySignup";

const routes = (app: Application): void => {
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/auth/signup", [checkDuplicateUsernameOrEmail, checkRolesExisted], (req: Request, res: Response) => {
        res.json({ message: "test admin" });
    });
};

export default routes;