const {
  OK_CODE, BAD_REQUEST_CODE, NOT_FOUND_CODE, SERVER_ERROR_CODE,
} = require('constants');
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getCard = (req, res) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (card) {
        return res.status(OK_CODE).send({ card });
      }
      return res.status(NOT_FOUND_CODE).send({ message: 'Карточка с таким id не найдена.' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Введен некорректный id для поиска карточки.' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (card) {
        return res.status(OK_CODE).send(card);
      }
      return null;
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  // console.log(req.params.cardId);
  Card.findByIdAndRemove(req.params.cardId, { runValidators: true })
    .then((card) => {
      // console.log(card);
      if (card) {
        return res.status(OK_CODE).send({ message: 'DELETED' });
      }
      return res.status(NOT_FOUND_CODE).send({ message: 'Карточка с указанным _id не найдена.' });
    })
    .catch((err) => {
      // console.log(err.name);
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Некорректный _id для поиска карточки.' });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Server error.' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) {
        return res.status(OK_CODE).send(card.likes);
      }
      return res.status(NOT_FOUND_CODE).send({ message: 'Передан несуществующий _id карточки.' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные для постановки/снятия лайка.' });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Server error.' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) {
        return res.status(OK_CODE).send(card.likes);
      }
      return res.status(NOT_FOUND_CODE).send({ message: 'Передан несуществующий _id карточки.' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные для постановки/снятия лайка.' });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Server error.' });
    });
};
