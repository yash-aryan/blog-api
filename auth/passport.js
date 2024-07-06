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

export default passport;
