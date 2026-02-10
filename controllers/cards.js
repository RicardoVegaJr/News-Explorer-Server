const Card = require('../models/cards');

class BadRequestError extends Error { constructor(msg) { super(msg); this.statusCode = 400; } }
class NotFoundError extends Error { constructor(msg) { super(msg); this.statusCode = 404; } }

const errorMessages = {
  BAD_REQUEST: 'Bad request',
  NOT_FOUND: 'Card not found',
};

const getCards = (req, res, next) => {
  const { _id } = req.user;
  return Card.find({ owner: _id })
    .then((cards) => {
      res.status(200).json(cards);
      return cards;
    })
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { _id } = req.user;
  const { title, description, image, url, source, publishedAt } = req.body;

  if (!title || !description || !image || !url || !source || !publishedAt) {
    return next(new BadRequestError(errorMessages.BAD_REQUEST));
  }

  return Card.create({
    owner: _id,
    title,
    description,
    image,
    url,
    source,
    publishedAt,
  })
    .then((card) => {
      res.status(201).json(card);
      return card;
    })
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  return Card.findById(cardId)
    .then((card) => {
      if (!card) throw new NotFoundError(errorMessages.NOT_FOUND);
      if (card.owner.toString() !== _id) {
        throw new Error('Unauthorized to delete this card');
      }
      return Card.findByIdAndDelete(cardId);
    })
    .then((card) => {
      res.status(200).json(card);
      return card;
    })
    .catch((err) => next(err));
};

module.exports = { getCards, createCard, deleteCard };
