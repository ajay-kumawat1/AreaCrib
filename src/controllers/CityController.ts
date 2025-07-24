import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/common";
import {
  RESPONSE_CODE,
  RESPONSE_FAILURE,
  RESPONSE_SUCCESS,
} from "../common/interfaces/Constants";
import { logger } from "../utils/logger";
import { CityService } from "../services/CityService";

export default class CityController {
  public static async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const cities = await CityService.find({});
      if (!cities || cities.length === 0) {
        return sendResponse(
          res,
          {},
          "No cities found",
          RESPONSE_FAILURE,
          RESPONSE_CODE.NOT_FOUND
        );
      }

      return sendResponse(
        res,
        cities,
        "Cities retrieved successfully",
        RESPONSE_SUCCESS,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      logger.error(`CityController.getAll() -> Error: ${error}`);
      next(error);
    }
  }
}
