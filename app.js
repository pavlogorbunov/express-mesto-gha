const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const users = require('./routes/users');
const cards = require('./routes/cards');
const { addUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
// const handleError404 = require('./errors/error404');
const Error404 = require('./errors/error404');
const { handleError, handleError404 } = require('./errors/error-handlers');

const app = express();

// function handleError404(req, res, next) {
//   console.log('________________404________________');
//   next(new Error404('Page not found. 404.'));
// }

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi
      .string()
      .pattern(/https?:\/\/[a-z0-9-.]{2,}.[a-z]{2,}\/?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]*#?/i)
      .min(2)
      .max(30),
  }),
}), addUser);

app.use('/users', auth, users);
app.use('/cards', auth, cards);
app.use('/*', handleError404);
app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
