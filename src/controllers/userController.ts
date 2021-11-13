import { Request, Response } from "express";

export const allContent = (req: Request, res: Response): void => {
    res.status(200).json("All content");
};

export const userContent = (req: Request, res: Response): void => {
    res.status(200).json("User content");
};

export const adminContent = (req: Request, res: Response): void => {
    res.status(200).json("Admin content");
};

export const moderatorContent = (req: Request, res: Response): void => {
    res.status(200).json("Moderator content");
};