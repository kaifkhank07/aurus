import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInstituteDocument extends Document {
  name: string;
  slug: string;
  isActive: boolean;
  city: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InstituteSchema = new Schema<IInstituteDocument>(
  {
    name: {
      type: String,
      required: [true, "Institute name is required"],
      trim: true,
      maxlength: [200, "Institute name cannot exceed 200 characters"],
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

// Compound index to prevent duplicate Institute names within the same City
InstituteSchema.index(
  { city: 1, name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

export const Institute: Model<IInstituteDocument> =
  (mongoose.models.Institute as Model<IInstituteDocument>) ||
  mongoose.model<IInstituteDocument>("Institute", InstituteSchema);

export default Institute;
