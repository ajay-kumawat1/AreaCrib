import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";

export default class UserController {
    public static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await User.find({}, {}, { path: 'hostCompany', select: ['name'] });

            if (users.length === 0) {
                res.status(404).json({ message: "No users found" });
            }

            res.status(200).json(users);
            
        } catch (error) {
            console.error(`UserController.getAll() -> Error: ${error}`);
            next(error);
        }
    }
}
