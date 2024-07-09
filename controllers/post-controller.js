import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Post from './../models/post-model.js';
import { body, validationResult } from 'express-validator';
import { getPayloadFromToken } from './../auth/passport.js';

// GET all posts
export const getAllPosts = asyncHandler(async (req, res) => {
	const posts = await Post.find().populate('author').exec();
	res.json({ success: true, posts });
});

// GET post by id
export const getPostById = asyncHandler(async (req, res) => {
	const postId = req.params.postId;

	if (!mongoose.Types.ObjectId.isValid(postId)) {
		return res.status(404).json({ success: false, message: 'Post not found!' });
	}

	const post = await Post.findById(postId).populate('author').exec();

	if (!post) return res.status(404).json({ success: false, message: 'Post not found!' });

	res.json({ success: true, post });
});

// POST create new post
const postValidator = [
	body('title')
		.trim()
		.isLength({ min: 1, max: 64 })
		.withMessage('Title must contain between 1 to 64 characters!')
		.escape(),
	body('content')
		.trim()
		.isLength({ min: 1, max: 255 })
		.withMessage('Content must contain between 1 to 255 characters!')
		.escape(),
	body('publish').optional().isBoolean({ strict: true }),
];

export const createPost = [
	postValidator,
	asyncHandler(async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res
				.status(422)
				.json({ success: false, message: 'Invalid form input', errors: errors.array() });
		}

		const userId = getPayloadFromToken(req).id;
		const post = new Post({
			title: req.body.title,
			content: req.body.content,
			createdAt: Date.now(),
			author: userId,
			isPublished: req.body.publish,
		});

		const savedPost = await post.save();
		res
			.status(201)
			.location('/' + savedPost.id)
			.json({ success: true, message: 'Post created!', post });
	}),
];

// PUT edit post by id
export const editPostById = [
	asyncHandler(async (req, res, next) => {
		// Check to end response early with error 404
		const postId = req.params.postId;

		if (!mongoose.Types.ObjectId.isValid(postId)) {
			return res.status(404).json({ success: false, message: 'Post not found!' });
		}

		const post = await Post.findById(postId).exec();

		if (!post) {
			return res.status(404).json({ success: false, message: 'Post not found!' });
		}

		res.locals.post = post;
		next();
	}),
	postValidator,
	asyncHandler(async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res
				.status(422)
				.json({ success: false, message: 'Invalid form input', errors: errors.array() });
		}

		const { post } = res.locals;

		await post.updateOne({
			$set: {
				title: req.body.title,
				content: req.body.content,
				modifiedAt: Date.now(),
				isPublished: req.body.publish,
			},
		});

		res.status(204).json();
	}),
];

// DELETE post by id
export const deletePostById = asyncHandler(async (req, res) => {
	const postId = req.params.postId;

	if (!mongoose.Types.ObjectId.isValid(postId)) {
		return res.status(404).json({ success: false, message: 'Post not found!' });
	}

	const post = await Post.findById(postId).exec();

	if (!post) {
		return res.status(404).json({ success: false, message: 'Post not found!' });
	}

	await post.deleteOne();
	res.status(204).json({ success: true });
});
