import { Schema, model } from 'mongoose';

const postSchema = new Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	createdAt: { type: Date, required: true },
	modifiedAt: Date,
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	comments: { type: [Schema.Types.ObjectId], ref: 'Comment', default: [] },
	isPublished: { type: Boolean, required: true, default: false },
});

export default model('Post', postSchema);
