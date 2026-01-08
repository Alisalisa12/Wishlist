import { body, param } from "express-validator";

export const registerValidation = [
  body("fullName")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Имя должно быть минимум 3 символа"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Неверный формат почты")
    .normalizeEmail(),

  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Логин должен быть минимум 3 символа")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Логин может содержать только буквы, цифры и _")
    .toLowerCase(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Пароль должен быть минимум 8 символов")
    .not().contains(" ")
    .withMessage("Пароль не должен содержать пробелы"),

  body("passwordConfirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Пароли не совпадают");
      }
      return true;
    }),
];

export const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Неверный формат почты")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 5 })
    .withMessage("Пароль должен быть минимум 5 символов"),
];

export const wishlistCreateValidation = [
  body("title")
    .trim()
    .isString()
    .isLength({ min: 3 })
    .withMessage("Введите название"),

  body("eventDate")
    .optional()
    .isISO8601()
    .withMessage("Укажите корректную дату события"),

  body("visibility")
    .isIn(["public", "friends", "private", "link"])
    .withMessage("Неверное значение доступа"),
];

export const wishCreateValidation = [
  body("title")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Введите название"),

  body("priceCategory")
    .isIn(["до 1000", "1000-3000", "3000-10000", "10000+"])
    .withMessage("Укажите ценовую категорию"),

  param("wishlistId")
    .isMongoId()
    .withMessage("Вишлист не найден или ссылка некорректна"),

  body("link")
    .optional()
    .isURL()
    .withMessage("Неверная ссылка"),

  body("image")
    .optional()
    .isString()
    .withMessage("Неверная ссылка на изображение"),
];

export const userUpdateValidation = [
  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Имя должно быть минимум 3 символа"),

  body("username")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Логин должен быть минимум 3 символа")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Логин может содержать только буквы, цифры и _")
    .toLowerCase(),

  body("avatarUrl")
    .optional()
    .isURL({ require_protocol: true })
    .withMessage("Неверная ссылка на аватарку"),
];