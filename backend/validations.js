import {body} from 'express-validator'

export const registerValidation = [
    body('fullName', 'Укажите имя').isLength({min: 3}),
    body('email', 'Неверный формат почты').isEmail(),
    body('username', 'Укажите логин').isLength({min: 3}),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
    // body('avatarUrl', 'Неверная ссылка').optional().isURL(),
];

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
];

export const wishlistCreateValidation = [
  body('title', 'Введите название').isLength({ min: 3 }).isString(),
  body('eventDate', 'Укажите корректную дату события').optional().isISO8601(),
  body('visibility', 'Неверное значение доступа').isIn(['public', 'friends', 'private', 'link']), 

];

export const wishCreateValidation = [
  body('title', 'Введите название').isLength({ min: 3 }),
  body('priceCategory', 'Укажите ценовую категорию').isIn([
    "до 1000",
    "1000-3000",
    "3000-10000",
    "10000+",
  ]),
  body("wishlistId", "Некорректный wishlistId").isMongoId(),
  body("link").optional().isURL(),
  body("image").optional().isString(),
];