import mongoose, { Schema, Document, Model } from "mongoose";
import { BookedVisitStatus, BOOKED_VISIT_STATUSES } from "@/types/booked-visit.types";

export interface IBookedVisitDocument extends Document {
  name: string;
  number: string;
  email?: string | null;
  hostelCity: string;
  collegeName: string;
  wantToVisit: Date;
  status: BookedVisitStatus;
  createdAt: Date;
  updatedAt: Date;
}

const BookedVisitSchema = new Schema<IBookedVisitDocument>(
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
    collegeName: {
      type: String,
      required: [true, "College name is required"],
      trim: true,
      maxlength: [200, "College name cannot exceed 200 characters"],
    },
    wantToVisit: {
      type: Date,
      required: [true, "Visit date is required"],
      index: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: BOOKED_VISIT_STATUSES,
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

// Indexes for query performance
BookedVisitSchema.index({ createdAt: -1 });
BookedVisitSchema.index({ status: 1, createdAt: -1 });
BookedVisitSchema.index({ hostelCity: 1, wantToVisit: 1 });

if (process.env.NODE_ENV !== "production" && mongoose.models.BookedVisit) {
  mongoose.deleteModel("BookedVisit");
}

export const BookedVisit: Model<IBookedVisitDocument> =
  (mongoose.models.BookedVisit as Model<IBookedVisitDocument>) ||
  mongoose.model<IBookedVisitDocument>("BookedVisit", BookedVisitSchema);

export default BookedVisit;
