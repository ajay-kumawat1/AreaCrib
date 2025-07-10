import { NextFunction, Request, Response } from "express";
import arrayPolyfill from "./arrayPolyfill";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface User {
      id: string;
      role: string;
    }
    interface Request {
      user?: User;
      auth?: any; // Add this line to include the 'auth' property
    }
  }
}
import { expressjwt } from "express-jwt";
import { ExpressJWTSecret } from "./expressJWTSecret";
import { User } from "../../models/User";
import { sendResponse } from "../../utils/common";
import { RESPONSE_CODE, RESPONSE_FAILURE } from "../interfaces/Constants";

const expressSecretClient = new ExpressJWTSecret(); // Initialize JWT secret client

function validateAuth0JWT(): Array<
  (req: Request, res: Response, next: NextFunction) => void
> {
  return [
    arrayPolyfill,
    function (req: Request, res: Response, next: NextFunction): void {
      if (!req.user) {
        expressjwt({
          secret: expressSecretClient.getClient(),
          algorithms: ["RS256"],
          getToken: function fromHeader(request) {
            if (request.headers["x-auth-token"]) {
              return request.headers["x-auth-token"] as string;
            }
            return undefined;
          },
        })(req, res, next);
      } else {
        next();
      }
    },
    async function (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        if (req.auth?.sub) {
          const userId: string = req.auth.sub.split("|")[1];
          const user = await User.findById(userId);
          if (user) {
            req.user = {
              id: String(user._id),
              role: user.role,
            };
          }
          next();
        } else {
          return sendResponse(
            res,
            {},
            "Invalid authentication token",
            RESPONSE_FAILURE,
            RESPONSE_CODE.UNAUTHORIZED
          );
        }
      } catch (error) {
        next(error);
      }
    },
  ];
}

export { validateAuth0JWT };
