import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signToken } from "../utils/common";

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
        res.status(400).json({ message: "Email already exists" });
        return;
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

      res.status(201).json(userObj);
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
        return res.status(401).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
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
      res.json({ token, user });
    } catch (error) {
      console.error(`UserController.login() -> Error: ${error}`);
      next(error);
    }
  }
}
