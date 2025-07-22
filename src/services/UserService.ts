import {
  FilterQuery,
  ObjectId,
  ProjectionType,
  QueryOptions,
  SortOrder,
  UpdateQuery,
} from "mongoose";
import { IUserDoc, NewCreatedUserDoc, User } from "../models/User";

export class UserService {
  /**
   * Finds user documents based on the provided query and options.
   *
   * @param query - The query object to filter the user documents.
   * @param projection - The options object to specify the projection of the user documents.
   * @param populate - The options object to specify the population of the user documents.
   * @param sortOptions - The options object to specify the sorting of the user documents.
   * @param page - The page number for pagination.
   * @param limit - The maximum number of user documents to return per page.
   * @returns A promise that resolves to an array of user documents.
   */
  public static async find(
    query: FilterQuery<IUserDoc>,
    projection?: ProjectionType<IUserDoc>,
    populate?: { path: string; select?: string[] },
    sortOptions: { [key: string]: SortOrder } = {},
    page?: number,
    limit?: number
  ): Promise<IUserDoc[]> {
    const cursor = User.find(query, projection);
    if (populate) {
      cursor.populate(populate);
    }
    if (sortOptions) {
      cursor.sort(sortOptions);
    }
    if (page !== undefined && limit) {
      cursor.skip(Math.max(page - 1, 0) * limit).limit(limit);
    }
    return cursor;
  }

  /**
   * Creates a new profile.
   *
   * @param resource - The profile object to be created.
   * @returns A promise that resolves to the created profile document.
   */
  public async create(resource: NewCreatedUserDoc): Promise<IUserDoc> {
    return User.create(resource);
  }

  public static count(query: FilterQuery<IUserDoc>): Promise<number> {
    return User.countDocuments(query).exec();
  }

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

  /**
   * Deletes a profile document by its ID.
   *
   * @param id - The ID of the profile document to delete.
   * @returns A promise that resolves to the deleted profile document.
   */
  public async deleteById(id: string | ObjectId): Promise<IUserDoc | null> {
    return User.findByIdAndDelete(id);
  }
}
