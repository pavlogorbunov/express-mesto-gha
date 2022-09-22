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

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      next(new Error('400'));
    }
    if (!user) {
      next(new Error('404'));
    }
    if (user) {
      res.status(200).send(user);
    }
  })
    .then(() => { })
    .catch(() => { });
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

module.exports.patchUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about, avatar }, { new: true, runValidators: true },)
    .then((user) => { return res.status(200).send(user); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: "Bad request." });
      }
      if (err.name === 'CastError') {
        return res.status(404).send({ message: "Not found." });
      } else {
        return res.status(500).send({ message: "Произошла ошибка" });
      }
    });
}

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true }, (err, user) => {
    if (err) {
      next(new Error('400'));
    }
    if (!user) {
      next(new Error('404'));
    }
    if (user) {
      res.status(200).send(user);
    }
  })
    .then(() => { })
    .catch(() => { });
}

module.exports.errorHandler = (err, req, res, next) => {
  console.log('errorHandler User');
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
