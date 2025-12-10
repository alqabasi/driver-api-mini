import { Router } from 'express';
import { openDay, closeDay, getCurrentDay } from '../controllers/driverController';
import { isAuthenticated, isDriver } from '../middleware/auth.middleware';

const router = Router();

router.post('/day/open', isAuthenticated, isDriver, openDay);
router.post('/day/close', isAuthenticated, isDriver, closeDay);
router.get('/day/current', isAuthenticated, isDriver, getCurrentDay);

export default router;
