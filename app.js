const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { INTERNAL_SERVER_ERROR, corsOptions } = require('./constants');
const NotFoundError = require('./Errors/NotFoundError');

const { PORT = 3000 } = process.env;
const { DBADRESS = 'mongodb://localhost:27017/moviesdb' } = process.env;
const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(helmet());
app.options('*', cors());
app.use(routes);
app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const status = err.status || INTERNAL_SERVER_ERROR;
  const message = status === INTERNAL_SERVER_ERROR ? 'Ошибка сервера' : err.message;
  res.status(status).send({ message });
  next();
});

mongoose.connect(DBADRESS, {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
