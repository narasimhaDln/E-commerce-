import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getMe,
  updateMe,
  getMyCartHistory,
} from '../controllers/user.controller.js';

const router = Router();

router.use(requireAuth);
router.get('/me', getMe);
router.put('/me', updateMe);
router.get('/me/history', getMyCartHistory);

export default router;
