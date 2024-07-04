import { Router } from 'express';
const router = Router();

// GET index
router.get('/', (req, res) => {
	res.json({ title: 'Hello World!' });
});

export default router;
