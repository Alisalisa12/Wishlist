import request from "supertest";
import app from "../app.js";

let token;
let wishlistId;

const user = {
  email: "testuser@mail.com",
  fullName: "Test User",
  username: "testuser",
  password: "12345678",
  passwordConfirm: "12345678",
};

describe("Wishlists", () => {
  beforeEach(async () => {
    const res = await request(app).post("/auth/register").send(user);
    token = res.body.token;
    userId = res.body._id;

    const wlRes = await request(app)
      .post("/wishlists")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Birthday", eventDate: "2026-01-07", visibility: "public" });
    wishlistId = wlRes.body._id;

    const wishRes = await request(app)
      .post(`/wishlists/${wishlistId}/wishes`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "New Wish", priceCategory: "до 1000" });
    wishId = wishRes.body._id;
  });

  describe("POST /wishlists", () => {
    test("Создание вишлиста", async () => {
      const res = await request(app)
        .post("/wishlists")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Another Wishlist", eventDate: "2026-12-31", visibility: "public" });
      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe("Another Wishlist");
    });
  });

  describe("GET /wishlists/me", () => {
    test("Получение своих вишлистов", async () => {
      const res = await request(app)
        .get("/wishlists/me")
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe("PATCH /wishlists/:id", () => {
    test("Обновление вишлиста", async () => {
      const res = await request(app)
        .patch(`/wishlists/${wishlistId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated Birthday" });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("DELETE /wishlists/:id", () => {
    test("Удаление вишлиста", async () => {
      const res = await request(app)
        .delete(`/wishlists/${wishlistId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
