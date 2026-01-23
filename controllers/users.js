const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Simple error helpers
class BadRequestError extends Error { constructor(msg) { super(msg); this.statusCode = 400; } }
class UnauthorizedError extends Error { constructor(msg) { super(msg); this.statusCode = 401; } }
class NotFoundError extends Error { constructor(msg) { super(msg); this.statusCode = 404; } }
class ConflictError extends Error { constructor(msg) { super(msg); this.statusCode = 409; } }

const errorMessages = {
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized',
  NOT_FOUND: 'Not found',
  CONFLICT: 'Conflict: email already exists',
};

const auth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new UnauthorizedError(errorMessages.UNAUTHORIZED));
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { _id: payload._id };
    return next();
  } catch {
    return next(new UnauthorizedError(errorMessages.UNAUTHORIZED));
  }
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) throw new NotFoundError(errorMessages.NOT_FOUND);
      res.status(200).send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  if (!name || !avatar || !email || !password) {
    return next(new BadRequestError(errorMessages.BAD_REQUEST));
  }
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      res.status(201).send(userObject);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(errorMessages.BAD_REQUEST));
      }
      if (err.code === 11000) {
        return next(new ConflictError(errorMessages.CONFLICT));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new BadRequestError(errorMessages.BAD_REQUEST));

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(() => next(new UnauthorizedError(errorMessages.UNAUTHORIZED)));
};

const updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  const updateFields = {};
  if (name) updateFields.name = name;
  if (avatar) updateFields.avatar = avatar;

  User.findByIdAndUpdate(userId, { $set: updateFields }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) throw new NotFoundError(errorMessages.NOT_FOUND);
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return next(new BadRequestError(errorMessages.BAD_REQUEST));
      return next(err);
    });
};

module.exports = { auth, getCurrentUser, createUser, login, updateProfile };
