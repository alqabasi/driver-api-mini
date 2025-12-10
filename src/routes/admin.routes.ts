import { Router } from 'express';
import { getAllUsers, activateUser, deactivateUser, updateUser, deleteUser } from '../controllers/admin.controller';
import { isAuthenticated, isAdmin } from '../middleware/auth.middleware';

const router = Router();

// All admin routes are protected and require 'admin' role
router.use(isAuthenticated);
router.use(isAdmin);

router.get('/users', getAllUsers);

router.patch('/users/:id/activate', activateUser);

router.patch('/users/:id/deactivate', deactivateUser);

router.put('/users/:id', updateUser);

router.delete('/users/:id', deleteUser);

export default router;
