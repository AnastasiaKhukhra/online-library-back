const express = require('express');
const { body } = require('express-validator');

const booksController = require('../controlers/books');

const router = express.Router();

router.get('/books', booksController.getBooks);

router.post('/book',
  [
    body('title')
      .trim()
      .isLength({ min: 1 }),
    body('shortDescription')
      .trim()
      .isLength({ min: 1 })
  ],
  booksController.createBook
);

router.get('/book/:bookId', booksController.getBook);

router.put('/book/:bookId',
  [
    body('title')
      .trim()
      .isLength({ min: 1 }),
    body('shortDescription')
      .trim()
      .isLength({ min: 1 })
  ],
  booksController.updateBook
);

router.delete('/book/:bookId', booksController.deleteBook);

module.exports = router;
