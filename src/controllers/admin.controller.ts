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

export const deactivateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await knex('users').where({ id }).first();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await knex('users').where({ id }).update({ isActive: false });

    res.status(200).json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deactivating user', error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fullName, mobilePhone, license_number } = req.body;

  try {
    const user = await knex('users').where({ id }).first();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await knex('users').where({ id }).update({ fullName, mobilePhone, license_number });

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await knex('users').where({ id }).first();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await knex('users').where({ id }).del();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};
