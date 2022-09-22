const users = require('express').Router();
const { getUsers, getUser, addUser, patchUser, patchAvatar, errorHandler } = require('../controllers/users');

users.get('/', getUsers);
users.get('/:id', getUser);
users.post('/', addUser);
users.patch('/me', patchUser);
users.patch('/me/avatar', patchAvatar);
users.use('*', errorHandler);

module.exports = users;