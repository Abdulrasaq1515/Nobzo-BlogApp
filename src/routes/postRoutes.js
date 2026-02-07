const express = require('express');
const router = express.Router();
const { getPosts, getPost, createPost, updatePost, deletePost, getMyPosts } = require('../controllers/postController');
const { protect, optionalAuth } = require('../middleware/auth');
const { createPostValidation, updatePostValidation } = require('../validators/postValidator');
const validate = require('../middleware/validate');

router.get('/', optionalAuth, getPosts);
router.get('/user/my-posts', protect, getMyPosts);
router.get('/:id', optionalAuth, getPost);
router.post('/', protect, createPostValidation, validate, createPost);
router.put('/:id', protect, updatePostValidation, validate, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;