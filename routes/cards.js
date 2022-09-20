const cards = require('express').Router();
const mongoose = require('mongoose');
const { getCards, postCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

cards.get('/', getCards);
cards.post('/', postCard);
cards.delete('/:cardId', deleteCard);
cards.put('/:cardId/likes', likeCard);
cards.delete('/:cardId/likes', dislikeCard);

module.exports = cards;