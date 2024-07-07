import asyncHandler from 'express-async-handler';
import Post from './../models/post-model.js';
import { body, validationResult } from 'express-validator';
import { getPayloadFromToken } from './../auth/passport.js';

// GET all posts
export const getAllPosts = asyncHandler(async (req, res) => {
	const posts = await Post.find().populate('author').exec();
	res.json({ success: true, posts });
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

		post.save();
		res.status(201).location().json({ success: true, message: 'Post created!', post });
	}),
];

// GET single post by id
export const getPostById = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.postId).populate('author', 'comments').exec();

	if (post) return res.json({ success: true, post });

	res.status(404).json({ success: false, message: 'Post not found!' });
});

export const editPostById = [
	postValidator,
	asyncHandler(async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res
				.status(422)
				.json({ success: false, message: 'Invalid form input', errors: errors.array() });
		}

		await Post.updateOne(
			{ _id: req.params.postId },
			{
				$set: {
					title: req.body.title,
					content: req.body.content,
					modifiedAt: Date.now(),
					isPublished: req.body.publish,
				},
			}
		);

		res.status(204).json({ success: true });
	}),
];
