import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import UserModel from "../models/User.js";

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const { password, passwordConfirm } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: "Пароли не совпадают" });
    }

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      username: req.body.username,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secretkey",
      {
        expiresIn: "7d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться!",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный логин или пароль.",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secretkey",
      {
        expiresIn: "7d",
      }
    );

    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
    console.log(error);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};

export const update = async (req, res) => {
  try {
    const result = await UserModel.updateOne(
      { _id: req.userId },
      {
        fullName: req.body.fullName,
        username: req.body.username,
        avatarUrl: req.body.avatarUrl,
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Имя пользователя уже занято",
      });
    }

    res.status(500).json({
      message: "Не удалось обновить данные пользователя",
    });
  }
};
export const removeAccount = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }
    await user.deleteOne();
    res.json({
      success: true,
      message: "Аккаунт удалён",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Не удалось удалить аккаунт",
    });
  }
};
