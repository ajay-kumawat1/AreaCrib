import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import { PropertyService } from "../services/PropertyService";
import { sendResponse } from "../utils/common";
import {
  RESPONSE_CODE,
  RESPONSE_FAILURE,
} from "../common/interfaces/Constants";

export default class PropertyController {
  public static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const propertyService = new PropertyService();

      const isPropertyExists = await propertyService.findOne({
        title: req.body.title,
        LocalityId: req.body.LocalityId,
      });

      if (isPropertyExists) {
        return sendResponse(
          res,
          {},
          "Property with this title already exists in this locality",
          RESPONSE_FAILURE,
          RESPONSE_CODE.BAD_REQUEST
        );
      }
      req.body = {
        ...req.body,
        createdBy: req.user?.id,
      };

      const newProperty = await propertyService.create(req.body);
      return sendResponse(
        res,
        newProperty,
        "Property created successfully",
        RESPONSE_FAILURE,
        RESPONSE_CODE.CREATED
      );
    } catch (error) {
      logger.error(`PropertyController.create() -> Error: ${error}`);
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

      const [properties, total] = await Promise.all([
        PropertyService.find({}, { skip, limit }),
        PropertyService.count({}),
      ]);

      if (!properties || properties.length === 0) {
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
        {
          properties,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        "Properties fetched successfully",
        RESPONSE_FAILURE,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      logger.error(`PropertyController.getAll() -> Error: ${error}`);
      next(error);
    }
  }

  public static async getMy(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const properties = await PropertyService.find({ createdBy: userId });
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
      logger.error(`PropertyController.getMy() -> Error: ${error}`);
      next(error);
    }
  }

  public static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const propertyService = new PropertyService();
      const propertyId = req.params.id;

      const property = await propertyService.findOne({ _id: propertyId });
      if (!property) {
        return sendResponse(
          res,
          {},
          "Property not found",
          RESPONSE_FAILURE,
          RESPONSE_CODE.NOT_FOUND
        );
      }

      return sendResponse(
        res,
        property,
        "Property fetched successfully",
        RESPONSE_FAILURE,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      logger.error(`PropertyController.getById() -> Error: ${error}`);
      next(error);
    }
  }

  public static async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const propertyService = new PropertyService();
      const propertyId = req.params.id;

      const property = await propertyService.findOne({ _id: propertyId });
      if (!property) {
        return sendResponse(
          res,
          {},
          "Property not found",
          RESPONSE_FAILURE,
          RESPONSE_CODE.NOT_FOUND
        );
      }

      const updatedProperty = await PropertyService.updateById(
        propertyId,
        req.body
      );
      if (!updatedProperty) {
        return sendResponse(
          res,
          {},
          "Property update failed",
          RESPONSE_FAILURE,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR
        );
      }

      return sendResponse(
        res,
        updatedProperty,
        "Property updated successfully",
        RESPONSE_FAILURE,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      logger.error(`PropertyController.update() -> Error: ${error}`);
      next(error);
    }
  }

  public static async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const propertyId = req.params.id;
      const propertyService = new PropertyService();

      const property = await propertyService.findOne({ _id: propertyId });
      if (!property) {
        return sendResponse(
          res,
          {},
          "Property not found",
          RESPONSE_FAILURE,
          RESPONSE_CODE.NOT_FOUND
        );
      }

      const deletedProperty = await propertyService.deleteById(propertyId);
      if (!deletedProperty) {
        return sendResponse(
          res,
          {},
          "Property deletion failed",
          RESPONSE_FAILURE,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR
        );
      }

      return sendResponse(
        res,
        deletedProperty,
        "Property deleted successfully",
        RESPONSE_FAILURE,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      logger.error(`PropertyController.delete() -> Error: ${error}`);
      next(error);
    }
  }
}
