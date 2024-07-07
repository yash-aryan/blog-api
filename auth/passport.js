import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from './../models/user-model.js';

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.LOGIN_SECRET,
};

const jwtStrategy = new Strategy(opts, async (payload, done) => {
	const userExists = await User.exists({ _id: payload.id }).exec();

	if (userExists) return done(null, true);

	done(null, false);
});

passport.use(jwtStrategy);

export function generateToken(user = {}) {
	return jwt.sign({ id: user.id }, process.env.LOGIN_SECRET, {
		expiresIn: '1d',
	});
}

export function checkAuth() {
	// Protects routes from unauthenticated users
	return passport.authenticate('jwt', { session: false });
}

export function getPayloadFromToken(req) {
	const authHeader = req.headers['authorization'];
	const token = authHeader.split(' ')[1];
	return jwt.verify(token, process.env.LOGIN_SECRET);
}

export default passport;
