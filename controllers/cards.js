const Card = require('../models/card');
const user = require('../models/user');
const VALIDATION_ERROR_CODE = 400;
const CAST_ERROR_CODE = 404;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(err => {
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
}

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send(card))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: "Переданы некорректные данные при создании карточки." });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
    });
}

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId, (err, card) => {
    if (err) {
      next(new Error('400'));
    }
    if (!card) {
      next(new Error('404'));
    }
    if (card) {
      res.status(200).send({ message: "DELETED" });
    }
  })
    .then(() => { })
    .catch(() => { });
}

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }, (err, card) => {
      if (err) {
        next(new Error('400'));
      }
      if (!card) {
        next(new Error('404'));
      }
      if (card) {
        res.status(200).send(card);
      }
    }
  )
    .then(() => { })
    .catch(() => { });
}

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }, (err, card) => {
      if (err) {
        next(new Error('400'));
      }
      if (!card) {
        next(new Error('404'));
      }
      if (card) {
        res.status(200).send(card);
      }
    }
  )
    .then(() => { })
    .catch(() => { });
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