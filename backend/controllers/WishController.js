import WishModel from "../models/Wish.js";
import WishlistModel from "../models/Wishlist.js";

export const create = async (req, res) => {
  try {
    const { wishlistId } = req.params;

    const wishlist = await WishlistModel.findById(wishlistId);
    if (!wishlist) {
      return res.status(404).json({ message: "Вишлист не найден" });
    }
    const doc = new WishModel({
      title: req.body.title,
      link: req.body.link || null,
      image: req.body.image,
      priceCategory: req.body.priceCategory,
      wishlist: req.params.wishlistId,
    });

    const wish = await doc.save();
    res.json(wish);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось создать желание" });
  }
};

export const getAll = async (req, res) => {
  try {
    const { wishlistId } = req.params;
    const wishes = await WishModel.find({ wishlist: wishlistId })
      .populate("wishlist")
      .exec();

    res.json(wishes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось получить желания" });
  }
};

export const getOne = async (req, res) => {
  try {
    const wish = await WishModel.findById(req.params.id).exec();

    if (!wish) {
      return res.status(404).json({
        message: "Желание не найдено",
      });
    }

    res.json(wish);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Не удалось получить желание",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const wish = await WishModel.findByIdAndDelete(req.params.id);

    if (!wish) {
      return res.status(404).json({
        message: "Желание не найдено",
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Не удалось удалить желание",
    });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await WishModel.updateOne(
      { _id: req.params.id },
      {
        title: req.body.title,
        link: req.body.link,
        image: req.body.image,
        priceCategory: req.body.priceCategory,
      }
    );

    if (updated.matchedCount === 0) {
      return res.status(404).json({
        message: "Желание не найдено",
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Не удалось обновить желание",
    });
  }
};

export const reserve = async (req, res) => {
  try {
    const wish = await WishModel.findById(req.params.id).populate("wishlist");

    if (!wish) {
      return res.status(404).json({ message: "Желание не найдено" });
    }

    if (wish.wishlist.user.toString() === req.userId) {
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
    const wish = await WishModel.findById(req.params.id);

    if (!wish) {
      return res.status(404).json({ message: "Желание не найдено" });
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
    const wishes = await WishModel.find({
      reservedBy: req.userId,
    })
      .populate("wishlist")
      .populate("reservedBy");

    res.json(wishes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось получить брони" });
  }
};
