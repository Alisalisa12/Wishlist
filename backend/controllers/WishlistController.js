import WishlistModel from "../models/Wishlist.js";
import UserModel from "../models/User.js";
import WishModel from "../models/Wish.js"
import { v4 as uuidv4 } from "uuid";

export const create = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Пользователь не найден или не авторизован" });
    }
    const linkToken = req.body.visibility === "link" ? uuidv4() : undefined;
    const doc = new WishlistModel({
      title: req.body.title,
      eventDate: req.body.eventDate,
      visibility: req.body.visibility,
      user: req.userId,
      linkToken
    });

    const wishlist = await doc.save();

    res.json(wishlist);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать вишлист",
    });
  }
};
export const getAll = async (req, res) => {
  try {
    const wishlists = await WishlistModel.find().populate("user").exec();
    res.json(wishlists);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить вишлисты",
    });
  }
};
export const getMyWishlists = async (req, res) => {
  try {
    const userId = req.userId;
    const wishlists = await WishlistModel.find({ user: userId });

    res.json(wishlists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось получить ваши вишлисты" });
  }
};
export const getAllWishlists = async (req, res) => {
  try {
    const profileId = req.params.userId;          
    const linkToken = req.query.token || null;    
    const profileUser = await UserModel.findById(profileId);
    if (!profileUser) return res.status(404).json({ message: "Пользователь не найден" });

    const currentUser = await UserModel.findById(req.userId);
    const isFriend = currentUser.friends.includes(profileId);
    const isOwner = req.userId === profileId;

    const allWishlists = await WishlistModel.find({ user: profileId });

    // Фильтруем видимые вишлисты
    const visibleWishlists = allWishlists.filter(w => {
      if (w.visibility === "public") return true;             
      if (w.visibility === "friends" && isFriend) return true; 
      if (w.visibility === "private" && isOwner) return true;  
      if (w.visibility === "link" && linkToken === w.linkToken) return true; 
      return false; // все остальные скрыты
    });

    res.json({
      profile: {
        _id: profileUser._id,
        username: profileUser.username,
        fullName: profileUser.fullName,
        avatarUrl: profileUser.avatarUrl
      },
      wishlists: visibleWishlists
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось получить вишлисты профиля" });
  }
};
export const getOne = async (req, res) => {
  try {
    const wishlist = await WishlistModel.findById(req.params.id);
    if (!wishlist) return res.status(404).json({ message: "Вишлист не найден" });

    const currentUser = await UserModel.findById(req.userId);
    const isOwner = wishlist.user.toString() === req.userId;
    const isFriend = currentUser?.friends.includes(wishlist.user.toString());
    const linkToken = req.query.token || null;

    // Проверка доступа к вишлисту
    const hasAccess =
      isOwner ||
      wishlist.visibility === "public" ||
      (wishlist.visibility === "friends" && isFriend) ||
      (wishlist.visibility === "link" && linkToken === wishlist.linkToken);

    if (!hasAccess) return res.status(403).json({ message: "Нет доступа к вишлисту" });

    // Получаем желания
    const wishes = await WishModel.find({ wishlist: wishlist._id });

    res.json({
      wishlist,
      wishes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось получить вишлист" });
  }
};

// Просмотр вишлиста по ссылке
export const getWishlistByLink = async (req, res) => {
  try {
    const token = req.params.token;
    const wishlist = await WishlistModel.findOne({ linkToken: token });
    if (!wishlist) return res.status(404).json({ message: "Вишлист не найден" });

    res.json(wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось получить вишлист по ссылке" });
  }
};

export const remove = async (req, res) => {
  try {
    const wishlist = await WishlistModel.findById(req.params.id);
    if (!wishlist) return res.status(404).json({ message: "Вишлист не найден" });

    if (wishlist.user.toString() !== req.userId) return res.status(403).json({ message: "Нет доступа" });

    await wishlist.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось удалить вишлист" });
  }
};

export const update = async (req, res) => {
  try {
    const wishlist = await WishlistModel.findById(req.params.id);
    if (!wishlist) return res.status(404).json({ message: "Вишлист не найден" });

    if (wishlist.user.toString() !== req.userId) return res.status(403).json({ message: "Нет доступа" });

    wishlist.title = req.body.title || wishlist.title;
    wishlist.eventDate = req.body.eventDate || wishlist.eventDate;
    wishlist.visibility = req.body.visibility || wishlist.visibility;
    if (wishlist.visibility === "link" && !wishlist.linkToken) wishlist.linkToken = uuidv4();

    await wishlist.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось обновить вишлист" });
  }
};
