import express from 'express';
import * as forumController from '../controllers/forum.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect, forumController.getPosts);
router.post('/', protect, forumController.createPost);
router.post('/:id/like', protect, forumController.likePost);
router.post('/:id/report', protect, forumController.reportPost);

export default router;
