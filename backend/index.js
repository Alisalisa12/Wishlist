import express from "express";
import mongoose from "mongoose";
import {
  registerValidation,
  loginValidation,
  wishlistCreateValidation,
} from "./validations.js";

import * as UserController from "./controllers/UserController.js";
import * as WishlistController from "./controllers/WishlistController.js";
import Wishlist from "./models/Wishlist.js";
import checkAuth from "./utils/checkAuth.js";
import cors from "cors";

mongoose
  .connect(
    "mongodb+srv://admin:Z0rla03kFeEeVRtR@cluster0.fqgrana.mongodb.net/wishlist?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("DB ok"))
  .catch(() => console.log("DB error", err));

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());

app.post("/auth/login", UserController.login);
app.post("/auth/register", registerValidation, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post(
  "/wishlists",
  checkAuth,
  wishlistCreateValidation,
  WishlistController.create
);
app.get("/wishlists", WishlistController.getAll);
app.get("/wishlists/:id", WishlistController.getOne);
app.delete("/wishlists/:id", checkAuth, WishlistController.remove);
app.patch("/wishlists/:id", checkAuth, WishlistController.update);

app.listen(7777, (err) => {
  if (err) {
    return console.log("err");
  }

  console.log("Server OK");
});
