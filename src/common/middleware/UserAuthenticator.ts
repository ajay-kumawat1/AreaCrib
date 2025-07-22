import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/common";
import { RESPONSE_CODE, RESPONSE_FAILURE } from "../interfaces/Constants";
import { validateAuth0JWT } from "./ValidAuth0Jwt";
import { UserRole } from "../enum/Role";

export default class AuthAuthenticator {
  /**
   * Middleware function to check if the user is authenticated.
   */
  public static isAuthenticated() {
    return [AuthAuthenticator.validateJWT, ...validateAuth0JWT()];
  }

  public static isAdminAuthenticated() {
    return [
      AuthAuthenticator.validateJWT,
      ...validateAuth0JWT(),
      AuthAuthenticator.isAdminLoggedIn,
    ];
  }

  protected static async validateJWT(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const token = req.header("x-auth-token") ?? null;
      if (token) {
        next();
      } else {
        return sendResponse(
          res,
          {},
          "Authentication token is missing",
          RESPONSE_FAILURE,
          RESPONSE_CODE.UNAUTHORIZED
        );
      }
    } catch (error) {
      console.error("JWT validation error:", error);
      return sendResponse(
        res,
        {},
        "Internal server error",
        RESPONSE_FAILURE,
        RESPONSE_CODE.INTERNAL_SERVER_ERROR
      );
    }
  }

  protected static async isAdminLoggedIn(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userDetails = req.user;
      if (
        typeof userDetails === "object" &&
        userDetails !== null &&
        (userDetails as any)?.role === UserRole.ADMIN
      ) {
        req.user = userDetails;
        next();
      } else {
        return sendResponse(
          res,
          {},
          "You are not authorized to perform this action",
          RESPONSE_FAILURE,
          RESPONSE_CODE.UNAUTHORIZED
        );
      }
    } catch (error) {
      console.error("Admin authentication error:", error);
      return sendResponse(
        res,
        {},
        "Internal server error",
        RESPONSE_FAILURE,
        RESPONSE_CODE.INTERNAL_SERVER_ERROR
      );
    }
  }
}
