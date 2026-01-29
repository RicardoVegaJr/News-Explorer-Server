const express = require('express');
const { getCards, createCard, deleteCard } = require('../controllers/cards');
const { auth } = require('../controllers/users');

const router = express.Router();

// All card routes require authentication
router.use(auth);

// GET all cards for authenticated user
router.get('/', getCards);

// POST create new card
router.post('/', createCard);

// DELETE card by id
router.delete('/:cardId', deleteCard);

module.exports = router;
