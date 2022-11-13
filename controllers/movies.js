const Movie = require('../models/movie');
const NotFoundError = require('../Errors/NotFoundError');
const ValidationError = require('../Errors/ValidationError');
const ForbiddenError = require('../Errors/ForbiddenError');
const {
  VALIDATION_MESSAGE,
  FILM_NOT_FOUND_MESSAGE,
  FORBIDDEN_MESSAGE,
} = require('../constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movie) => res.send({ data: movie }))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(FILM_NOT_FOUND_MESSAGE);
      }
      if (req.user._id === String(movie.owner)) {
        return Movie.findByIdAndRemove(req.params.movieId);
      }
      throw new ForbiddenError(FORBIDDEN_MESSAGE);
    })
    .then((movie) => {
      if (movie) {
        return res.status(200).send({ message: `Удален фильм: ${movie.nameRU}` });
      }
      throw new NotFoundError(FILM_NOT_FOUND_MESSAGE);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        next(new ValidationError(VALIDATION_MESSAGE));
      } else {
        next(err);
      }
    });
};
