import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendResponse, signToken } from "../utils/common";
import { randomBytes } from "crypto";
import config from "../config/config";
import {
  RESPONSE_CODE,
  RESPONSE_FAILURE,
} from "../common/interfaces/Constants";

export default class UserController {
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

      const isEmailExists = await User.findOne({ email });
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

      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        mobileNumber,
        avatar,
        role,
      });
      const createdUser = await newUser.save();

      // Remove password from response
      const userObj = createdUser.toObject();
      delete (userObj as any).password;

      return sendResponse(
        res,
        userObj,
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
      const { email, password } = req.body;

      const user = await User.findOne({ email }).lean();
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
          RESPONSE_CODE.UNAUTHORISED
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

  // change password
  public static async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, oldPassword, newPassword } = req.body;

      const user = await User.findById(userId);
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
          RESPONSE_CODE.UNAUTHORISED
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

  // forgot password
  public static async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email }).lean();
      if (!user) {
        return sendResponse(
          res,
          {},
          "User not found",
          RESPONSE_FAILURE,
          RESPONSE_CODE.NO_CONTENT_FOUND
        );
      }
      // send otp in mail
      const otp = randomBytes(3).toString("hex"); // Generate a 6-digit OTP
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
      
    }
    catch (error) {
      console.error(`UserController.forgotPassword() -> Error: ${error}`);
      next(error);
    }
  }
}
