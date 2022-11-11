const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { corsOptions } = require('./constants');
const NotFoundError = require('./Errors/NotFoundError');
const ErrorsHandler = require('./middlewares/errors-handler');
const { BASE_URL } = require('./config');

const { PORT = 3000 } = process.env;
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

app.use(ErrorsHandler);

mongoose.connect(BASE_URL, {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
