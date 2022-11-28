const OK_CODE = 200;
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const AccessDeniedError = require('../errors/access-denied-error');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (card) {
        return res
          .status(OK_CODE)
          .send({ card });
      }
      next(new NotFoundError('Карточка с таким id не найдена.'));
      return null;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введен некорректный id для поиска карточки.'));
        return;
      }
      next(err);
    });
};

module.exports.postCard = (req, res, next) => {
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
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findOneAndDelete({ _id: req.params.cardId, owner: req.user._id })
    .then((card) => {
      if (card) {
        return res
          .status(OK_CODE)
          .send({ message: 'DELETED' });
      }
      Card.findById(req.params.cardId)
        .then((cardWithId) => {
          if (cardWithId) {
            next(new AccessDeniedError('Нельзя удалять чужие карточки!'));
          }
          return null;
        })
        .catch(next);
      next(new NotFoundError('Карточка с таким id не найдена.'));
      return null;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный _id для поиска карточки.'));
        return;
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) {
        return res
          .status(OK_CODE)
          .send(card.likes);
      }
      next(new NotFoundError('Передан несуществующий _id карточки.'));
      return null;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятия лайка.'));
        return;
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) {
        return res
          .status(OK_CODE)
          .send(card.likes);
      }
      next(new NotFoundError('Передан несуществующий _id карточки.'));
      return null;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятия лайка.'));
        return;
      }
      next(err);
    });
};
