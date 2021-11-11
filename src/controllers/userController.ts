import { Request, Response } from "express";

export const allContent= (req: Request, res: Response): void => {
    res.status(200).send("All content");
}

export const userContent= (req: Request, res: Response): void => {
    res.status(200).send("User content");
}

export const adminContent= (req: Request, res: Response): void => {
    res.status(200).send("Admin content");
}

export const moderatorContent= (req: Request, res: Response): void => {
    res.status(200).send("Moderator content");
}