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

  public static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userService = new UserService();
      const userId = req.params.id;

      const user = await userService.findOne({ _id: userId });
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
      logger.error(`UserController.getById() -> Error: ${error}`);
      next(error);
    }
  }

  public static async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        UserService.find({}, { skip, limit }),
        UserService.count({}),
      ]);

      return sendResponse(
        res,
        {
          users,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        "Users retrieved successfully",
        RESPONSE_SUCCESS,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      logger.error(`UserController.getAll() -> Error: ${error}`);
      next(error);
    }
  }

  public static async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const updateData = req.body;

      if (!userId) {
        return sendResponse(
          res,
          {},
          "User ID is missing",
          RESPONSE_FAILURE,
          RESPONSE_CODE.BAD_REQUEST
        );
      }

      const updatedUser = await UserService.updateById(userId, updateData);
      if (!updatedUser) {
        return sendResponse(
          res,
          {},
          "User update failed",
          RESPONSE_FAILURE,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR
        );
      }

      return sendResponse(
        res,
        updatedUser,
        "User updated successfully",
        RESPONSE_SUCCESS,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      logger.error(`UserController.update() -> Error: ${error}`);
      next(error);
    }
  }

  public static async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;

      if (!userId) {
        return sendResponse(
          res,
          {},
          "User ID is required",
          RESPONSE_FAILURE,
          RESPONSE_CODE.BAD_REQUEST
        );
      }

      const userService = new UserService();
      const deletedUser = await userService.findOne({ _id: userId });

      if (!deletedUser) {
        return sendResponse(
          res,
          {},
          "User not found",
          RESPONSE_FAILURE,
          RESPONSE_CODE.NOT_FOUND
        );
      }

      await userService.deleteById(userId);

      return sendResponse(
        res,
        {},
        "User deleted successfully",
        RESPONSE_SUCCESS,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      logger.error(`UserController.delete() -> Error: ${error}`);
      next(error);
    }
  }
}
