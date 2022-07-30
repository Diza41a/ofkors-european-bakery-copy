const mongoose = require('mongoose');
const { MONGO_URL } = require('../../config');
// require('dotenv').config({ path: `${__dirname}../../.env` });
// console.log('here', process.env.MONGO_URL);

process.env.MONGO_URL = MONGO_URL;
const dbConnection = mongoose.connect(process.env.MONGO_URL, {
});

module.exports = {
  dbConnection,
};
