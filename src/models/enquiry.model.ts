import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEnquiryDocument extends Document {
  type: "query" | "request";
  name: string;
  number: string;
  location?: string | null;
  iam?: string | null;
  message?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiryDocument>(
  {
    type: {
      type: String,
      enum: {
        values: ["query", "request"],
        message: "Enquiry type must be either 'query' or 'request'",
      },
      required: [true, "Enquiry type is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    number: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
      default: null,
    },
    iam: {
      type: String,
      trim: true,
      maxlength: [100, "I am selection cannot exceed 100 characters"],
      default: null,
    },
    message: {
      type: String,
      trim: true,
      maxlength: [2000, "Message cannot exceed 2000 characters"],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
EnquirySchema.index({ createdAt: -1 });
EnquirySchema.index({ type: 1, createdAt: -1 });

export const Enquiry: Model<IEnquiryDocument> =
  (mongoose.models.Enquiry as Model<IEnquiryDocument>) ||
  mongoose.model<IEnquiryDocument>("Enquiry", EnquirySchema);

export default Enquiry;
