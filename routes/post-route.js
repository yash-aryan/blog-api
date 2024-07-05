import { Router } from 'express';
import { getAllPosts } from './../controllers/post-controller.js'; 

const router = Router();

// GET all posts
router.get('/', getAllPosts);

export default router;
