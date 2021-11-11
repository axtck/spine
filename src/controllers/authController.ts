// import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { Database } from "../core/Database";
import { Logger } from "../core/Logger";
import { IRoleModel } from "../models/RoleModel";

const logger = new Logger();
const db = new Database(logger);

export const signup = async (req: Request, res: Response): Promise<void> => {
    const createUserQuery = `
        INSERT INTO users (
            username,
            email,
            password 
        )
        VALUES (
            ?,
            ?,
            ?
        )  
    `;

    const findRoleIdQuery = `
        SELECT 
            id
        FROM roles 
        WHERE roles.name = ?
    `;

    const createUserRoleQuery = `
         INSERT INTO user_roles (
            user_id,
            role_id
        )
        VALUES (
            ?,
            ?
        )
    `;

    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 8);
        await db.query(createUserQuery, [req.body.username, req.body.email, hashedPassword]);
        if (req.body.roles) {
            for (const r of req.body.roles) {
                const role = await db.queryOne<IRoleModel>(findRoleIdQuery, [r]);
                await db.query(createUserRoleQuery, [req.id, role.id]);
            }
        } else {
            await db.query(createUserQuery, [req.id, 1]); // assign user role 
        }
        res.send({
            message: "User succesfully created."
        })
    }
    catch (e) {
        logger.error("Creating user failed.");
        if(e instanceof Error)
        res.status(500).send({
            message: e.message
        });
        throw e;
    }








}