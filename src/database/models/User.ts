import mongoose, { Document, Schema, model } from "mongoose";

export interface IProduct {
  _id?: mongoose.Types.ObjectId;
  productName: string;
  color: string;
  category: string;
  price: string;
}
export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  products?: IProduct[];
  addProductCount?:number;
  updateProductCount?:number;

}

const userSchema = new Schema<IUser>({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  products: [
    {
      _id: { type: Schema.Types.ObjectId, auto: true }, // Product ID
      productName: String,
      color: String,
      category: String,
      price: String,
    },
  ],
  addProductCount:{type:Number, default:0},
  updateProductCount:{type:Number, default:0}
});

const User = model<IUser>("User", userSchema);

export default User;
