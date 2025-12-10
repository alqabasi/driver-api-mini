import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new driver
 *     description: Allows a new user to register as a driver. The account will be inactive until an admin approves it.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               mobilePhone:
 *                 type: string
 *               password:
 *                 type: string
 *               license_number:
 *                 type: string
 *     responses:
 *       201: 
 *         description: Driver registered successfully
 *       400:
 *         description: All fields are required
 */
router.post('/register', register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login for all user types
 *     description: Authenticates a user (admin or driver) and returns a JWT token if credentials are valid and the account is active.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobilePhone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Account not activated
 */
router.post('/login', login);

export default router;
