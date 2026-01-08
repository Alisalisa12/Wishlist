import WishModel from "../models/Wish.js";
import WishlistModel from "../models/Wishlist.js";
import UserModel from "../models/User.js";

export const create = async (req, res) => {
  try {
    const { wishlistId } = req.params;

    const wishlist = await WishlistModel.findById(wishlistId);
    if (!wishlist) {
      return res.status(404).json({ message: "Вишлист не найден" });
    }

    if (wishlist.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Нет доступа для добавления желания" });
    }

    const doc = new WishModel({
      title: req.body.title,
      link: req.body.link || null,
      image: req.body.image?.trim() || "",
      priceCategory: req.body.priceCategory,
      wishlist: wishlistId,
    });

    const wish = await doc.save();
    res.json(wish);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось создать желание" });
  }
};

export const getOne = async (req, res) => {
  try {
    const linkToken = req.query.token || null;

    const wish = await WishModel.findById(req.params.id).populate("wishlist");
    if (!wish) {
      return res.status(404).json({ message: "Желание не найдено" });
    }

    const wishlist = wish.wishlist;
    const currentUser = await UserModel.findById(req.userId);
    const isOwner = wishlist.user.toString() === req.userId;
    const isFriend = currentUser?.friends.includes(wishlist.user.toString());

    const hasAccess =
      // isOwner ||
      wishlist.user.toString() === req.userId ||
      wishlist.visibility === "public" ||
      (wishlist.visibility === "friends" && isFriend) ||
      (wishlist.visibility === "link" && linkToken === wishlist.linkToken);

    if (!hasAccess) {
      return res.status(403).json({ message: "Нет доступа к желанию" });
    }

    res.json(wish);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось получить желание" });
  }
};

export const remove = async (req, res) => {
  try {
    const wish = await WishModel.findById(req.params.id);
    if (!wish) {
      return res.status(404).json({ message: "Желание не найдено" });
    }

    const wishlist = await WishlistModel.findById(wish.wishlist);
    if (!wishlist) {
      return res.status(404).json({ message: "Вишлист не найден" });
    }

    if (wishlist.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Нет доступа для удаления желания" });
    }

    await wish.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось удалить желание" });
  }
};

export const update = async (req, res) => {
  try {
    const wish = await WishModel.findById(req.params.id);
    if (!wish) {
      return res.status(404).json({ message: "Желание не найдено" });
    }

    const wishlist = await WishlistModel.findById(wish.wishlist);
    if (!wishlist) {
      return res.status(404).json({ message: "Вишлист не найден" });
    }

    if (wishlist.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Нет доступа для редактирования желания" });
    }

    wish.title = req.body.title || wish.title;
    wish.link = req.body.link ?? wish.link; // позволяет установить null
    wish.image = req.body.image || wish.image;
    wish.priceCategory = req.body.priceCategory || wish.priceCategory;

    await wish.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось обновить желание" });
  }
};

export const reserve = async (req, res) => {
  try {
    const wish = await WishModel.findById(req.params.id).populate("wishlist");
    if (!wish) {
      return res.status(404).json({ message: "Желание не найдено" });
    }

    const wishlist = wish.wishlist;
    const currentUser = await UserModel.findById(req.userId);

    const isOwner = wishlist.user.toString() === req.userId;
    const isFriend = currentUser?.friends.includes(wishlist.user.toString());
    const linkToken = req.query.token || null;

    const hasAccess =
      isOwner || // владелец всегда имеет доступ
      wishlist.visibility === "public" ||
      (wishlist.visibility === "friends" && isFriend) ||
      (wishlist.visibility === "link" && linkToken === wishlist.linkToken);

    if (!hasAccess) {
      return res.status(403).json({ message: "Нет доступа к вишлисту" });
    }

    if (isOwner) {
      return res
        .status(403)
        .json({ message: "Нельзя бронировать своё желание" });
    }

    if (wish.reserved) {
      return res.status(400).json({ message: "Желание уже забронировано" });
    }

    wish.reserved = true;
    wish.reservedBy = req.userId;
    await wish.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось забронировать желание" });
  }
};

export const unreserve = async (req, res) => {
  try {
    const wish = await WishModel.findById(req.params.id).populate("wishlist");
    if (!wish) {
      return res.status(404).json({ message: "Желание не найдено" });
    }

    const wishlist = wish.wishlist;
    const currentUser = await UserModel.findById(req.userId);

    const isOwner = wishlist.user.toString() === req.userId;
    const isFriend = currentUser?.friends.includes(wishlist.user.toString());
    const linkToken = req.query.token || null;

    const hasAccess =
      isOwner ||
      wishlist.visibility === "public" ||
      (wishlist.visibility === "friends" && isFriend) ||
      (wishlist.visibility === "link" && linkToken === wishlist.linkToken);

    if (!hasAccess) {
      return res.status(403).json({ message: "Нет доступа к вишлисту" });
    }

    if (!wish.reserved || wish.reservedBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Нет прав снять бронь" });
    }

    wish.reserved = false;
    wish.reservedBy = null;

    await wish.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось снять бронь" });
  }
};

export const getMyReservations = async (req, res) => {
  try {
    const wishes = await WishModel.find({ reservedBy: req.userId });
    res.json(wishes);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        message: "Не удалось получить брони",
        error: err?.message,
        stack: err?.stack,
      });
  }
};
