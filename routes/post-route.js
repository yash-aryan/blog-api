import { Router } from 'express';
import { checkAuth } from '../auth/passport.js';
import {
	createPost,
	deletePostById,
	editPostById,
	getAllPosts,
	getPostById,
} from './../controllers/post-controller.js';
import commentRouter from './comment-route.js';

const router = Router();

router
	.use('/:postId/comments', commentRouter)
	.route('/:postId')
	// get post
	.get(getPostById)
	// edit post
	.put(checkAuth(), editPostById)
	// delete post
	.delete(checkAuth(), deletePostById);

router
	.route('/')
	// get all posts
	.get(getAllPosts)
	// create new post
	.post(checkAuth(), createPost);

export default router;
