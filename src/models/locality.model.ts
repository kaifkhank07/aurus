import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILocalityDocument extends Document {
  name: string;
  slug: string;
  isActive: boolean;
  city: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LocalitySchema = new Schema<ILocalityDocument>(
  {
    name: {
      type: String,
      required: [true, "Locality name is required"],
      trim: true,
      maxlength: [150, "Locality name cannot exceed 150 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    city: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: [true, "City reference is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate Locality names within the same City
LocalitySchema.index(
  { city: 1, name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

export const Locality: Model<ILocalityDocument> =
  (mongoose.models.Locality as Model<ILocalityDocument>) ||
  mongoose.model<ILocalityDocument>("Locality", LocalitySchema);

export default Locality;
