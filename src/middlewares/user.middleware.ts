import { NextFunction, Request, Response } from "express";
import { isEmpty } from "lodash";
import { sendResponse } from "../utils/common";
import Joi from "joi";

import {
  RESPONSE_CODE,
  RESPONSE_FAILURE,
} from "../common/interfaces/Constants";

const validateAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (isEmpty(req.body)) {
      return sendResponse(
        res,
        {},
        "Request body cannot be empty",
        RESPONSE_FAILURE,
        RESPONSE_CODE.BAD_REQUEST
      );
    }

    const registerSchema = Joi.object({
      firstName: Joi.string().min(2).max(100).required(),
      lastName: Joi.string().min(2).max(100).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      mobileNumber: Joi.string().min(10).max(15).required(),
    });

    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return sendResponse(
        res,
        {},
        `Validation error: ${error.details
          .map((x) => x.message.replace(/"/g, ""))
          .join(", ")}`,
        RESPONSE_FAILURE,
        RESPONSE_CODE.BAD_REQUEST
      );
    }

    req.body = value;
    next();
  } catch (error) {
    console.log(`UserMiddleware.validateUser() -> Error: ${error}`);
    next(error);
  }
};

export { validateAuth };
