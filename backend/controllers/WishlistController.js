import WishlistModel from "../models/Wishlist.js";
import Wishlist from "../models/Wishlist.js";

export const create = async (req, res) => {
  try {
    const doc = new WishlistModel({
      title: req.body.title,
      eventDate: req.body.eventDate,
      visibility: req.body.visibility,
      user: req.userId,
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
export const getOne = async (req, res) => {
  try {
    const doc = await Wishlist.findOne({ _id: req.params.id });

    if (!doc) {
      return res.status(404).json({
        message: "Вишлист не найден",
      });
    }

    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Не удалось получить вишлист",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const wishlistId = req.params.id;

    const doc = await WishlistModel.findOneAndDelete({
      _id: wishlistId,
    });

    if (!doc) {
      return res.status(404).json({
        message: 'Вишлист не найден',
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Не удалось удалить вишлист',
    });
  }
};

export const update = async (req, res) => {
  try {
    const wishlistId = req.params.id;
    await WishlistModel.updateOne(
      {
        _id: wishlistId,
      },
      {
        title: req.body.title,
        eventDate: req.body.eventDate,
        visibility: req.body.visibility,
        user: req.userId,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось изменить вишлист",
    });
  }
};
