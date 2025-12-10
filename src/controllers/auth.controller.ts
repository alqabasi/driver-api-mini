import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import knex from '../database/connection';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';

export const register = async (req: Request, res: Response) => {
  const { fullName, mobilePhone, password, license_number } = req.body;

  if (!fullName || !mobilePhone || !password || !license_number) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [userId] = await knex('users').insert({
      fullName,
      mobilePhone,
      password: hashedPassword,
      role: 'driver', // Drivers register themselves, so the role is 'driver'
      isActive: false, // Accounts are inactive until an admin approves them
      license_number,
    });

    res.status(201).json({ message: 'Driver registered successfully. Please wait for admin approval.', userId });
  } catch (error) {
    res.status(500).json({ message: 'Error registering driver', error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { mobilePhone, password } = req.body;

  if (!mobilePhone || !password) {
    return res.status(400).json({ message: 'Mobile phone and password are required' });
  }

  try {
    const user = await knex('users').where({ mobilePhone }).first();

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account not activated. Please contact an administrator.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};
