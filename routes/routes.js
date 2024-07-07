import { Router } from 'express';
import { checkAuth } from './../auth/passport.js';
import authRouter from './auth-route.js';
import postRouter from './post-route.js';

const router = Router();

router.get('/locked', checkAuth(), (req, res) => {
	res.status(200).json('yey');
});

router.use('/auth', authRouter);

router.use('/posts', postRouter);

export default router;
