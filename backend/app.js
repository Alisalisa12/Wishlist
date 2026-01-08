import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import {
  registerValidation,
  loginValidation,
  wishlistCreateValidation,
  wishCreateValidation,
  userUpdateValidation
} from "./validations.js";

import * as UserController from "./controllers/UserController.js";
import * as WishlistController from "./controllers/WishlistController.js";
import * as WishController from "./controllers/WishController.js";
import * as ArticleController from "./controllers/ArticleController.js";
import * as FriendController from "./controllers/FriendController.js";

import checkAuth from "./utils/checkAuth.js";

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

//Авторизация
app.post("/auth/login", loginValidation, UserController.login);
//Регистрация
app.post("/auth/register", registerValidation, UserController.register);
//Получение данных о текущем пользователе
app.get("/auth/me", checkAuth, UserController.getMe);
// Обновление профиля
app.patch("/auth/me", checkAuth, userUpdateValidation, UserController.update);
// Удаление аккаунта
app.delete("/auth/me", checkAuth, UserController.removeAccount);

// Поиск среди пользователей
app.get("/users/search", checkAuth, FriendController.searchUsers);
// Поиск среди друзей
app.get("/friends/search", checkAuth, FriendController.searchFriends);
// Получение списка друзей
app.get("/friends", checkAuth, FriendController.getFriendsList);
// Получение входящих заявок
app.get("/friends/requests", checkAuth, FriendController.getIncomingFriendRequests);
// Отправка запроса в друзья
app.post("/friends/request/:friendId", checkAuth, FriendController.sendFriendRequest);
// Принятие запроса
app.post("/friends/accept/:friendId", checkAuth, FriendController.acceptFriendRequest);
// Отклонение запроса
app.post("/friends/decline/:friendId", checkAuth, FriendController.declineFriendRequest);
// Удаление из друзей
app.delete("/friends/:friendId", checkAuth, FriendController.removeFriend);
// Просмотр профиля друга и его вишлистов
app.get("/friends/:friendId", checkAuth, FriendController.getFriendProfile);

//Создание вишлиста
app.post(
  "/wishlists",
  checkAuth,
  wishlistCreateValidation,
  WishlistController.create
);
// Просмотр всех своих вишлистов
app.get("/wishlists/me", checkAuth, WishlistController.getMyWishlists);
//Получение списка всех вишлистов пользователя
app.get("/wishlists", WishlistController.getAll);
app.get("/profiles/:userId/wishlists", checkAuth, WishlistController.getAllWishlists);
// Получение одного вишлиста
app.get("/wishlists/:id", checkAuth, WishlistController.getOne);
// Удаление вишлиста
app.delete("/wishlists/:id", checkAuth, WishlistController.remove);
// Обновление вишлиста
app.patch("/wishlists/:id", checkAuth, wishlistCreateValidation, WishlistController.update);

// Создание желания в конкретном вишлисте
app.post(
  "/wishlists/:wishlistId/wishes",
  checkAuth,
  wishCreateValidation,
  WishController.create
);
// Получить мои брони
app.get("/wishes/my-reservations", checkAuth, WishController.getMyReservations);
// // Получение всех желаний конкретного вишлиста
// app.get("/wishlists/:wishlistId/wishes",checkAuth, WishController.getAll);
// Получение информации об одном желании
app.get("/wishes/:id",checkAuth, WishController.getOne);
// Удаление желания
app.delete("/wishes/:id", checkAuth, WishController.remove);
// Обновление желания
app.patch("/wishes/:id", checkAuth, wishCreateValidation, WishController.update);
// Забронировать желание
app.post("/wishes/:id/reserve", checkAuth, WishController.reserve);
// Снять бронь
app.delete("/wishes/:id/reserve", checkAuth, WishController.unreserve);

// Получить мои брони (старый маршрут)
app.get("/me/reservations", checkAuth, WishController.getMyReservations);

// Получение всех статей
app.get("/articles", ArticleController.getAllArticles);
// Получение одной статьи
app.get("/articles/:id", ArticleController.getOneArticle);


export default app;