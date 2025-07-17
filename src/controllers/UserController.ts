import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { sendResponse } from "../utils/common";
import {
  RESPONSE_CODE,
  RESPONSE_FAILURE,
  RESPONSE_SUCCESS,
} from "../common/interfaces/Constants";
import { logger } from "../utils/logger";

export default class UserController {
  public static async getMy(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userService = new UserService();

      const user = await userService.findOne({ _id: req.user?.id });
      if (!user) {
        return sendResponse(
          res,
          {},
          "User not found",
          RESPONSE_FAILURE,
          RESPONSE_CODE.NOT_FOUND
        );
      }

      return sendResponse(
        res,
        user,
        "User retrieved successfully",
        RESPONSE_SUCCESS,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      logger.error(`UserController.getMy() -> Error: ${error}`);
      next(error);
    }
  }
}
