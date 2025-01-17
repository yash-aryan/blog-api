import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
	content: { type: String, required: true },
	createdAt: { type: Date, required: true },
	modifiedAt: Date,
	post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default model('Comment', commentSchema);
