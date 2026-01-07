import request from "supertest";
import app from "../app.js";

let token;
let userId;
let friendToken;
let friendId;


const user = {
  email: "testuser@mail.com",
  fullName: "Test User",
  username: "testuser",
  password: "123456",
  passwordConfirm: "123456",
};

const friendUser = {
  email: "friend@mail.com",
  fullName: "Friend User",
  username: "friend1",
  password: "123456",
  passwordConfirm: "123456",
};

describe("Friends", () => {
  beforeEach(async () => {
    const resUser = await request(app).post("/auth/register").send(user);
    token = resUser.body.token;
    userId = resUser.body._id;

    const resFriend = await request(app).post("/auth/register").send(friendUser);
    friendToken = resFriend.body.token;
    friendId = resFriend.body._id;
  });

  describe("POST /friends/request/:friendId", () => {
    test("Отправка запроса в друзья", async () => {
      const res = await request(app)
        .post(`/friends/request/${friendId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.body.success).toBe(true);
    });
  });

  describe("POST /friends/accept/:friendId", () => {
    test("Принять запрос", async () => {
      await request(app).post(`/friends/request/${friendId}`).set("Authorization", `Bearer ${token}`);
      const res = await request(app)
        .post(`/friends/accept/${userId}`)
        .set("Authorization", `Bearer ${friendToken}`);
      expect(res.body.success).toBe(true);
    });
  });

  describe("POST /friends/decline/:friendId", () => {
    test("Отклоненить запрос", async () => {
      await request(app).post(`/friends/request/${friendId}`).set("Authorization", `Bearer ${token}`);
      const res = await request(app)
        .post(`/friends/decline/${userId}`)
        .set("Authorization", `Bearer ${friendToken}`);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /friends", () => {
    test("Получить список друзей", async () => {
      await request(app).post(`/friends/request/${friendId}`).set("Authorization", `Bearer ${token}`);
      await request(app).post(`/friends/accept/${userId}`).set("Authorization", `Bearer ${friendToken}`);
      const res = await request(app).get("/friends").set("Authorization", `Bearer ${token}`);
      expect(res.body.friends).toHaveLength(1);
    });
  });
});