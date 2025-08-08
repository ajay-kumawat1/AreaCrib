import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { sendResponse, signToken } from "../utils/common";
import { randomBytes } from "crypto";
import config from "../config/config";
import {
  RESPONSE_CODE,
  RESPONSE_FAILURE,
  RESPONSE_SUCCESS,
} from "../common/interfaces/Constants";
import { sendEmail } from "../utils/sendMail";
import UserManager from "../managers/UserManager";
import { UserService } from "../services/UserService";
import UserFactory from "../factories/UserFactory";
import { logger } from "../utils/logger";
// import redisClient from "../common/redisClient";
import { getResetPasswordEmail } from "../template/resetPasswordEmail";

export default class AuthController {
  public static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        mobileNumber,
        avatar,
        role,
      } = req.body;

      const userService = new UserService();

      if (await userService.findOne({ email })) {
        return sendResponse(
          res,
          {},
          "Email already exists",
          RESPONSE_FAILURE,
          RESPONSE_CODE.BAD_REQUEST
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await userService.create(
        UserFactory.generateUser({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          mobileNumber,
          avatar,
          role,
        })
      );

      return sendResponse(
        res,
        user,
        "User created successfully",
        RESPONSE_FAILURE,
        RESPONSE_CODE.CREATED
      );
    } catch (error) {
      logger.error(`AuthController.create() -> Error: ${error}`);
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const userService = new UserService();

      const user = await userService.findOne({ email });
      if (!user) {
        return sendResponse(
          res,
          {},
          "User not found",
          RESPONSE_FAILURE,
          RESPONSE_CODE.NO_CONTENT_FOUND
        );
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return sendResponse(
          res,
          {},
          "Invalid password",
          RESPONSE_FAILURE,
          RESPONSE_CODE.UNAUTHORIZED
        );
      }

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is not defined");
      }

      const token = await signToken({
        user: { id: user._id, role: user.role },
      });

      return sendResponse(
        res,
        { token, user },
        "Login successful",
        RESPONSE_SUCCESS,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      logger.error(`AuthController.login() -> Error: ${error}`);
      next(error);
    }
  }

  public static async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, oldPassword, newPassword } = req.body;

      const user = await UserService.findById(userId);
      if (!user) {
        return sendResponse(
          res,
          {},
          "User not found",
          RESPONSE_FAILURE,
          RESPONSE_CODE.NO_CONTENT_FOUND
        );
      }

      if (!(await bcrypt.compare(oldPassword, user.password))) {
        return sendResponse(
          res,
          {},
          "Old password is incorrect",
          RESPONSE_FAILURE,
          RESPONSE_CODE.UNAUTHORIZED
        );
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      return sendResponse(
        res,
        {},
        "Password changed successfully",
        RESPONSE_SUCCESS,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      logger.error(`AuthController.changePassword() -> Error: ${error}`);
      next(error);
    }
  }

  public static async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, isNew } = req.body;
      const userService = new UserService();

      const user = await userService.findOne({ email });
      if (!user) {
        return sendResponse(
          res,
          {},
          "User not found",
          RESPONSE_FAILURE,
          RESPONSE_CODE.NO_CONTENT_FOUND
        );
      }

      const token = randomBytes(32).toString("hex");
      const resetLink = `${config.server.client}/${
        isNew ? "auth/reset-password" : "reset-password"
      }/${token}`;

      // Set reset token and expiry (1 hour)
      await UserService.updateById(user._id as string, {
        resetToken: token,
        expireToken: Date.now() + 3600000,
      });

      const subject = "Your Password Reset Link";
      const firstName = user.firstName || "there";
      const message = getResetPasswordEmail({ firstName, resetLink });

      await sendEmail({ to: email, subject, html: message });

      return sendResponse(
        res,
        {},
        "Reset link sent successfully to your email",
        RESPONSE_SUCCESS,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      logger.error(`AuthController.forgotPassword() -> Error: ${error}`);
      next(error);
    }
  }

  public static async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { newPassword, confirmPassword } = req.body;
      const { token } = req.params;

      if (newPassword !== confirmPassword) {
        return sendResponse(
          res,
          {},
          "Passwords do not match",
          RESPONSE_FAILURE,
          RESPONSE_CODE.BAD_REQUEST
        );
      }

      const userService = new UserService();
      const user = await userService.findOne({
        resetToken: token,
        expireToken: { $gt: Date.now() },
      });

      if (!user) {
        return sendResponse(
          res,
          {},
          "Invalid or expired reset token",
          RESPONSE_FAILURE,
          RESPONSE_CODE.UNAUTHORIZED
        );
      }

      const { hashedPassword } = await UserManager.generatePasswordAndAvatar(
        user.email,
        newPassword
      );

      await UserService.updateById(user._id as string, {
        password: hashedPassword,
        $unset: { resetToken: "", expireToken: "" },
      });

      return sendResponse(
        res,
        {},
        "Password reset successfully",
        RESPONSE_SUCCESS,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      logger.error(`AuthController.resetPassword() -> Error: ${error}`);
      next(error);
    }
  }

  public static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        sendResponse(
          res,
          {},
          "No token found",
          RESPONSE_FAILURE,
          RESPONSE_CODE.BAD_REQUEST
        );
      }

      // const token = authHeader?.split("")[1];
      // await redisClient.set(`blacklist_${token}`, `1`, {
      //   EX: 60 * 60,
      // });

      sendResponse(
        res,
        {},
        "Logged out successfully",
        RESPONSE_SUCCESS,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      logger.error(`AuthController.logout() -> Error: ${error}`);
      next(error);
    }
  }
}
