import { Router } from 'express';
import { checkAuth } from '../auth/passport.js';
import {
	createComment,
	deleteCommentById,
	editCommentById,
	getAllPostComments,
	getCommentById,
} from '../controllers/comment-controller.js';

const router = Router({ mergeParams: true });

router
	.route('/:commentId')
	// get comment
	.get(getCommentById)
	// edit comment
	.put(checkAuth(), editCommentById)
	// delete comment
	.delete(checkAuth(), deleteCommentById);

router
	.route('/')
	// get all post comments
	.get(getAllPostComments)
	// create new comment
	.post(checkAuth(), createComment);

export default router;
