import { Router } from 'express';
import { getAllUsers, activateUser } from '../controllers/admin.controller';
import { isAuthenticated, isAdmin } from '../middleware/auth.middleware';

const router = Router();

// All admin routes are protected and require 'admin' role
router.use(isAuthenticated);
router.use(isAdmin);

router.get('/users', getAllUsers);

router.patch('/users/:id/activate', activateUser);

export default router;
