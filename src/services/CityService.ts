import { FilterQuery, ProjectionType, SortOrder } from "mongoose";
import { City, ICity, ICityDoc, NewCityDoc } from "../models/City";

export class CityService {
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
    query: FilterQuery<ICityDoc>,
    projection?: ProjectionType<ICityDoc>,
    populate?: { path: string; select?: string[] },
    sortOptions: { [key: string]: SortOrder } = {},
    page?: number,
    limit?: number
  ): Promise<ICityDoc[]> {
    const cursor = City.find(query, projection);
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
  public async create(resource: NewCityDoc): Promise<ICityDoc> {
    return City.create(resource);
  }
}
