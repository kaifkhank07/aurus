import mongoose, { Schema, Document, Model } from "mongoose";
import { IFileOption, ISeoMetadata } from "@/types/general.types";
import { TENANT_TYPES, TenantType, RENT_FREQUENCIES, RentFrequency } from "@/types/hostel.types";

export interface IHostelDocument extends Document {
  title: string;
  slug: string;
  subtitle?: string;
  tenantType: TenantType[];
  isActive: boolean;
  frontImage: IFileOption;
  galleryImages: IFileOption[];
  firstImage?: IFileOption;
  secondImage?: IFileOption;
  rent: number;
  rentFrequency: RentFrequency;
  amenities: mongoose.Types.ObjectId[];
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
    id: { type: String, required: [true, "File/Image ID is required"], trim: true },
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
      type: [String],
      enum: {
        values: TENANT_TYPES,
        message: "Invalid tenant type provided",
      },
      required: [true, "At least one tenant type is required"],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "Tenant type array cannot be empty",
      },
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
    firstImage: {
      type: HostelFileSchema,
      default: undefined,
    },
    secondImage: {
      type: HostelFileSchema,
      default: undefined,
    },
    rent: {
      type: Number,
      required: [true, "Rent amount is required"],
      min: [0, "Rent must be a non-negative number"],
      index: true,
    },
    rentFrequency: {
      type: String,
      enum: {
        values: RENT_FREQUENCIES,
        message: "Rent frequency must be 'monthly' or 'yearly'",
      },
      required: [true, "Rent frequency is required"],
      index: true,
    },
    amenities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Amenity",
        index: true,
      },
    ],
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
HostelSchema.index({ rent: 1, rentFrequency: 1 });
HostelSchema.index({ tenantType: 1 });

export const Hostel: Model<IHostelDocument> =
  (mongoose.models.Hostel as Model<IHostelDocument>) ||
  mongoose.model<IHostelDocument>("Hostel", HostelSchema);

export default Hostel;
