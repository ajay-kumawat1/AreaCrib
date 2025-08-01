import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export default class LocalityController {
  public static getAll(req: Request, res: Response, next: NextFunction): void {
    try {
      // Simulate fetching localities from a service or database
    } catch (error) {
      logger.error(`LocalityController.getAll() -> Error: ${error}`);
      next(error);
    }
  }
}
