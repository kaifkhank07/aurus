import mongoose, { Schema, Document, Model } from "mongoose";
import {
  EnquiryStatus,
  ENQUIRY_STATUSES,
  EnquiryGender,
  ENQUIRY_GENDERS,
} from "@/types/enquiry.types";

export interface IEnquiryDocument extends Document {
  name: string;
  number: string;
  email?: string | null;
  hostelCity: string;
  gender: EnquiryGender;
  message?: string | null;
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
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [255, "Email cannot exceed 255 characters"],
      default: null,
    },
    hostelCity: {
      type: String,
      required: [true, "Hostel city is required"],
      trim: true,
      maxlength: [100, "Hostel city cannot exceed 100 characters"],
      index: true,
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: ENQUIRY_GENDERS,
        message: "Gender must be either 'boys' or 'girls'",
      },
      index: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: [2000, "Message cannot exceed 2000 characters"],
      default: null,
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
EnquirySchema.index({ hostelCity: 1, createdAt: -1 });

if (process.env.NODE_ENV !== "production" && mongoose.models.Enquiry) {
  mongoose.deleteModel("Enquiry");
}

export const Enquiry: Model<IEnquiryDocument> =
  (mongoose.models.Enquiry as Model<IEnquiryDocument>) ||
  mongoose.model<IEnquiryDocument>("Enquiry", EnquirySchema);

export default Enquiry;
