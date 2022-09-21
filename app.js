const express = require('express');
const mongoose = require('mongoose');
const { PORT = 3000 } = process.env;
const users = require('./routes/users');
const cards = require('./routes/cards');

const app = express();

const VALIDATION_ERROR_CODE = 400;
const CAST_ERROR_CODE = 404;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6328aceb060d792139801e85'
  };

  next();
});
app.use('/users', users);
app.use('/cards', cards);
app.use('*', error404);

function error404(req, res) {
  return res.status(404).send({ message: "Not found." });
};

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})