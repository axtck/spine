import express, { Router } from "express";
import auth from "./authRoutes";
import user from "./userRoutes";

const router: Router = express.Router();

router.use("/auth", auth);
router.use("/user", user);

export default router;