const Card = require('../models/card');
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
      return res.status(500).send({ message: "Произошла ошибка" }):
    });
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(res.status(200).send())
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(CAST_ERROR_CODE).send({ message: "Карточка с указанным _id не найдена." });
      }
      return res.status(500).send({ message: "Произошла ошибка" }):
    });
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then(card => res.send(card))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: "Переданы некорректные данные для постановки/снятии лайка." });
      }
      if (err.name === 'CastError') {
        return res.status(CAST_ERROR_CODE).send({ message: "Передан несуществующий _id карточки." });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
    });
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(card => res.send(card))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: "Переданы некорректные данные для постановки/снятии лайка." });
      }
      if (err.name === 'CastError') {
        return res.status(CAST_ERROR_CODE).send({ message: "Передан несуществующий _id карточки." });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
    });
}