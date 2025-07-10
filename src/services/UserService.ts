import {
  FilterQuery,
  ObjectId,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import { IUserDoc, User } from "../models/User";

export class UserService {
  /**
   * Find one user document based on the provided query.
   *
   * @param query - The query object to filter the user documents.
   * @param projection - The options object to specify the projection of the user documents.
   * @returns A promise that resolves to the found user document.
   */
  public async findOne(
    query: FilterQuery<IUserDoc>,
    projection?: ProjectionType<IUserDoc>
  ): Promise<IUserDoc | null> {
    return User.findOne(query, projection);
  }

  /**
   * Finds a user document by its ID.
   *
   * @param id - The ID of the user document to find.
   * @returns A promise that resolves to the found user document.
   */
  public static async findById(
    id: string | ObjectId
  ): Promise<IUserDoc | null> {
    return User.findById(id);
  }

  /**
   * Updates a user document by its ID.
   *
   * @param id - The ID of the user document to update.
   * @param updateDoc - The update object to apply to the user document.
   * @param options - The options object to specify additional update options.
   * @returns A promise that resolves to the updated user document.
   */
  public static async updateById(
    id: string | ObjectId,
    updateDoc: UpdateQuery<IUserDoc>,
    options?: QueryOptions<IUserDoc>
  ): Promise<IUserDoc | null> {
    return User.findByIdAndUpdate(id, updateDoc, options);
  }
}
