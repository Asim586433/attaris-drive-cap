import { Router } from 'express';
import { getCars, getCarById, addCar, updateCar, deleteCar } from '../controllers/cars';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getCars);
router.get('/:id', getCarById);
router.post('/', authenticate, requireRole(['HOST', 'ADMIN']), addCar);
router.put('/:id', authenticate, requireRole(['HOST', 'ADMIN']), updateCar);
router.delete('/:id', authenticate, requireRole(['HOST', 'ADMIN']), deleteCar);

export default router;
