import { Router } from 'express';
import { generateToken } from './../auth/passport.js';

const router = Router();

router.post('/register', (req, res) => {});

router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	// check db for matching user
	if (email === 'a@a.com' && password === 'a') {
		const token = generateToken({ id: 0 });
		return res.status(200).json({ success: true, message: 'Auth Passed!', token });
	}
	return res.status(401).json({ success: false, message: 'Auth Failed!' });
});

export default router;
