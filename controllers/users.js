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
  User.findById(req.params.id, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.status(200).send({ user });
      } else {
        return res.status(404).send({ message: "Пользователь с таким id не найден." });
      }
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: "Введен некорректный id для поиска пользователя." });
      } else {
        return res.status(500).send({ message: "Произошла ошибка" });
      }
    });
}

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar }, { new: true, runValidators: true },)
    .then(user => res.send(user))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: "Переданы некорректные данные при создании пользователя." });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
    });
}

module.exports.patchUser = (req, res, next) => {
  User.findById(req.user._id)
    .then(user => {
      const username = user.name;
      const userabout = user.about;
      const useravatar = user.avatar;

      const { name = username, about = userabout, avatar = useravatar } = req.body;

      console.log(name);
      console.log(about);
      console.log(avatar);

      User.findByIdAndUpdate(req.user._id, { name, about, avatar }, { new: true, runValidators: true },)
        .then((user) => {
          return res.status(200).send(user);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return res.status(400).send({ message: "Переданы некорректные данные при обновлении профиля." });
          }
          if (err.name === 'CastError') {
            return res.status(404).send({ message: "Пользователь с указанным _id не найден." });
          } else {
            return res.status(500).send({ message: "Ошибка по умолчанию." });
          }
        });

    });
}

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(user => {
      return res.status(200).send(user);
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: "Переданы некорректные данные при обновлении аватара." });
      } else if (err.name === 'CastError') {
        return res.status(404).send({ message: "Пользователь с указанным _id не найден." });
      } else {
        return res.status(500).send({ message: "Ошибка по умолчанию." });
      }
    });
}

module.exports.errorHandler = (err, req, res, next) => {
  if (err.message === '400') {
    return res.status(400).send({ message: "Bad request." });
  }
  if (err.message === '404') {
    return res.status(404).send({ message: "Not found." });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: "Bad request." });
  } else {
    return res.status(500).send({ message: "Произошла ошибка" });
  }
}
