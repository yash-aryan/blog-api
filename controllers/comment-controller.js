import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Post from './../models/post-model.js';
import Comment from './../models/comment-model.js';
import { body, validationResult } from 'express-validator';
import { getPayloadFromToken } from './../auth/passport.js';

// GET all post comments
export const getAllPostComments = asyncHandler(async (req, res) => {
	const postId = req.params.postId;

	if (!mongoose.Types.ObjectId.isValid(postId)) {
		return res.status(404).json({ success: false, message: 'Post not found!' });
	}

	const post = await Post.findById(postId).exec();
	if (!post) {
		return res.status(404).json({ success: false, message: 'Post not found!' });
	}

	const comments = await Comment.find({ post: postId }).exec();

	res.json({
		success: true,
		comments: comments,
	});
});

// GET comment by id
export const getCommentById = asyncHandler(async (req, res) => {
	const postId = req.params.postId;
	const commentId = req.params.commentId;

	if (!mongoose.Types.ObjectId.isValid(postId)) {
		return res.status(404).json({ success: false, message: 'Post not found!' });
	}
	if (!mongoose.Types.ObjectId.isValid(commentId)) {
		return res.status(404).json({ success: false, message: 'Comment not found!' });
	}

	const comment = await Comment.findOne({ _id: commentId, post: postId }).exec();

	if (!comment) {
		return res.status(404).json({ success: false, message: 'Comment not found!' });
	}

	res.json({ success: true, comment });
});

// POST create new comment
const commentValidator = [
	body('content')
		.trim()
		.isLength({ min: 1, max: 255 })
		.withMessage('Comment must contain between 1 to 255 characters!')
		.escape(),
];

export const createComment = [
	commentValidator,
	asyncHandler(async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res
				.status(422)
				.json({ success: false, message: 'Invalid form input', errors: errors.array() });
		}

		const userId = getPayloadFromToken(req).id;
		const comment = new Comment({
			content: req.body.content,
			createdAt: Date.now(),
			author: userId,
			post: req.params.postId,
		});

		const savedComment = await comment.save();
		res
			.status(201)
			.location('/' + savedComment.id)
			.json({ success: true, message: 'Comment created!', comment });
	}),
];

// PUT edit comment by id
export const editCommentById = [
	asyncHandler(async (req, res, next) => {
		// Check to end response early with error 404
		const postId = req.params.postId;
		const commentId = req.params.commentId;

		if (!mongoose.Types.ObjectId.isValid(postId)) {
			return res.status(404).json({ success: false, message: 'Post not found!' });
		}
		if (!mongoose.Types.ObjectId.isValid(commentId)) {
			return res.status(404).json({ success: false, message: 'Comment not found!' });
		}

		const comment = await Comment.findOne({ _id: commentId, post: postId }).exec();

		if (!comment) {
			return res.status(404).json({ success: false, message: 'Comment not found!' });
		}

		res.locals.comment = comment;
		next();
	}),
	commentValidator,
	asyncHandler(async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res
				.status(422)
				.json({ success: false, message: 'Invalid form input', errors: errors.array() });
		}
		const { comment } = res.locals;

		await comment.updateOne({
			$set: {
				content: req.body.content,
				modifiedAt: Date.now(),
			},
		});

		res.status(204).json();
	}),
];

// DELETE comment by id
export const deleteCommentById = asyncHandler(async (req, res) => {
	const postId = req.params.postId;
	const commentId = req.params.commentId;

	if (!mongoose.Types.ObjectId.isValid(postId)) {
		return res.status(404).json({ success: false, message: 'Post not found!' });
	}
	if (!mongoose.Types.ObjectId.isValid(commentId)) {
		return res.status(404).json({ success: false, message: 'Comment not found!' });
	}

	const comment = await Comment.findOne({ _id: commentId, post: postId }).exec();

	if (!comment) {
		return res.status(404).json({ success: false, message: 'Comment not found!' });
	}

	await comment.deleteOne();
	res.status(204).json({ success: true });
});
