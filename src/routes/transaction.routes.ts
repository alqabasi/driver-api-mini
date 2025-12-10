import { Router } from 'express';
import { createTransaction, getTransactions } from '../controllers/transactionController';
import { isAuthenticated, isDriver } from '../middleware/auth.middleware';

const router = Router();

// All transaction routes are protected and require a logged-in driver
router.use(isAuthenticated, isDriver);

router.post('/', createTransaction);
router.get('/', getTransactions);

export default router;
