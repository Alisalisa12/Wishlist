import request from "supertest";
import app from "../app.js";

describe("Auth Middleware", () => {
  test("Доступ запрещен без токена", async () => {
    const res = await request(app).get("/friends");
    expect(res.statusCode).toBe(403); // Unauthorized
    expect(res.body.message).toMatch(/Нет доступа/i);
  });
});