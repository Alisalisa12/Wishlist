import mongoose from 'mongoose';

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

export default mongoose.model('Wishlist', WishlistSchema);