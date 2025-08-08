import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/common";
import {
  RESPONSE_CODE,
  RESPONSE_FAILURE,
} from "../common/interfaces/Constants";
// import redisClient from "../common/redisClient";

export const checkBlackList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    sendResponse(
      res,
      {},
      "No token found",
      RESPONSE_FAILURE,
      RESPONSE_CODE.UNAUTHORIZED
    );
  }

  const token = authHeader?.split("")[1];
  // const isBlacklisted = await redisClient.get(`blackList_${token}`);
  // if(isBlacklisted) {
  //     sendResponse(res, {}, "Token is blackListed, Please login again", RESPONSE_FAILURE, RESPONSE_CODE.UNAUTHORIZED)
  // }

  next();
};
