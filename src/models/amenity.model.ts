import mongoose, { Schema, Document, Model } from "mongoose";
import { IFileOption } from "@/types/general.types";

export interface IAmenityDocument extends Document {
  name: string;
  image?: IFileOption;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AmenityImageSchema = new Schema<IFileOption>(
  {
    url: { type: String, required: [true, "Image URL is required"], trim: true },
    publickey: { type: String, required: [true, "Image publickey is required"], trim: true },
  },
  { _id: false }
);

const AmenitySchema = new Schema<IAmenityDocument>(
  {
    name: {
      type: String,
      required: [true, "Amenity name is required"],
      trim: true,
      maxlength: [100, "Amenity name cannot exceed 100 characters"],
    },
    image: {
      type: AmenityImageSchema,
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

// Unique index for amenity name (case-insensitive)
AmenitySchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

if (process.env.NODE_ENV !== "production" && mongoose.models.Amenity) {
  mongoose.deleteModel("Amenity");
}

export const Amenity: Model<IAmenityDocument> =
  (mongoose.models.Amenity as Model<IAmenityDocument>) ||
  mongoose.model<IAmenityDocument>("Amenity", AmenitySchema);

export default Amenity;
