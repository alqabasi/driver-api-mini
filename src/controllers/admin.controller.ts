import { Request, Response } from 'express';
import knex from '../database/connection';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await knex('users').select('id', 'fullName', 'mobilePhone', 'role', 'isActive');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const activateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await knex('users').where({ id }).first();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await knex('users').where({ id }).update({ isActive: true });

    res.status(200).json({ message: 'User activated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error activating user', error });
  }
};
