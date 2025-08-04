import { model, Schema, Document } from "mongoose";

interface IProperty {
  title: string;
  areaId: Schema.Types.ObjectId;
  price: number;
  size: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  description: string;
}

export type IPropertyDoc = Document<unknown, {}, IProperty> & IProperty;

// CRUD TYPES
export type UpdatePropertyBody = Partial<IProperty>;
export type NewPropertyDoc = Omit<IProperty, "created">;

const propertySchema = new Schema<IPropertyDoc>(
  {
    title: { type: String, required: true },
    areaId: { type: Schema.Types.ObjectId, ref: "Area", required: true },
    price: { type: Number, required: true },
    size: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    amenities: { type: [String], required: true },
    images: { type: [String], required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Property = model<IPropertyDoc>(
  "Property",
  propertySchema,
  "properties"
);
