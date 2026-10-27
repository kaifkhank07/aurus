import mongoose, { Schema, Document, Model } from "mongoose";
import { IFileOption } from "@/types/general.types";

export interface IOccupancyDocument extends Document {
  name: string;
  image?: IFileOption;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OccupancyImageSchema = new Schema<IFileOption>(
  {
    id: { type: String, required: [true, "Image ID is required"], trim: true },
    publickey: { type: String, required: [true, "Image publickey is required"], trim: true },
  },
  { _id: false }
);

const OccupancySchema = new Schema<IOccupancyDocument>(
  {
    name: {
      type: String,
      required: [true, "Occupancy name is required"],
      trim: true,
      maxlength: [100, "Occupancy name cannot exceed 100 characters"],
    },
    image: {
      type: OccupancyImageSchema,
      default: undefined,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique index for occupancy name (case-insensitive)
OccupancySchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

export const Occupancy: Model<IOccupancyDocument> =
  (mongoose.models.Occupancy as Model<IOccupancyDocument>) ||
  mongoose.model<IOccupancyDocument>("Occupancy", OccupancySchema);

export default Occupancy;
