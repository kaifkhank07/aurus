import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRentFrequencyDocument extends Document {
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RentFrequencySchema = new Schema<IRentFrequencyDocument>(
  {
    name: {
      type: String,
      required: [true, "Rent frequency name is required"],
      trim: true,
      maxlength: [100, "Rent frequency name cannot exceed 100 characters"],
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

// Unique index for rent frequency name (case-insensitive)
RentFrequencySchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

if (process.env.NODE_ENV !== "production" && mongoose.models.RentFrequency) {
  mongoose.deleteModel("RentFrequency");
}

export const RentFrequency: Model<IRentFrequencyDocument> =
  (mongoose.models.RentFrequency as Model<IRentFrequencyDocument>) ||
  mongoose.model<IRentFrequencyDocument>("RentFrequency", RentFrequencySchema);

export default RentFrequency;

