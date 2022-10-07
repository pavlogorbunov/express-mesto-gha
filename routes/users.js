const users = require('express').Router();
const {
  getUsers, getUser, addUser, patchUser, patchAvatar,
} = require('../controllers/users');

users.get('/', getUsers);
users.get('/:id', getUser);
users.post('/', addUser);
users.patch('/me', patchUser);
users.patch('/me/avatar', patchAvatar);

module.exports = users;
