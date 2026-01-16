import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
	  minlength: 6
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    role: {
      type: String,
      enum: ["user", "admin", "provider"],
      default: "user",
    },

    phoneno: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null values
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
