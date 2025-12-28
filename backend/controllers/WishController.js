import WishModel from "../models/Wish.js";


export const create = async (req, res) => {
  try {
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

/**
 * Удалить желание
 */
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

/**
 * Обновить желание
 */
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