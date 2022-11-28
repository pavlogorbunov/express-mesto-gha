const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const OK_CODE = 200;
const MONGO_DB_CONFLICT_CODE = 11000;
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK_CODE).send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(OK_CODE)
          .send(user);
      }
      next(new NotFoundError('Пользователь с таким id не найден.'));
      return null;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введен некорректный id для поиска пользователя.'));
        return;
      }
      next(err);
    });
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res
          .status(OK_CODE)
          .send(user);
      }
      next(new NotFoundError('Пользователь с таким id не найден.'));
      return null;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введен некорректный id для поиска пользователя.'));
        return;
      }
      next(err);
    });
};

module.exports.addUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const newUser = user;
      newUser.password = undefined;
      res.status(OK_CODE).send(newUser);
    })
    .catch((err) => {
      if (err.code === MONGO_DB_CONFLICT_CODE) {
        next(new ConflictError('Пользователь с таким email уже существует.'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
        return;
      }
      next(err);
    });
};

module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res
          .status(OK_CODE)
          .send(user);
      }
      next(new NotFoundError('Пользователь с таким id не найден.'));
      return null;
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении пользователя.'));
        return;
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь с таким id не найден.'));
        return;
      }
      next(err);
    });
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res
          .status(OK_CODE)
          .send(user);
      }
      next(new NotFoundError('Пользователь с указанным id не найден.'));
      return null;
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
        return;
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь с указанным id не найден.'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).end();
    })
    .catch(next);
};
