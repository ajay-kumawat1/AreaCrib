import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";

export default class UserController {
    public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { firstName, lastName, email, password, avatar, role } = req.body;

            const isEmailExists = await User.findOne({ email });
            if (isEmailExists) {
                res.status(400).json({ message: "Email already exists" });
                return;
            }

            const newUser = new User({
                firstName,
                lastName,
                email,
                password,
                avatar,
                role
            });
            const createdUser = await newUser.save();
            res.status(201).json(createdUser);
            
        } catch (error) {
            console.error(`UserController.create() -> Error: ${error}`);
            next(error);
        }
    }

    public static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("UserController.getAll() -> Fetching all users");
            
        } catch (error) {
            console.error(`UserController.getAll() -> Error: ${error}`);
            next(error);
        }
    }
}
