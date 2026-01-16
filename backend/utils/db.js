import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

const connectDB = async () => {
  try {
      const db=  await mongoose.connect(process.env.MANGODB_URI);
	  console.log(db.connection.host());
    
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
