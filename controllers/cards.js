const Card = require('../models/card');
// const user = require('../models/user');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(err => {
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
}

module.exports.getCard = (req, res) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (card) {
        return res.status(200).send({ card });
      } else {
        return res.status(404).send({ message: "Карточка с таким id не найдена." });
      }
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: "Введен некорректный id для поиска карточки." });
      } else {
        return res.status(500).send({ message: "Произошла ошибка" });
      }
    });
}

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then(card => {
      if (card) {
        return res.status(200).send(card);
      }
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: "Переданы некорректные данные при создании карточки." });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
    });
}

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId, { new: true, runValidators: true })
    .then((card) => {
      if (card) {
        return res.status(200).send({ message: "DELETED" });
      } else {
        return res.status(404).send({ message: "Карточка с указанным _id не найдена." });
      }
    })
    .catch((err) => {
      return res.status(500).send({ message: "Server error." });
    });
}

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (card) {
        return res.status(200).send(card.likes);
      } else {
        return res.status(404).send({ message: "Передан несуществующий _id карточки." });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: "Переданы некорректные данные для постановки/снятия лайка." });
      } else {
        return res.status(500).send({ message: "Server error." });
      }
    });
}

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then(card => {
      if (card) {
        return res.status(200).send(card.likes);
      } else {
        return res.status(404).send({ message: "Передан несуществующий _id карточки." });
      }
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: "Переданы некорректные данные для постановки/снятия лайка." });
      } else {
        return res.status(500).send({ message: "Server error." });
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