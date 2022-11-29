const Error404 = require('./error404');

const handleError = (err, req, res, next) => {
  if (!err) return;

  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
};

function handleError404(req, res, next) {
  // console.log('________________404________________');
  next(new Error404('Page not found. 404.'));
}

module.exports = { handleError, handleError404 };
