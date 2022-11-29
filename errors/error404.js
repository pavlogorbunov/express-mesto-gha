class Error404 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

function error404(req, res, next) {
  next(new Error404('Page not found. 404.'));
}

module.exports = { Error404, error404 };
