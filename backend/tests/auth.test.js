import request from "supertest";
import app from "../app.js";

let token;

const user = {
  email: "testuser@mail.com",
  fullName: "Test User",
  username: "testuser",
  password: "12345678",
  passwordConfirm: "12345678",
};

describe("POST /auth/register", () => {
  test("Успешная регистрация пользователя", async () => {
    const res = await request(app).post("/auth/register").send(user);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.email).toBe("testuser@mail.com");

    token = res.body.token;
  });

  test("Ошибка при разных паролях", async () => {
    const res = await request(app).post("/auth/register").send({
        ...user,
        email: "fail@mail.com",
        passwordConfirm: "wrong",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body[0].msg).toBe("Пароли не совпадают");
  });
});

describe("POST /auth/login", () => {
  beforeEach(async () => {
      await request(app).post("/auth/register").send(user);
    });

  test("Успешная авторизация", async () => {
      const res = await request(app).post("/auth/login").send({
        email: user.email,
        password: user.password,
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    test("Ошибка при неверном пароле", async () => {
      const res = await request(app).post("/auth/login").send({
        email: user.email,
        password: "wrongpassword",
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Неверный логин или пароль.");
    });

    test("Ошибка при несуществующем email", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "wrongmail@mail.com",
        password: "password",
      });
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Пользователь не найден");
    });
  });

describe("GET /auth/me", () => {
  beforeEach(async () => {
    const res = await request(app).post("/auth/register").send(user);
    token = res.body.token;
    userId = res.body._id;
  });

  test("Получение данных текущего пользователя", async () => {
    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(user.email);
  });
});

describe("PATCH /auth/me", () => {
    beforeEach(async () => {
      const res = await request(app).post("/auth/register").send(user);
      token = res.body.token;
      userId = res.body._id;
    });

    test("Обновление профиля", async () => {
      const res = await request(app)
        .patch("/auth/me")
        .set("Authorization", `Bearer ${token}`)
        .send({ fullName: "Updated User" });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("DELETE /auth/me", () => {
    beforeEach(async () => {
      const res = await request(app).post("/auth/register").send(user);
      token = res.body.token;
      userId = res.body._id;
    });

    test("Удаление аккаунта", async () => {
      const res = await request(app)
        .delete("/auth/me")
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

