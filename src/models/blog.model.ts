import mongoose, { Schema, Document, Model } from "mongoose";
import { IFileOption, ISeoMetadata } from "@/types/general.types";
import { BLOG_CATEGORIES, BlogCategory } from "@/types/blog.types";

export interface IBlogDocument extends Document {
  title: string;
  slug: string;
  subtitle?: string;
  image: IFileOption;
  category: BlogCategory;
  readDuration: number;
  isActive: boolean;
  description: string;
  metadata?: ISeoMetadata;
  createdAt: Date;
  updatedAt: Date;
}

const BlogImageSchema = new Schema<IFileOption>(
  {
    url: { type: String, required: [true, "Image URL is required"], trim: true },
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
    category: {
      type: String,
      enum: {
        values: BLOG_CATEGORIES,
        message: "Invalid blog category: `{VALUE}`. Allowed categories: " + BLOG_CATEGORIES.join(", "),
      },
      required: [true, "Blog category is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
    readDuration: {
      type: Number,
      required: [true, "Read duration is required"],
      min: [1, "Read duration must be at least 1 minute"],
      max: [180, "Read duration cannot exceed 180 minutes"],
      default: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
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
BlogSchema.index({ isActive: 1, createdAt: -1 });
BlogSchema.index({ isActive: 1, category: 1 });

if (process.env.NODE_ENV !== "production" && mongoose.models.Blog) {
  mongoose.deleteModel("Blog");
}

export const Blog: Model<IBlogDocument> =
  (mongoose.models.Blog as Model<IBlogDocument>) ||
  mongoose.model<IBlogDocument>("Blog", BlogSchema);

export default Blog;
