const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const urlRegExp = require('../utils');

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(urlRegExp),
    trailerLink: Joi.string().required().regex(urlRegExp),
    thumbnail: Joi.string().required().regex(urlRegExp),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).required().hex(),
  }),
}), deleteMovie);

module.exports = router;
