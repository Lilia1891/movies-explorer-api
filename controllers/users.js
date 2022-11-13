const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const NotFoundError = require('../Errors/NotFoundError');
const ValidationError = require('../Errors/ValidationError');
const RegistrationError = require('../Errors/RegistrationError');
const {
  NOT_FOUND_MESSAGE,
  VALIDATION_ID_MESSAGE,
  VALIDATION_MESSAGE,
  REGISTRATION_MESSAGE,
} = require('../constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError(NOT_FOUND_MESSAGE))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(VALIDATION_ID_MESSAGE));
      } else {
        next(err);
      }
    });
};
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError(NOT_FOUND_MESSAGE))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(VALIDATION_MESSAGE));
      } else if (err.code === 11000) {
        next(new RegistrationError(REGISTRATION_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(VALIDATION_MESSAGE));
      } else if (err.code === 11000) {
        next(new RegistrationError(REGISTRATION_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
