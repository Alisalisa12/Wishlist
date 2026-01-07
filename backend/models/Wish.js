import mongoose from "mongoose";

const WishSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      image: { type: String, default: "" },
    },
    priceCategory: {
      type: String,
      enum: ["до 1000", "1000-3000", "3000-10000", "10000+"],
      required: true,
    },
    wishlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wishlist",
      required: true,
    },
    reserved: {
      type: Boolean,
      default: false,
    },

    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Wishes", WishSchema);
