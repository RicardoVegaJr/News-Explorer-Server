const jwt = require('jsonwebtoken');
const { login } = require('../controllers/users');
const User = require('../models/users');


jest.mock('../models/users');
jest.mock('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

describe('User Login', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'testPassword123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  describe('login - successful authentication', () => {
    it('should return a JWT token on successful login', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        name: 'Test User',
      };

      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEifQ.test';

      User.findUserByCredentials.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue(mockToken);

      await login(req, res, next);

      expect(User.findUserByCredentials).toHaveBeenCalledWith('test@example.com', 'testPassword123');
      expect(jwt.sign).toHaveBeenCalledWith(
        { _id: mockUser._id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ token: mockToken });
    });
  });

  describe('login - missing credentials', () => {
    it('should return 400 error if email is missing', () => {
      req.body = { password: 'testPassword123' };

      login(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(next.mock.calls[0][0].message).toBe('Bad request');
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(User.findUserByCredentials).not.toHaveBeenCalled();
    });

    it('should return 400 error if password is missing', () => {
      req.body = { email: 'test@example.com' };

      login(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(next.mock.calls[0][0].message).toBe('Bad request');
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(User.findUserByCredentials).not.toHaveBeenCalled();
    });

    it('should return 400 error if both email and password are missing', () => {
      req.body = {};

      login(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(next.mock.calls[0][0].message).toBe('Bad request');
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });
  });

  describe('login - invalid credentials', () => {
    it('should return 401 error on failed authentication', async () => {
      User.findUserByCredentials.mockRejectedValue(new Error('Invalid credentials'));

      await login(req, res, next);

      expect(User.findUserByCredentials).toHaveBeenCalledWith('test@example.com', 'testPassword123');
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(next.mock.calls[0][0].message).toBe('Unauthorized');
      expect(next.mock.calls[0][0].statusCode).toBe(401);
    });

    it('should return 401 error if user is not found', async () => {
      User.findUserByCredentials.mockRejectedValue(new Error('User not found'));

      await login(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].message).toBe('Unauthorized');
      expect(next.mock.calls[0][0].statusCode).toBe(401);
    });
  });

  describe('login - token generation', () => {
    it('should sign JWT with correct payload and expiration', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
      };

      User.findUserByCredentials.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('token123');

      await login(req, res, next);

      expect(jwt.sign).toHaveBeenCalledWith(
        { _id: '507f1f77bcf86cd799439011' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
    });
  });
});
