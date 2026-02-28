import { Router } from 'express';
import { getAnalytics, getUsers, suspendUser, approveUserKyc, getAdminCars } from '../controllers/admin';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireRole(['ADMIN']));

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.put('/users/:id/suspend', suspendUser);
router.put('/users/:id/kyc-approve', approveUserKyc);
router.get('/cars', getAdminCars);

export default router;
