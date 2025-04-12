const express = require('express');
const postRouter = express.Router();
const PostController = require('../controllers/backend/postController');

postRouter.get('/post/add',PostController.getAddPost);
postRouter.post('/post/add',PostController.postAdd);
postRouter.get('/post/list',PostController.getPostList);

postRouter.post('/post/delete/:id',PostController.deletePost);

postRouter.get('/post/edit/:id',PostController.editPost);
postRouter.post('/post/edit',PostController.postEdit);

postRouter.get('/post/view/:id',PostController.viewPost);



module.exports = postRouter;