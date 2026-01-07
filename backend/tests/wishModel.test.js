import mongoose from "mongoose";
import WishModel from "../models/Wish.js";

describe("Wish Model Tests", () => {
  test("Создание желания с валидными данными", async () => {
    const wish = new WishModel({
      title: "Test Wish",
      priceCategory: "до 1000",
      wishlist: new mongoose.Types.ObjectId(),
    });

    const saved = await wish.save();
    expect(saved._id).toBeDefined();
    expect(saved.title).toBe("Test Wish");
    expect(saved.priceCategory).toBe("до 1000");
    expect(saved.reserved).toBe(false);
  });

  test("Ошибка при неправильной цене", async () => {
    const wish = new WishModel({
      title: "Bad Price",
      priceCategory: "2000", 
      wishlist: new mongoose.Types.ObjectId(),
    });

    await expect(wish.save()).rejects.toThrow();
  });

  test("Ошибка при отсутствии title", async () => {
    const wish = new WishModel({
      priceCategory: "до 1000",
      wishlist: new mongoose.Types.ObjectId(),
    });

    await expect(wish.save()).rejects.toThrow();
  });

  test("Ошибка при отсутствии wishlist", async () => {
    const wish = new WishModel({
      title: "No Wishlist",
      priceCategory: "до 1000",
    });

    await expect(wish.save()).rejects.toThrow();
  });
});