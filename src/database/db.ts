import mongoose from 'mongoose';
require("dotenv").config()

const MONGO_URI = process.env.ENVIRONMENT==="container"?process.env.DB_URL_CONTAINER:process.env.DB_URL||'your-mongodb-uri';
console.log(MONGO_URI);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI!);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
