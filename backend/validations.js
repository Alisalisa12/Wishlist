import {body} from 'express-validator'

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
    body('fullName', 'Укажите имя').isLength({min: 3}),
    body('avatsrUrl', 'Неверная ссылка').optional().isURL(),
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