import asyncHandler from 'express-async-handler';
import Post from './../models/post-model.js';

export const getAllPosts = asyncHandler(async (req, res) => {
	const posts = await Post.find().populate('author', 'comments').exec();
	res.json(posts);
});
