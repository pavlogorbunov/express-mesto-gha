const cards = require('express').Router();
const {
  celebrate, Joi, Segments, errors,
} = require('celebrate');
const {
  getCards, getCard, postCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cards.get('/', getCards);

cards.get('/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getCard);

cards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi
      .string()
      .required()
      .pattern(/https?:\/\/[a-z0-9-.]{2,}.[a-z]{2,}\/?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]*#?/i)
      .min(2)
      .max(30),
  }),
}), postCard);

cards.delete('/:cardId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

cards.put('/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard);

cards.delete('/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

cards.use(errors());

module.exports = cards;
