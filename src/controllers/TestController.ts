import { NextFunction, Request, Response } from "express";
import { Controller } from "../core/Controller";
import { IControllerRoute } from "../core/types";
import { ApiMethods } from "../types";

export class TestController extends Controller {
    constructor() {
        super();
    }

    public async handleTest(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log(await this.database.query("select * from users"));
        res.json({ message: "test" });
    }

    path = "/test";
    routes: IControllerRoute[] = [
        {
            path: "/controller",
            method: ApiMethods.Get,
            handler: this.handleTest.bind(this),
            localMiddleware: []
        }
    ];
}