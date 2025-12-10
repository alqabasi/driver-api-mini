import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import knex from '../database/connection';
import { getFeedback } from '../utils/feedback';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';

export const register = async (req: Request, res: Response) => {
  const { fullName, mobilePhone, password } = req.body;

  if (!fullName || !mobilePhone || !password) {
    return res.status(400).json({ message: 'All fields are required', feedback: getFeedback('auth.allFieldsRequired') });
  }
  
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [userId] = await knex('users').insert({
      fullName,
      mobilePhone,
      password: hashedPassword,
      role: 'driver',
      isActive: false,
    });

    res.status(201).json({ message: 'Driver registered successfully. Please wait for admin approval.', feedback: getFeedback('auth.driverRegistered'), userId });
  } catch (error) {
    res.status(500).json({ message: 'Error registering driver', feedback: getFeedback('auth.errorRegisteringDriver'), error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { mobilePhone, password } = req.body;
  
  if (!mobilePhone || !password) {
    return res.status(400).json({ message: 'Mobile phone and password are required', feedback: getFeedback('auth.mobileAndPasswordRequired') });
  }

  try {
    const user = await knex('users').where({ mobilePhone }).first();

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials', feedback: getFeedback('auth.invalidCredentials') });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account not activated. Please contact an administrator.', feedback: getFeedback('auth.accountNotActivated') });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials', feedback: getFeedback('auth.invalidCredentials') });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    const role = user.role;

    res.status(200).json({ token, role, feedback: getFeedback('auth.loginSuccess') });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', feedback: getFeedback('auth.errorLoggingIn'), error });
  }
};
