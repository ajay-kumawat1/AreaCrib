import { Document, Schema, model } from "mongoose";

import { UserRole } from "../common/enum/Role";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobileNumber: string;
  avatar?: string;
  role: string;
  creationDate: Date;
  isDeleted: boolean;
  resetToken: string;
}

export interface IUserDoc extends IUser, Document {}

// CRUD TYPES
export type UpdateUserBody = Partial<IUser>;
export type NewCreatedUserDoc = Omit<IUser, "created">;

const UserSchema = new Schema<IUserDoc>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNumber: { type: String },
    avatar: { type: String },
    role: { type: String, enum: Object.values(UserRole), required: true },
    creationDate: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    resetToken: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export const User = model<IUserDoc>("User", UserSchema, "users");
