const {
  OK_CODE, BAD_REQUEST_CODE, NOT_FOUND_CODE, SERVER_ERROR_CODE,
} = require('./constants');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK_CODE).send(users))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'Server error.' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        return res.status(OK_CODE).send(user);
      }
      return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь с таким id не найден.' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Введен некорректный id для поиска пользователя.' });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;

  // console.log(name);
  // console.log(about);
  // console.log(avatar);

  User.create({ name, about, avatar })
    .then((user) => res.status(OK_CODE).send(user))
    .catch((err) => {
      // console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.patchUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about, avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.status(OK_CODE).send(user);
      }
      return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь с указанным _id не найден.' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при обновлении пользователя.' });
      }
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.status(OK_CODE).send(user);
      }
      return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь с указанным _id не найден.' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};
