const Post = require('../models/Post');
const { AppError } = require('../middleware/errorHandler');

const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, tags, author, status, sortBy = 'publishedAt', order = 'desc' } = req.query;
    const query = { deletedAt: null };

    if (req.user) {
      if (status) {
        query.status = status;
        if (status === 'draft') query.author = req.user._id;
      } else {
        query.$or = [{ status: 'published' }, { status: 'draft', author: req.user._id }];
      }
    } else {
      query.status = 'published';
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: 'i' } }, { content: { $regex: search, $options: 'i' } }];
    }
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    if (author) query.author = author;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const posts = await Post.find(query).populate('author', 'username email bio').sort(sort).limit(parseInt(limit)).skip(skip);
    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    let post = await Post.findOne({ $or: [{ _id: id }, { slug: id }], deletedAt: null }).populate('author', 'username email bio');
    if (!post) return next(new AppError('Post not found', 404));
    if (post.status === 'draft') {
      if (!req.user || post.author._id.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized to access this post', 403));
      }
    }
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, tags, status } = req.body;
    const post = await Post.create({ title, content, excerpt, tags, status, author: req.user._id });
    const populatedPost = await Post.findById(post._id).populate('author', 'username email bio');
    res.status(201).json({ success: true, data: populatedPost });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map((val) => val.message).join(', ');
      return next(new AppError(message, 400));
    }
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, tags, status } = req.body;
    let post = await Post.findOne({ _id: id, deletedAt: null });
    if (!post) return next(new AppError('Post not found', 404));
    if (post.author.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to update this post', 403));
    }
    if (title) post.title = title;
    if (content) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (tags) post.tags = tags;
    if (status) post.status = status;
    await post.save();
    post = await Post.findById(post._id).populate('author', 'username email bio');
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid post ID', 400));
    }
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map((val) => val.message).join(', ');
      return next(new AppError(message, 400));
    }
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ _id: id, deletedAt: null });
    if (!post) return next(new AppError('Post not found', 404));
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete this post', 403));
    }
    post.deletedAt = new Date();
    await post.save();
    res.status(200).json({ success: true, data: {}, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getMyPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { author: req.user._id, deletedAt: null };
    if (status) query.status = status;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const posts = await Post.find(query).populate('author', 'username email bio').sort({ createdAt: -1 }).limit(parseInt(limit)).skip(skip);
    const total = await Post.countDocuments(query);
    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPosts, getPost, createPost, updatePost, deletePost, getMyPosts };