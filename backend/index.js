import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 7777;
const DB_URL =
  process.env.MONGO_URL ||
  "mongodb+srv://admin:Z0rla03kFeEeVRtR@cluster0.fqgrana.mongodb.net/wishlist";

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("DB ok");

    app.listen(PORT, (err) => {
      if (err) {
        return console.error("Server error:", err);
      }
      console.log(`Server OK on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB error", err);
  });