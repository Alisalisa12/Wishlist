import mongoose from 'mongoose';
import WishModel from "./Wish.js";

const WishlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    eventDate: {
      type: Date,
      default: null,
    },
    visibility: {
      type: String,
      enum: ["public", "friends", "private", "link"],
      default: "public",
    },
    linkToken: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

WishlistSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    await WishModel.deleteMany({ wishlist: this._id });
    next();
  } catch (err) {
    next(err);
  }
});


export default mongoose.model('Wishlist', WishlistSchema);