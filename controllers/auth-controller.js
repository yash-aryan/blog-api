import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { generateToken } from './../auth/passport.js';
import User from './../models/user-model.js';

// POST login
export const loginUser = asyncHandler(async (req, res) => {
	const user = await User.findOne({ email: req.body.email }).exec();

	if (user) {
		const isMatch = await bcrypt.compare(req.body.password, user.password);
		if (isMatch) {
			const token = generateToken({ id: user.id });
			return res.status(200).json({ success: true, message: 'Auth Passed!', token });
		}
	}

	return res.status(401).json({ success: false, message: 'Auth Failed!' });
});

// POST register
const userValidator = [
	body('username')
		.trim()
		.isLength({ min: 3 })
		.withMessage('Username must contain at least 3 characters!')
		.custom(async value => {
			const user = await User.findOne({ name: value }).exec();

			if (user) throw new Error('Username is already in use!');
		})
		.escape(),
	body('email')
		.trim()
		.toLowerCase()
		.isEmail()
		.withMessage('Email should be valid!')
		.custom(async value => {
			const user = await User.findOne({ email: value }).exec();

			if (user) throw new Error('Email already in use!');
		})
		.escape(),
	body(
		'password',
		'Password should contain at least 12 characters with 1 uppercase, 1 number, and 1 symbol'
	)
		.trim()
		.isStrongPassword({ minLength: 12, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
];

export const registerUser = [
	userValidator,
	asyncHandler(async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res
				.status(422)
				.json({ success: false, message: 'Invalid form input', errors: errors.array() });
		}

		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		const user = new User({
			name: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		});
		const savedUser = await user.save();
		const token = generateToken({ id: savedUser.id });
		res.status(200).json({ success: true, message: 'User registered!', user: savedUser, token });
	}),
];
