import mongoose from "mongoose";
import WishlistModel from "./Wishlist.js";
import WishModel from "./Wish.js";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: "http://localhost:3000/images/friendAvatar.jpg",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        
      },
    ],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const userId = this._id;

    const wishlists = await WishlistModel.find({ user: userId });
    for (const wishlist of wishlists) {
      await WishModel.deleteMany({ wishlist: wishlist._id });
    }

    await WishlistModel.deleteMany({ user: userId });

    next();
  }
);

export default mongoose.model("User", UserSchema);
