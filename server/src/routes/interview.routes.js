import express from 'express';
import { start, answer, getHistory, getById } from '../controllers/interview.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/start', protect, start);
router.post('/:id/answer', protect, answer);
router.get('/history', protect, getHistory);
router.get('/:id', protect, getById);

export default router;
