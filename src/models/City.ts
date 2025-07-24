import { model, Schema } from "mongoose";

export interface ICity {
  name: string;
  country: string;
}

const citySchema = new Schema<ICity>(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const City = model<ICity>("City", citySchema, "cities");
