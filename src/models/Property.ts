import { model, Schema, Document } from "mongoose";

interface IProperty {
  title: string;
  LocalityId: Schema.Types.ObjectId;
  price: number;
  size: number;
  bedrooms: number;
  bathrooms: number;
  halls: number;
  floors: number;
  furnished: boolean;
  createdBy: Schema.Types.ObjectId;
  amenities: string[];
  images: string[];
  description: string;
}

export interface IPropertyDoc extends IProperty, Document {}

// CRUD TYPES
export type UpdatePropertyBody = Partial<IProperty>;
export type NewPropertyDoc = Omit<IProperty, "created">;

const propertySchema = new Schema<IPropertyDoc>(
  {
    title: { type: String, required: true },
    LocalityId: {
      type: Schema.Types.ObjectId,
      ref: "Locality",
      required: true,
    },
    price: { type: Number, required: true },
    size: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    halls: { type: Number, required: true },
    floors: { type: Number, required: true },
    furnished: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
