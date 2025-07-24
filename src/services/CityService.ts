import { FilterQuery, ProjectionType, SortOrder } from "mongoose";
import { City, ICity } from "../models/City";

export class CityService {
  public static async find(
    query: FilterQuery<ICity>,
    projection?: ProjectionType<ICity>,
    populate?: { path: string; select?: string[] },
    sortOptions: { [key: string]: SortOrder } = {},
    page?: number,
    limit?: number
  ): Promise<ICity[]> {
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
}
