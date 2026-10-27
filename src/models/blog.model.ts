import mongoose, { Schema, Document, Model } from "mongoose";
import { IFileOption, ISeoMetadata } from "@/types/general.types";

export interface IBlogDocument extends Document {
  title: string;
  slug: string;
  subtitle?: string;
  image: IFileOption;
  tags: string[];
  description: string;
  metadata?: ISeoMetadata;
  createdAt: Date;
  updatedAt: Date;
}

const BlogImageSchema = new Schema<IFileOption>(
  {
    id: { type: String, required: [true, "Image ID is required"], trim: true },
    publickey: { type: String, required: [true, "Image publickey is required"], trim: true },
  },
  { _id: false }
);

const BlogMetadataSchema = new Schema<ISeoMetadata>(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    keywords: [{ type: String, trim: true }],
  },
  { _id: false }
);

const BlogSchema = new Schema<IBlogDocument>(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [300, "Subtitle cannot exceed 300 characters"],
    },
    image: {
      type: BlogImageSchema,
      required: [true, "Blog primary image is required"],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Blog description content is required"],
      trim: true,
    },
    metadata: {
      type: BlogMetadataSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
BlogSchema.index({ createdAt: -1 });

export const Blog: Model<IBlogDocument> =
  (mongoose.models.Blog as Model<IBlogDocument>) ||
  mongoose.model<IBlogDocument>("Blog", BlogSchema);

export default Blog;
