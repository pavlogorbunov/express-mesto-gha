const cards = require('express').Router();
const { getCards, postCard, deleteCard, likeCard, dislikeCard, errorHandler } = require('../controllers/cards');

cards.get('/', getCards);
cards.post('/', postCard);
cards.delete('/:cardId', deleteCard);
cards.put('/:cardId/likes', likeCard);
cards.delete('/:cardId/likes', dislikeCard);
cards.use(errorHandler);

module.exports = cards;