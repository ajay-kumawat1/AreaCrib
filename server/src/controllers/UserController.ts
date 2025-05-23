import { NextFunction, Request, Response } from "express";

export default class UserController {
    public static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("Testing getAll method");
            
        } catch (error) {
            console.error(`UserController.getAll() -> Error: ${error}`);
            next(error);
        }
    }

    public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, email } = req.body;
            
        } catch (error) {
            console.error(`UserController.create() -> Error: ${error}`);
            next(error);
        }
    }
}
