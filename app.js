require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const {
  createUser,
  login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { INTERNAL_SERVER_ERROR } = require('./constants');

const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/users', auth, userRouter);
app.use('/movies', auth, movieRouter);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const status = err.status || INTERNAL_SERVER_ERROR;
  const message = status === INTERNAL_SERVER_ERROR ? 'Ошибка сервера' : err.message;
  res.status(status).send({ message });
  next();
});

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
