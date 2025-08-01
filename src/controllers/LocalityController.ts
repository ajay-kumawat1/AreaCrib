import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import { LocalityService } from "../services/LocalityService";
import { sendResponse } from "../utils/common";
import {
  RESPONSE_CODE,
  RESPONSE_FAILURE,
} from "../common/interfaces/Constants";
import { Schema } from "mongoose";

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

  public static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const localityService = new LocalityService();
      req.body = {
        ...req.body,
        city: new Schema.Types.ObjectId(req.body.city),
        createdBy: req.user?.id,
      };

      const newLocality = await localityService.create(req.body);
      if (!newLocality) {
        return sendResponse(
          res,
          {},
          "Locality creation failed",
          RESPONSE_FAILURE,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR
        );
      }

      return sendResponse(
        res,
        newLocality,
        "Locality created successfully",
        RESPONSE_FAILURE,
        RESPONSE_CODE.CREATED
      );
    } catch (error) {
      logger.error(`LocalityController.create() -> Error: ${error}`);
      next(error);
    }
  }

  public static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const localityId = req.params.id;
      if (!localityId) {
        return sendResponse(
          res,
          {},
          "Locality ID is required",
          RESPONSE_FAILURE,
          RESPONSE_CODE.BAD_REQUEST
        );
      }

      const locality = await LocalityService.find({ _id: localityId });
      if (!locality || locality.length === 0) {
        return sendResponse(
          res,
          {},
          "Locality not found",
          RESPONSE_FAILURE,
          RESPONSE_CODE.NOT_FOUND
        );
      }

      return sendResponse(
        res,
        locality[0],
        "Locality retrieved successfully",
        RESPONSE_FAILURE,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      logger.error(`LocalityController.getById() -> Error: ${error}`);
      next(error);
    }
  }

  public static async getByCity(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const cityId = req.params.cityId;
      if (!cityId) {
        return sendResponse(
          res,
          {},
          "City ID is required",
          RESPONSE_FAILURE,
          RESPONSE_CODE.BAD_REQUEST
        );
      }

      const localities = await LocalityService.find({ city: cityId });
      if (!localities || localities.length === 0) {
        return sendResponse(
          res,
          [],
          "No localities found for the specified city",
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
      logger.error(`LocalityController.getByCity() -> Error: ${error}`);
      next(error);
    }
  }
}
