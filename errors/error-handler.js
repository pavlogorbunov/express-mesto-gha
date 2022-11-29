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

module.exports = handleError;
