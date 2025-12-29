import express from "express";
import mongoose from "mongoose";
import {
  registerValidation,
  loginValidation,
  wishlistCreateValidation,
  wishCreateValidation,
} from "./validations.js";

import * as UserController from "./controllers/UserController.js";
import * as WishlistController from "./controllers/WishlistController.js";
import * as WishController from "./controllers/WishController.js";

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

//Авторизация
app.post("/auth/login", UserController.login);
//Регистрация
app.post("/auth/register", registerValidation, UserController.register);
//Получение данных о текущем пользователе
app.get("/auth/me", checkAuth, UserController.getMe);
// Обновление профиля
app.patch("/auth/me", checkAuth, UserController.update);
// Удаление аккаунта
app.delete("/auth/me", checkAuth, UserController.removeAccount);

//Создание вишлиста
app.post(
  "/wishlists",
  checkAuth,
  wishlistCreateValidation,
  WishlistController.create
);
//Получение списка всех вишлистов
app.get("/wishlists", WishlistController.getAll);
// Получение одного вишлиста
app.get("/wishlists/:id", WishlistController.getOne);
// Удаление вишлиста
app.delete("/wishlists/:id", checkAuth, WishlistController.remove);
// Обновление вишлиста
app.patch("/wishlists/:id", checkAuth, WishlistController.update);

// Создание желания в конкретном вишлисте
app.post(
  "/wishlists/:wishlistId/wishes",
  checkAuth,
  wishCreateValidation,
  WishController.create
);
// Получение всех желаний конкретного вишлиста
app.get("/wishlists/:wishlistId/wishes", WishController.getAll);
// Получение информации об одном желании
app.get("/wishes/:id", WishController.getOne);
// Удаление желания
app.delete("/wishes/:id", checkAuth, WishController.remove);
// Обновление желания
app.patch("/wishes/:id", checkAuth, WishController.update);
// Забронировать желание
app.post("/wishes/:id/reserve", checkAuth, WishController.reserve);
// Снять бронь
app.delete("/wishes/:id/reserve", checkAuth, WishController.unreserve);
// Получить мои брони
app.get("/me/reservations", checkAuth, WishController.getMyReservations);

app.listen(7777, (err) => {
  if (err) {
    return console.log("err");
  }

  console.log("Server OK");
});
