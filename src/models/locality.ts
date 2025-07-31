import { model, Schema } from "mongoose";

interface ILocality {
  name: string;
  city: Schema.Types.ObjectId;
  state: string;
  country: string;
}

export interface ILocalityDoc extends ILocality, Document {}

// CRUD TYPES
export type UpdateLocalityBody = Partial<ILocality>;
export type NewLocalityDoc = Omit<ILocality, "created">;

const localitySchema = new Schema<ILocalityDoc>(
  {
    name: { type: String, required: true },
    city: { type: Schema.Types.ObjectId, ref: "City", required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Locality = model<ILocalityDoc>(
  "Locality",
  localitySchema,
  "localities"
);
