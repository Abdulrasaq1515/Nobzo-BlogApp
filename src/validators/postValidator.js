const { body } = require('express-validator');

const createPostValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('content').trim().notEmpty().withMessage('Content is required').isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('excerpt').optional().trim().isLength({ max: 500 }).withMessage('Excerpt cannot exceed 500 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*').optional().trim().notEmpty().withMessage('Tag cannot be empty'),
  body('status').optional().isIn(['draft', 'published']).withMessage('Status must be either draft or published'),
];

const updatePostValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('content').optional().trim().notEmpty().withMessage('Content cannot be empty').isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('excerpt').optional().trim().isLength({ max: 500 }).withMessage('Excerpt cannot exceed 500 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*').optional().trim().notEmpty().withMessage('Tag cannot be empty'),
  body('status').optional().isIn(['draft', 'published']).withMessage('Status must be either draft or published'),
];

module.exports = { createPostValidation, updatePostValidation };