import { Schema, model } from 'mongoose';

const userSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true, minLength: 12 },
	posts: [{ type: Schema.Types.ObjectId, ref: 'Post', default: [] }],
});

export default model('User', userSchema);
