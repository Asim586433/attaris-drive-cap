import { Router } from 'express';
import { getProfile, submitKyc } from '../controllers/users';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.post('/kyc', authenticate, submitKyc);

export default router;
