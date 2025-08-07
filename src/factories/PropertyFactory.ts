import { ILooseObject } from "../common/interfaces/ILooseObject";
import { IPropertyDoc, Property } from "../models/Property";

export default class PropertyFactory {
  public static generateProperty(data: ILooseObject): IPropertyDoc {
    if (this.checkValidBuildData(data)) {
      return new Property(data);
    } else {
      throw new Error("Invalid property data provided for generation");
    }
  }

  public static checkValidBuildData(data: ILooseObject): boolean {
    return (
      !!data &&
      data.title &&
      data.LocalityId &&
      data.price &&
      data.size &&
      data.bedrooms &&
      data.bathrooms &&
      data.halls &&
      data.floors &&
      typeof data.furnished === "boolean" &&
      Array.isArray(data.amenities) &&
      Array.isArray(data.images) &&
      data.description
    );
  }
}
