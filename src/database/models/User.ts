import mongoose, { Document, Schema, model } from "mongoose";

export interface IURL {
  _id?: mongoose.Types.ObjectId;
  productName: string;
  color: string;
  category: string;
  price: string;
}
export interface IUser extends Document {
  name?: string;
  email: string;
  password: string;
  urls?: IURL[];
}

const userSchema = new Schema<IUser>(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: String,
    urls: [
      {
        _id: { type: Schema.Types.ObjectId, auto: true }, // Product ID
        productName: String,
        color: String,
        category: String,
        price: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>("User", userSchema);

export default User;
