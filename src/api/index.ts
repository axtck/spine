import express, { Router } from "express";
import books from "./books";

const router: Router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "Base api route"
    });
});

router.use("/books", books);
export default router;