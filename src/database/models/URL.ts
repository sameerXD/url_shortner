import mongoose, { Schema, model } from "mongoose";

interface IUrl {
  originalUrl: string;
  hash: string;
  createdAt: Date;
  clicks: number;
  userId: any;
  maxUses?: number;
  remainingUses?: number;
}

const urlSchema = new Schema<IUrl>({
  originalUrl: { type: String, required: true },
  hash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 },
  maxUses: { type: Number, default: null },
  remainingUses: { type: Number, default: null },
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
});

const Url = model<IUrl>("Url", urlSchema);

export default Url;
