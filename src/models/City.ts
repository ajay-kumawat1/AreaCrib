import { model, Schema } from "mongoose";

export interface ICity {
  name: string;
  country: string;
}

export interface ICityDoc extends ICity, Document {}

// CRUD TYPES
export type UpdateCityBody = Partial<ICity>;
export type NewCityDoc = Omit<ICity, "created">;

const citySchema = new Schema<ICityDoc>(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const City = model<ICityDoc>("City", citySchema, "cities");
