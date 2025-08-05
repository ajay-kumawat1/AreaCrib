import {
  FilterQuery,
  ObjectId,
  ProjectionType,
  QueryOptions,
  SortOrder,
  UpdateQuery,
} from "mongoose";
import { IPropertyDoc, NewPropertyDoc, Property } from "../models/Property";

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

  /**
   * Creates a new property.
   *
   * @param resource - The property object to be created.
   * @returns A promise that resolves to the created property document.
   */
  public async create(resource: NewPropertyDoc): Promise<IPropertyDoc> {
    return Property.create(resource);
  }

  /**
   * Find one property document based on the provided query.
   *
   * @param query - The query object to filter the property documents.
   * @param projection - The options object to specify the projection of the property documents.
   * @returns A promise that resolves to the found property document.
   */
  public async findOne(
    query: FilterQuery<IPropertyDoc>,
    projection?: ProjectionType<IPropertyDoc>
  ): Promise<IPropertyDoc | null> {
    return Property.findOne(query, projection);
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
    updateDoc: UpdateQuery<IPropertyDoc>,
    options?: QueryOptions<IPropertyDoc>
  ): Promise<IPropertyDoc | null> {
    return Property.findByIdAndUpdate(id, updateDoc, options);
  }
}
