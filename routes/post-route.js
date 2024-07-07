import { Router } from 'express';
import { checkAuth } from '../auth/passport.js';
import {
	createPost,
	editPostById,
	getAllPosts,
	getPostById,
} from './../controllers/post-controller.js';

const router = Router();

router
	.route('/:postId')
	// get post by id
	.get(getPostById)
	// edit post by id
	.put(checkAuth(), editPostById);

router
	.route('/')
	// get all posts
	.get(getAllPosts)
	// create new post
	.post(checkAuth(), createPost);

export default router;
