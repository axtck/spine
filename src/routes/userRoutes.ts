import { Application, Request, Response } from "express";
import { isAdmin } from "../middlewares/authJwt";
import { verifyToken } from "../middlewares/authJwt";

const routes = (app: Application): void => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/test/admin", [verifyToken, isAdmin], (req: Request, res: Response) => {
        console.log(req.body);
        res.json({ message: "test admin" });
    });
};

export default routes;


