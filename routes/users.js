const users = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const { getUsers, getUser, addUser, patchUser, patchAvatar } = require('../controllers/users');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

users.get('/', getUsers);
users.get('/:id', getUser);
users.post('/', addUser);
users.patch('/me', patchUser);
users.patch('/me/avatar', patchAvatar);

module.exports = users;