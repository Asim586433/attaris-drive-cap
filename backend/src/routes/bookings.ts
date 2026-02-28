import { Router } from 'express';
import { createBooking, getBookings, approveBooking, cancelBooking, completeBooking } from '../controllers/bookings';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getBookings);
router.post('/', authenticate, requireRole(['GUEST']), createBooking);
router.put('/:id/approve', authenticate, requireRole(['HOST']), approveBooking);
router.put('/:id/cancel', authenticate, cancelBooking);
router.put('/:id/complete', authenticate, completeBooking);

export default router;
