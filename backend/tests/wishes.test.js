import request from "supertest";
import app from "../app.js";

let token;
let wishlistId;
let wishId;

const user = {
  email: "user@mail.com",
  fullName: "User One",
  username: "user1",
  password: "123456",
  passwordConfirm: "123456",
};

describe("Wishes", () => {
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

  describe("PATCH /wishes/:id", () => {
    test("Обновление желания", async () => {
      const res = await request(app)
        .patch(`/wishes/${wishId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated Wish", priceCategory: "1000-3000" });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("DELETE /wishes/:id", () => {
    test("Удаление желания", async () => {
      const res = await request(app)
        .delete(`/wishes/${wishId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});