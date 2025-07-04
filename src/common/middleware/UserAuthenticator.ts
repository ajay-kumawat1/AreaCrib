import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/common";
import { RESPONSE_CODE, RESPONSE_FAILURE } from "../interfaces/Constants";

export default class UserAuthenticator {
    /**
     * Middleware function to check if the user is authenticated.
     */
    public static isAuthenticated(): Array<Function> {
        return [
            UserAuthenticator.validateJWT,
        ];
    }

    protected static async validateJWT(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const token = req.header('x-auth-token') ?? null;
            if (token) {
                next();
            } else {
                return sendResponse(res, {}, 'Authentication token is missing', RESPONSE_FAILURE, RESPONSE_CODE.UNAUTHORISED);
            }
        } catch (error) {
            return sendResponse(res, {}, 'Internal server error', RESPONSE_FAILURE, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
        }
    }
}