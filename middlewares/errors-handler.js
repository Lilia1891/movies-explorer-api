const { INTERNAL_SERVER_ERROR } = require('../constants');

module.exports = (err, req, res, next) => {
  const status = err.status || INTERNAL_SERVER_ERROR;
  const message = status === INTERNAL_SERVER_ERROR ? 'Ошибка сервера' : err.message;
  res.status(status).send({ message });
  next();
};
