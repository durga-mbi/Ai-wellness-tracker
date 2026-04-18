import express from 'express';
import rateLimit from 'express-rate-limit';
import * as forumController from '../controllers/forum.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

const likeLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 15, // limit each IP to 15 requests per windowMs
    message: "Too many likes from this IP, please try again after a minute",
    standardHeaders: true, 
    legacyHeaders: false,
});

router.get('/', protect, forumController.getPosts);
router.post('/', protect, forumController.createPost);
router.post('/:id/like', protect, likeLimiter, forumController.likePost);
router.post('/:id/report', protect, forumController.reportPost);

export default router;
