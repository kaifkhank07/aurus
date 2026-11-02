import mongoose, { Schema, Document, Model } from "mongoose";
import { EnquiryStatus, ENQUIRY_STATUSES } from "@/types/enquiry.types";

export interface IEnquiryDocument extends Document {
  name: string;
  number: string;
  location: string;
  iam: string;
  message: string;
  status: EnquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiryDocument>(
  {
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
      required: [true, "Location is required"],
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    iam: {
      type: String,
      required: [true, "Profile / I am selection is required"],
      trim: true,
      maxlength: [100, "I am selection cannot exceed 100 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ENQUIRY_STATUSES,
        message: "Status must be either 'new', 'read', or 'complete'",
      },
      default: "new",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
EnquirySchema.index({ createdAt: -1 });
EnquirySchema.index({ status: 1, createdAt: -1 });

if (process.env.NODE_ENV !== "production" && mongoose.models.Enquiry) {
  mongoose.deleteModel("Enquiry");
}

export const Enquiry: Model<IEnquiryDocument> =
  (mongoose.models.Enquiry as Model<IEnquiryDocument>) ||
  mongoose.model<IEnquiryDocument>("Enquiry", EnquirySchema);

export default Enquiry;
