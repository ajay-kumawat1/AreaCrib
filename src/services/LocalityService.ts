import { FilterQuery, ProjectionType, SortOrder } from "mongoose";
import { ILocalityDoc, Locality, NewLocalityDoc } from "../models/locality";

export class LocalityService {
  /**
   * Finds locality documents based on the provided query and options.
   *
   * @param query - The query object to filter the locality documents.
   * @param projection - The options object to specify the projection of the locality documents.
   * @param populate - The options object to specify the population of the locality documents.
   * @param sortOptions - The options object to specify the sorting of the locality documents.
   * @param page - The page number for pagination.
   * @param limit - The maximum number of locality documents to return per page.
   * @returns A promise that resolves to an array of locality documents.
   */
  public static async find(
    query: FilterQuery<ILocalityDoc>,
    projection?: ProjectionType<ILocalityDoc>,
    populate?: { path: string; select?: string[] },
    sortOptions: { [key: string]: SortOrder } = {},
    page?: number,
    limit?: number
  ): Promise<ILocalityDoc[]> {
    const cursor = Locality.find(query, projection);
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
   * Creates a new locality.
   *
   * @param resource - The locality object to be created.
   * @returns A promise that resolves to the created locality document.
   */
  public async create(resource: NewLocalityDoc): Promise<ILocalityDoc> {
    return Locality.create(resource);
  }
}
