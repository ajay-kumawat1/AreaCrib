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
}
