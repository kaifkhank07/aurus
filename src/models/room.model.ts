import mongoose, { Schema, Document, Model } from "mongoose";
import { IFileOption } from "@/types/general.types";

export interface IRoomDocument extends Document {
  name: string;
  image?: IFileOption;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoomImageSchema = new Schema<IFileOption>(
  {
    url: { type: String, required: [true, "Image URL is required"], trim: true },
    publickey: { type: String, required: [true, "Image publickey is required"], trim: true },
  },
  { _id: false }
);

const RoomSchema = new Schema<IRoomDocument>(
  {
    name: {
      type: String,
      required: [true, "Room name is required"],
      trim: true,
      maxlength: [100, "Room name cannot exceed 100 characters"],
    },
    image: {
      type: RoomImageSchema,
      default: undefined,
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

// Unique index for room name (case-insensitive)
RoomSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

if (process.env.NODE_ENV !== "production" && mongoose.models.Room) {
  mongoose.deleteModel("Room");
}

export const Room: Model<IRoomDocument> =
  (mongoose.models.Room as Model<IRoomDocument>) ||
  mongoose.model<IRoomDocument>("Room", RoomSchema);

export default Room;

