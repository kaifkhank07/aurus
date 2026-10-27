import mongoose, { Schema, Document, Model } from "mongoose";
import { IFileOption } from "@/types/general.types";

export interface IStoryDocument extends Document {
  name: string;
  profession: string;
  rating: number;
  location: string;
  description: string;
  isActive: boolean;
  isFeatured: boolean;
  image?: IFileOption | null;
  createdAt: Date;
  updatedAt: Date;
}

const StoryImageSchema = new Schema<IFileOption>(
  {
    id: { type: String, required: [true, "Image ID is required"], trim: true },
    publickey: { type: String, required: [true, "Image publickey is required"], trim: true },
  },
  { _id: false }
);

const StorySchema = new Schema<IStoryDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    profession: {
      type: String,
      required: [true, "Profession is required"],
      trim: true,
      maxlength: [100, "Profession cannot exceed 100 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    image: {
      type: StoryImageSchema,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound and single indexes
StorySchema.index({ createdAt: -1 });
StorySchema.index({ isFeatured: 1, isActive: 1 });

export const Story: Model<IStoryDocument> =
  (mongoose.models.Story as Model<IStoryDocument>) ||
  mongoose.model<IStoryDocument>("Story", StorySchema);

export default Story;
