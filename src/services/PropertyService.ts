import { FilterQuery, ProjectionType, SortOrder } from "mongoose";
import { IUserDoc, User } from "../models/User";
import { IPropertyDoc, Property } from "../models/Property";

export class PropertyService {
  /**
   * Finds property documents based on the provided query and options.
   *
   * @param query - The query object to filter the property documents.
   * @param projection - The options object to specify the projection of the property documents.
   * @param populate - The options object to specify the population of the property documents.
   * @param sortOptions - The options object to specify the sorting of the property documents.
   * @param page - The page number for pagination.
   * @param limit - The maximum number of property documents to return per page.
   * @returns A promise that resolves to an array of property documents.
   */
  public static async find(
    query: FilterQuery<IPropertyDoc>,
    projection?: ProjectionType<IPropertyDoc>,
    populate?: { path: string; select?: string[] },
    sortOptions: { [key: string]: SortOrder } = {},
    page?: number,
    limit?: number
  ): Promise<IPropertyDoc[]> {
    const cursor = Property.find(query, projection);
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
}
