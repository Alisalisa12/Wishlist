import WishlistModel from '../models/Wishlist.js';

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
      message: 'Не удалось создать вишлист',
    });
  }
};