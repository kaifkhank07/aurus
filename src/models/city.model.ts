import mongoose, { Schema, Document, Model } from "mongoose";
import { ISeoMetadata, IFileOption } from "@/types/general.types";

export interface ICityDocument extends Document {
  country: string;
  state: string;
  city: string;
  slug: string;
  image?: IFileOption;
  sortOrder: number;
  isActive: boolean;
  metadata?: ISeoMetadata;
  createdAt: Date;
  updatedAt: Date;
}

const CityImageSchema = new Schema<IFileOption>(
  {
    id: { type: String, required: [true, "Image ID is required"], trim: true },
    publickey: { type: String, required: [true, "Image publickey is required"], trim: true },
  },
  { _id: false }
);

const CityMetadataSchema = new Schema<ISeoMetadata>(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    keywords: [{ type: String, trim: true }],
  },
  { _id: false }
);

const CitySchema = new Schema<ICityDocument>(
  {
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      maxlength: [100, "Country cannot exceed 100 characters"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      maxlength: [100, "State cannot exceed 100 characters"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      maxlength: [100, "City cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    image: {
      type: CityImageSchema,
      default: undefined,
    },
    sortOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    metadata: {
      type: CityMetadataSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for uniqueness of country + state + city (case-insensitive)
CitySchema.index(
  { country: 1, state: 1, city: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

export const City: Model<ICityDocument> =
  (mongoose.models.City as Model<ICityDocument>) ||
  mongoose.model<ICityDocument>("City", CitySchema);

export default City;
