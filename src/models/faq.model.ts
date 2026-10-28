import mongoose, { Schema, Document, Model } from "mongoose";
import { FAQ_CATEGORIES, FaqCategory } from "@/types/faq.types";

export interface IFaqDocument extends Document {
  question: string;
  answer: string;
  category: FaqCategory;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FaqSchema = new Schema<IFaqDocument>(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
      maxlength: [500, "Question cannot exceed 500 characters"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
      maxlength: [5000, "Answer cannot exceed 5000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: FAQ_CATEGORIES,
        message: "Invalid category: `{VALUE}`. Must be one of the configured categories.",
      },
      lowercase: true,
      trim: true,
      index: true,
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
  },
  {
    timestamps: true,
  }
);

// Compound and search indexes
FaqSchema.index({ category: 1, sortOrder: 1, createdAt: -1 });
FaqSchema.index({ isActive: 1, category: 1 });
FaqSchema.index({ question: "text", answer: "text" });

if (process.env.NODE_ENV !== "production" && mongoose.models.Faq) {
  mongoose.deleteModel("Faq");
}

export const Faq: Model<IFaqDocument> =
  (mongoose.models.Faq as Model<IFaqDocument>) ||
  mongoose.model<IFaqDocument>("Faq", FaqSchema);

export default Faq;

