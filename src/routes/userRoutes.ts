import { setHeaders } from "./../middlewares/setHeaders";
import { isModerator } from "./../middlewares/authJwt";
import { allContent, userContent, moderatorContent, adminContent } from "./../controllers/userController";
import { isAdmin } from "../middlewares/authJwt";
import { verifyToken } from "../middlewares/authJwt";
import express, { Router } from "express";

const router: Router = express.Router();

router.use(setHeaders);

router.get(
    "/all",
    allContent
);

router.get(
    "/user",
    [verifyToken],
    userContent
);

router.get(
    "/moderator",
    [verifyToken, isModerator],
    moderatorContent
);

router.get(
    "/admin",
    [verifyToken, isAdmin],
    adminContent
);

export default router;


