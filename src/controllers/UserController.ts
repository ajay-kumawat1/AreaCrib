import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
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
import { ObjectId } from "mongoose";
import { UserService } from "../services/UserService";
import UserFactory from "../factories/UserFactory";

export default class UserController {
  public static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userService = new UserService();
      const {
        firstName,
        lastName,
        email,
        password,
        mobileNumber,
        avatar,
        role,
      } = req.body;

      const isEmailExists = await userService.findOne({ email });
      if (isEmailExists) {
        return sendResponse(
          res,
          {},
          "Email already exists",
          RESPONSE_FAILURE,
          RESPONSE_CODE.BAD_REQUEST
        );
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = UserFactory.generateUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        mobileNumber,
        avatar,
        role,
      });

      const user = await userService.create(newUser);
      return sendResponse(
        res,
        user,
        "User created successfully",
        RESPONSE_FAILURE,
        RESPONSE_CODE.CREATED
      );
    } catch (error) {
      console.error(`UserController.create() -> Error: ${error}`);
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const userService = new UserService();
      const { email, password } = req.body;

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

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return sendResponse(
          res,
          {},
          "Invalid password",
          RESPONSE_FAILURE,
          RESPONSE_CODE.UNAUTHORIZED
        );
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET environment variable is not defined");
      }

      const payload = {
        user: {
          id: user._id,
          role: user.role,
        },
      };

      const token = await signToken(payload);
      return sendResponse(
        res,
        { token, user },
        "Login successful",
        RESPONSE_FAILURE,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      console.error(`UserController.login() -> Error: ${error}`);
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

      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isOldPasswordValid) {
        return sendResponse(
          res,
          {},
          "Old password is incorrect",
          RESPONSE_FAILURE,
          RESPONSE_CODE.UNAUTHORIZED
        );
      }

      // Hash the new password before saving
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();

      return sendResponse(
        res,
        {},
        "Password changed successfully",
        RESPONSE_FAILURE,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      console.error(`UserController.changePassword() -> Error: ${error}`);
      next(error);
    }
  }

  public static async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userService = new UserService();
      const { email } = req.body;

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
        req.body.isNew ? "auth/reset-password" : "reset-password"
      }/${token}`;

      // 🛡️ Update user with reset token
      await User.updateOne({ _id: user._id }, { resetToken: token });

      // ✉️ Send OTP via Email
      const subject = "Your Password Reset Link";
      const message = `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto;">
            <h2 style="color: #2c3e50;">Password Reset Request</h2>
            
            <p>Hello ${user.firstName || "there"},</p>
            
            <p>We received a request to reset your password. Click the button below to choose a new password:</p>
            
            <p style="text-align: center;">
              <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
                Reset Password
              </a>
            </p>

            <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
            <p style="word-break: break-all;">${resetLink}</p>
            
            <p>If you didn’t request this, you can safely ignore this email.</p>
            
            <p>Thanks,<br>The AJ Creation Team</p>
          </div>
        `;

      await sendEmail({
        to: user.email,
        subject,
        html: message,
      });

      return sendResponse(
        res,
        {},
        "ResetLink sent successfully to your email",
        RESPONSE_SUCCESS,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      console.error(`UserController.forgotPassword() -> Error: ${error}`);
      next(error);
    }
  }

  public static async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { newPassword, confirmPassword } = req.body;
    const { token } = req.params;
    const userService = new UserService();

    if (newPassword !== confirmPassword) {
      return sendResponse(
        res,
        {},
        "Passwords do not match",
        RESPONSE_FAILURE,
        RESPONSE_CODE.BAD_REQUEST
      );
    }

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

    await UserService.updateById(user._id as string | ObjectId, {
      $set: { password: hashedPassword },
      $unset: { resetToken: "", expireToken: "" },
    });

    return sendResponse(
      res,
      {},
      "Password reset successfully",
      RESPONSE_SUCCESS,
      RESPONSE_CODE.SUCCESS
    );
  }
}
