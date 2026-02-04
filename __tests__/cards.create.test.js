const { createCard } = require('../controllers/cards');
const Card = require('../models/cards');

jest.mock('../models/cards');

describe('Create Card', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      user: {
        _id: '507f1f77bcf86cd799439011',
      },
      body: {
        title: 'Breaking News',
        description: 'This is a breaking news article',
        image: 'https://example.com/image.jpg',
        url: 'https://example.com/article',
        source: 'Example News',
        publishedAt: new Date('2026-02-03'),
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  describe('createCard - successful creation', () => {
    it('should create a card and return 201 status with card data', async () => {
      const mockCard = {
        _id: '607f1f77bcf86cd799439012',
        owner: '507f1f77bcf86cd799439011',
        title: 'Breaking News',
        description: 'This is a breaking news article',
        image: 'https://example.com/image.jpg',
        url: 'https://example.com/article',
        source: 'Example News',
        publishedAt: new Date('2026-02-03'),
        createdAt: new Date(),
      };

      Card.create.mockResolvedValue(mockCard);

      await createCard(req, res, next);

      expect(Card.create).toHaveBeenCalledWith({
        owner: '507f1f77bcf86cd799439011',
        title: 'Breaking News',
        description: 'This is a breaking news article',
        image: 'https://example.com/image.jpg',
        url: 'https://example.com/article',
        source: 'Example News',
        publishedAt: new Date('2026-02-03'),
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCard);
    });
  });

  describe('createCard - validation errors', () => {
    it('should return 400 error when title is missing', async () => {
      req.body.title = null;

      await createCard(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(next.mock.calls[0][0].message).toBe('Bad request');
      expect(Card.create).not.toHaveBeenCalled();
    });

    it('should return 400 error when description is missing', async () => {
      req.body.description = null;

      await createCard(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    it('should return 400 error when image is missing', async () => {
      req.body.image = null;

      await createCard(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    it('should return 400 error when url is missing', async () => {
      req.body.url = null;

      await createCard(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    it('should return 400 error when source is missing', async () => {
      req.body.source = null;

      await createCard(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    it('should return 400 error when publishedAt is missing', async () => {
      req.body.publishedAt = null;

      await createCard(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });
  });

  describe('createCard - database errors', () => {
    it('should pass error to next when Card.create fails', async () => {
      const error = new Error('Database connection failed');
      Card.create.mockRejectedValue(error);

      await createCard(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
