import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import { PropertyService } from "../services/PropertyService";
import { sendResponse } from "../utils/common";
import {
  RESPONSE_CODE,
  RESPONSE_FAILURE,
} from "../common/interfaces/Constants";

export default class PropertyController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const properties = await PropertyService.find({});
      if (!properties) {
        return sendResponse(
          res,
          {},
          "No properties found",
          RESPONSE_FAILURE,
          RESPONSE_CODE.NOT_FOUND
        );
      }

      return sendResponse(
        res,
        properties,
        "Properties fetched successfully",
        RESPONSE_FAILURE,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      logger.error(`PropertyController.getAll() -> Error: ${error}`);
      next(error);
    }
  }
}
