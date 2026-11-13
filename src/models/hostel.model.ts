import mongoose, { Schema, Document, Model } from "mongoose";
import { IFileOption, ISeoMetadata } from "@/types/general.types";
import { TENANT_TYPES, TenantType } from "@/types/hostel.types";

// Ensure referenced schemas are registered in Mongoose for population
import "./city.model";
import "./locality.model";
import "./amenity.model";
import "./occupancy.model";
import "./room.model";
import "./service.model";
import "./institute.model";
import "./rent-frequency.model";

export interface IHostelRating {
  star: number;
  userCount: number;
}

export interface IHostelRent {
  amount: number;
  frequency: mongoose.Types.ObjectId;
}

export interface IHostelDocument extends Document {
  title: string;
  slug: string;
  subtitle?: string;
  tenantType: TenantType;
  isActive: boolean;
  frontImage: IFileOption;
  galleryImages: IFileOption[];
  rent: IHostelRent;
  amenities: mongoose.Types.ObjectId[];
  occupancy: mongoose.Types.ObjectId[];
  room: mongoose.Types.ObjectId[];
  services: mongoose.Types.ObjectId[];
  institute: mongoose.Types.ObjectId[];
  rating: IHostelRating;
  description: string;
  location: {
    city: mongoose.Types.ObjectId;
    locality: mongoose.Types.ObjectId;
    address: string;
    mapUrl?: string;
    longitude?: number;
    latitude?: number;
  };
  brochure?: IFileOption;
  metadata?: ISeoMetadata;
  createdAt: Date;
  updatedAt: Date;
}

const HostelFileSchema = new Schema<IFileOption>(
  {
    url: { type: String, required: [true, "File/Image URL is required"], trim: true },
    publickey: { type: String, required: [true, "File/Image publickey is required"], trim: true },
  },
  { _id: false }
);

const HostelMetadataSchema = new Schema<ISeoMetadata>(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    keywords: [{ type: String, trim: true }],
  },
  { _id: false }
);

const HostelRatingSchema = new Schema<IHostelRating>(
  {
    star: {
      type: Number,
      default: 0,
      min: [0, "Rating star must be >= 0"],
      max: [5, "Rating star cannot exceed 5"],
    },
    userCount: {
      type: Number,
      default: 0,
      min: [0, "User count must be >= 0"],
    },
  },
  { _id: false }
);

const HostelRentSchema = new Schema<IHostelRent>(
  {
    amount: {
      type: Number,
      required: [true, "Rent amount is required"],
      min: [0, "Rent amount must be a non-negative number"],
      index: true,
    },
    frequency: {
      type: Schema.Types.ObjectId,
      ref: "RentFrequency",
      required: [true, "Rent frequency reference is required"],
      index: true,
    },
  },
  { _id: false }
);

const HostelLocationSchema = new Schema(
  {
    city: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: [true, "City reference is required"],
      index: true,
    },
    locality: {
      type: Schema.Types.ObjectId,
      ref: "Locality",
      required: [true, "Locality reference is required"],
      index: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    mapUrl: {
      type: String,
      trim: true,
    },
    longitude: {
      type: Number,
      min: [-180, "Longitude must be >= -180"],
      max: [180, "Longitude must be <= 180"],
    },
    latitude: {
      type: Number,
      min: [-90, "Latitude must be >= -90"],
      max: [90, "Latitude must be <= 90"],
    },
  },
  { _id: false }
);

const HostelSchema = new Schema<IHostelDocument>(
  {
    title: {
      type: String,
      required: [true, "Hostel title is required"],
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
    tenantType: {
      type: String,
      enum: {
        values: TENANT_TYPES,
        message: "Tenant type must be 'girls', 'boys', or 'co-ed'",
      },
      required: [true, "Tenant type is required"],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    frontImage: {
      type: HostelFileSchema,
      required: [true, "Front image is required"],
    },
    galleryImages: {
      type: [HostelFileSchema],
      default: [],
    },
    rent: {
      type: HostelRentSchema,
      required: [true, "Rent details (amount and frequency) are required"],
    },
    amenities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Amenity",
        index: true,
      },
    ],
    occupancy: [
      {
        type: Schema.Types.ObjectId,
        ref: "Occupancy",
        index: true,
      },
    ],
    room: [
      {
        type: Schema.Types.ObjectId,
        ref: "Room",
        index: true,
      },
    ],
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service",
        index: true,
      },
    ],
    institute: [
      {
        type: Schema.Types.ObjectId,
        ref: "Institute",
        index: true,
      },
    ],
    rating: {
      type: HostelRatingSchema,
      default: () => ({ star: 0, userCount: 0 }),
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    location: {
      type: HostelLocationSchema,
      required: [true, "Location details are required"],
    },
    brochure: {
      type: HostelFileSchema,
      default: undefined,
    },
    metadata: {
      type: HostelMetadataSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
HostelSchema.index({ "location.city": 1, "location.locality": 1 });
HostelSchema.index({ "rent.amount": 1, "rent.frequency": 1 });

if (process.env.NODE_ENV !== "production" && mongoose.models.Hostel) {
  mongoose.deleteModel("Hostel");
}

export const Hostel: Model<IHostelDocument> =
  (mongoose.models.Hostel as Model<IHostelDocument>) ||
  mongoose.model<IHostelDocument>("Hostel", HostelSchema);

export default Hostel;
