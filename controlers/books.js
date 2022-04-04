const fs = require('fs');

const path = require('path');

const { validationResult } = require('express-validator');

const Book = require('../models/book');

exports.getBooks = (req, res, next) => {
  Book.find()
    .then(books => {
      res.status(200).json({ message: 'Fetched books success', books: books })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createBook = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const image = req.file?.path;
  const shortDescription = req.body.shortDescription;
  const detailedDescription = req.body.detailedDescription;
  const releaseDate = req.body.releaseDate;
  const author = req.body.author;
  const book = new Book({
    title: title,
    image: image,
    shortDescription: shortDescription,
    detailedDescription: detailedDescription,
    releaseDate: releaseDate,
    author: author,
  });
  book
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Book created successfully!',
        book: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
};

exports.getBook = (req, res, next) => {
  const bookId = req.params.bookId;
  Book.findById(bookId)
    .then(book => {
      if (!book) {
        const error = new Error('Could not find book.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ book: book });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
}

exports.updateBook = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const bookId = req.params.bookId;
  const title = req.body.title;
  const shortDescription = req.body.shortDescription;
  const detailedDescription = req.body.detailedDescription;
  const releaseDate = req.body.releaseDate;
  const author = req.body.author;
  const image = req.body.image;
  if (req.file) {
    image = req.file.path;
  }
  if (!image) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }
  Book.findById(bookId)
    .then(book => {
      if (!book) {
        const error = new Error('Could not find book.');
        error.statusCode = 404;
        throw error;
      }
      if (image !== book.image) {
        clearImage(book.image);
      }
      book.title = title;
      book.image = image;
      book.shortDescription = shortDescription;
      book.detailedDescription = detailedDescription;
      book.releaseDate = releaseDate;
      book.author = author;
      return book.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Book updated!', book: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
}

exports.deleteBook = (req, res, next) => {
  const bookId = req.params.bookId;
  Book.findById(bookId)
    .then(book => {
      if (!book) {
        const error = new Error('Could not find book.');
        error.statusCode = 404;
        throw error;
      }
      if (book.image) {
        clearImage(book.image);
      }
      return Book.findByIdAndRemove(bookId)
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Deleted book.' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
}

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
