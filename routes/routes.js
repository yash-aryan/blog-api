import { Router } from 'express';
import passport from './../auth/passport.js';
import authRouter from './auth-route.js';
import postRouter from './post-route.js';

const router = Router();

router.get('/locked', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.status(200).json('yey');
});

router.use('/auth', authRouter);

router.use('/p', postRouter);

router.get('/', (req, res) => {
	res.json('/ not implemented');
});

export default router;
