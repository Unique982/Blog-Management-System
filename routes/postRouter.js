const express = require('express');
const postRouter = express.Router();
const PostController = require('../controllers/backend/postController');

postRouter.get('/post/add',PostController.getAddPost);
postRouter.post('/post/add',PostController.postAdd);

module.exports = postRouter;