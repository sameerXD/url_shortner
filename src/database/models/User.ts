import mongoose, { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: String,
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>("User", userSchema);

export default User;
