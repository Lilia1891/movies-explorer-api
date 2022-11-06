const Movie = require('../models/movie');
const NotFoundError = require('../Errors/NotFoundError');
const ValidationError = require('../Errors/ValidationError');
const ForbiddenError = require('../Errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send({ data: movie }))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (req.user._id === String(movie.owner)) {
        return Movie.findByIdAndRemove(req.params.movieId);
      }
      throw new ForbiddenError('Удалять фильм может только его владелец');
    })
    .then((movie) => {
      if (movie) {
        return res.status(200).send({ message: `Удален фильм: ${movie.nameRU}` });
      }
      throw new NotFoundError('Фильм не найден в базе');
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
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
