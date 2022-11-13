const BAD_REQUEST_ERROR = 400;
const NOT_FOUND_ERROR = 404;
const INTERNAL_SERVER_ERROR = 500;
const UNAUTHORIZED = 401;
const REGISTRATION_ERROR = 409;
const FORBIDDEN_ERROR = 403;
const corsOptions = {
  origin: [
    'https://lilia.nomoredomains.icu',
    'http://lilia.nomoredomains.icu',
    'http://localhost:3000',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true,
};

const NOT_FOUND_MESSAGE = 'Запрашиваемый пользователь не найден';
const VALIDATION_ID_MESSAGE = 'Передан некорректный id';
const VALIDATION_MESSAGE = 'Переданы некорректные данные';
const REGISTRATION_MESSAGE = 'Такой email уже существует';
const FILM_NOT_FOUND_MESSAGE = 'Фильм не найден';
const FORBIDDEN_MESSAGE = 'Удалять фильм может только его владелец';

module.exports = {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  REGISTRATION_ERROR,
  FORBIDDEN_ERROR,
  corsOptions,
  NOT_FOUND_MESSAGE,
  VALIDATION_ID_MESSAGE,
  VALIDATION_MESSAGE,
  REGISTRATION_MESSAGE,
  FILM_NOT_FOUND_MESSAGE,
  FORBIDDEN_MESSAGE,
};
