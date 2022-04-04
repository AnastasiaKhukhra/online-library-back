const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  detailedDescription: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: String,
    required: false,
  },
  author: {
    type: String,
    required: true,
  },
},
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
