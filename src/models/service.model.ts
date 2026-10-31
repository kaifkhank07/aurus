import mongoose, { Schema, Document, Model } from "mongoose";
import { IFileOption } from "@/types/general.types";

export interface IServiceDocument extends Document {
  name: string;
  image?: IFileOption;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceImageSchema = new Schema<IFileOption>(
  {
    url: { type: String, required: [true, "Image URL is required"], trim: true },
    publickey: { type: String, required: [true, "Image publickey is required"], trim: true },
  },
  { _id: false }
);

const ServiceSchema = new Schema<IServiceDocument>(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      maxlength: [100, "Service name cannot exceed 100 characters"],
    },
    image: {
      type: ServiceImageSchema,
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

// Unique index for service name (case-insensitive)
ServiceSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

if (process.env.NODE_ENV !== "production" && mongoose.models.Service) {
  mongoose.deleteModel("Service");
}

export const Service: Model<IServiceDocument> =
  (mongoose.models.Service as Model<IServiceDocument>) ||
  mongoose.model<IServiceDocument>("Service", ServiceSchema);

export default Service;

