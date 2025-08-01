import { model, Schema } from "mongoose";

interface ILocality {
  name: string;
  city: Schema.Types.ObjectId;
  state: string;
  country: string;
  createdBy: Schema.Types.ObjectId;
}

export interface ILocalityDoc extends ILocality, Document {}

// CRUD TYPES
export type UpdateLocalityBody = Partial<ILocality>;
export type NewLocalityDoc = Omit<ILocality, "created">;

const localitySchema = new Schema<ILocalityDoc>(
  {
    name: { type: String, required: true },
    city: { type: Schema.Types.ObjectId, ref: "City", required: true },
    state: { type: String, default: "Gujarat" },
    country: { type: String, default: "India" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
