import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.LOGIN_SECRET,
};

const jwtStrategy = new Strategy(opts, (payload, done) => {
	console.log(payload);
	if (payload.id === 0) return done(null, true);

	done(null, false);
});

passport.use(jwtStrategy);

export function generateToken(user = {}) {
	return jwt.sign({ id: user.id }, process.env.LOGIN_SECRET, {
		expiresIn: '2 days',
	});
}

export default passport;
