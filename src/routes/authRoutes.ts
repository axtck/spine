import { setHeaders } from "./../middlewares/setHeaders";
import { login, signup } from "../controllers/authController";
import { checkDuplicateUsernameOrEmail, checkRolesExisted } from "../middlewares/verifySignup";
import express from "express";

const router = express.Router();

router.use(setHeaders);
console.log(router);

router.post(
    "/signup",
    [checkDuplicateUsernameOrEmail, checkRolesExisted],
    signup
);

router.post(
    "/login",
    login
);

export default router;