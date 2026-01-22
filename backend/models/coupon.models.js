import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    expirationDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    maxUses: {
      type: Number,
      default: 1,
    },

    usedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


const Coupon=mongoose.model("Coupon",couponSchema)

export default Coupon ;