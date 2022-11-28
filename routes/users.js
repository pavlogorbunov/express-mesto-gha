const users = require('express').Router();
const {
  celebrate, Joi, Segments, errors,
} = require('celebrate');
const {
  getUsers, getUser, patchUser, patchAvatar, getMe,
} = require('../controllers/users');

users.get('/', getUsers);
users.get('/me', getMe);
users.get('/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUser);
users.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), patchUser);
users.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(2).max(200),
  }),
}), patchAvatar);
users.use(errors());

module.exports = users;
