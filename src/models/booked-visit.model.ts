import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBookedVisitDocument extends Document {
  name: string;
  number: string;
  location: string;
  iam: string;
  preferredDate: Date;
  preferredTime: string;
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
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
      index: true,
    },
    iam: {
      type: String,
      required: [true, "I am selection is required"],
      trim: true,
      maxlength: [100, "I am selection cannot exceed 100 characters"],
    },
    preferredDate: {
      type: Date,
      required: [true, "Preferred date is required"],
      index: true,
    },
    preferredTime: {
      type: String,
      required: [true, "Preferred time is required"],
      trim: true,
      maxlength: [30, "Preferred time cannot exceed 30 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query performance
BookedVisitSchema.index({ createdAt: -1 });
BookedVisitSchema.index({ location: 1, preferredDate: 1 });

export const BookedVisit: Model<IBookedVisitDocument> =
  (mongoose.models.BookedVisit as Model<IBookedVisitDocument>) ||
  mongoose.model<IBookedVisitDocument>("BookedVisit", BookedVisitSchema);

export default BookedVisit;
