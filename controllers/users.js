const User = require('../models/user');
const VALIDATION_ERROR_CODE = 400;
const CAST_ERROR_CODE = 404;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => {
      return res.status(500).send({ message: "Произошла ошибка" });
    });
}

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then(user => res.send(user))
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(CAST_ERROR_CODE).send({ message: "Пользователь по указанному _id не найден." });
      }
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: "Переданы некорректные данные." });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
    });
}

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send(user))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: "Переданы некорректные данные при создании пользователя." });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
    });
}

module.exports.patchUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about, avatar }, { new: true })
    .then(user => res.send(user))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: "Переданы некорректные данные при обновлении профиля." });
      }
      if (err.name === 'CastError') {
        return res.status(CAST_ERROR_CODE).send({ message: "Пользователь с указанным _id не найден." });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
    });
}

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then(user => res.send(user))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: "Переданы некорректные данные при обновлении аватара." });
      }
      if (err.name === 'CastError') {
        return res.status(CAST_ERROR_CODE).send({ message: "Пользователь с указанным _id не найден." });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
    });
}
