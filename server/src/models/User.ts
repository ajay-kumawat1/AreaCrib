import { Document, Schema, model } from 'mongoose';

import { UserRole } from '../common/enum/Role';

export interface IUser {
    username: string;
    role: string;
    password: string;
    email: string;
    mobileNumber: string;
    avatar: string;
    resetToken: string;
    expireToken: Date;
    creationDate: Date;
    isDeleted: boolean;
}

export interface IUserDoc extends IUser, Document {}

// CRUD TYPES
export type UpdateUserBody = Partial<IUser>;
export type NewCreatedUserDoc = Omit<IUser, 'created'>;

const UserSchema = new Schema<IUserDoc>(
    {
        username: { type: String, unique: true, required: true },
        role: { type: String, enum: Object.values(UserRole), required: true },
        password: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        mobileNumber: { type: String },
        avatar: { type: String },
        resetToken: { type: String },
        expireToken: { type: Date },
        creationDate: { type: Date, default: Date.now },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true, toJSON: { virtuals: true } },
);

export const User = model<IUserDoc>('User', UserSchema, 'users');
