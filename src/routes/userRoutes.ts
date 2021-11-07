import { Application } from "express";
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

    app.get("/api/test/admin", [verifyToken, isAdmin]);
};

export default routes;


