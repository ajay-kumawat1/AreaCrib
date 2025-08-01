import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import { LocalityService } from "../services/LocalityService";
import { sendResponse } from "../utils/common";
import {
  RESPONSE_CODE,
  RESPONSE_FAILURE,
} from "../common/interfaces/Constants";

export default class LocalityController {
  public static async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const localities = await LocalityService.find({});
      if (!localities || localities.length === 0) {
        return sendResponse(
          res,
          [],
          "No localities found",
          RESPONSE_FAILURE,
          RESPONSE_CODE.NOT_FOUND
        );
      }

      return sendResponse(
        res,
        localities,
        "Localities retrieved successfully",
        RESPONSE_FAILURE,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      logger.error(`LocalityController.getAll() -> Error: ${error}`);
      next(error);
    }
  }
}
