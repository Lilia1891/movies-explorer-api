require('dotenv').config();

const { BASE_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;

module.exports = { BASE_URL };
