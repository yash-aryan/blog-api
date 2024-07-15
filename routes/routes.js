import { Router } from 'express';
import { checkAuth } from './../auth/passport.js';
import authRouter from './auth-route.js';
import postRouter from './post-route.js';

const router = Router();

router.use('/auth', authRouter);

router.use('/posts', postRouter);

export default router;
