const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { AppError } = require('../middleware/errorHandler');

const register = async (req, res, next) => {
  try {
    const { username, email, password, bio } = req.body;
    const user = await User.create({ username, email, password, bio });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      data: { user: { id: user._id, username: user.username, email: user.email, bio: user.bio, role: user.role, createdAt: user.createdAt }, token },
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return next(new AppError(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists`, 400));
    }
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map((val) => val.message).join(', ');
      return next(new AppError(message, 400));
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new AppError('Invalid credentials', 401));
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return next(new AppError('Invalid credentials', 401));
    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      data: { user: { id: user._id, username: user.username, email: user.email, bio: user.bio, role: user.role }, token },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };