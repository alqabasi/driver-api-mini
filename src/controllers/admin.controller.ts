import { Request, Response } from 'express';
import knex from '../database/connection';
import { getFeedback } from '../utils/feedback';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await knex('users').select('id', 'fullName', 'mobilePhone', 'role', 'isActive');
    res.status(200).json({users, feedback: getFeedback('admin.usersFetched')});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', feedback: getFeedback('admin.errorFetchingUsers'), error });
  }
};

export const activateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await knex('users').where({ id }).first();

    if (!user) {
      return res.status(404).json({ message: 'User not found', feedback: getFeedback('admin.userNotFound') });
    }

    await knex('users').where({ id }).update({ isActive: true });

    res.status(200).json({ message: 'User activated successfully', feedback: getFeedback('admin.userActivated') });
  } catch (error) {
    res.status(500).json({ message: 'Error activating user', feedback: getFeedback('admin.errorActivatingUser'), error });
  }
};

export const deactivateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await knex('users').where({ id }).first();

    if (!user) {
      return res.status(404).json({ message: 'User not found', feedback: getFeedback('admin.userNotFound') });
    }

    await knex('users').where({ id }).update({ isActive: false });

    res.status(200).json({ message: 'User deactivated successfully', feedback: getFeedback('admin.userDeactivated') });
  } catch (error) {
    res.status(500).json({ message: 'Error deactivating user', feedback: getFeedback('admin.errorDeactivatingUser'), error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fullName, mobilePhone, license_number } = req.body;

  try {
    const user = await knex('users').where({ id }).first();

    if (!user) {
      return res.status(404).json({ message: 'User not found', feedback: getFeedback('admin.userNotFound') });
    }

    await knex('users').where({ id }).update({ fullName, mobilePhone, license_number });

    res.status(200).json({ message: 'User updated successfully', feedback: getFeedback('admin.userUpdated') });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', feedback: getFeedback('admin.errorUpdatingUser'), error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await knex('users').where({ id }).first();

    if (!user) {
      return res.status(404).json({ message: 'User not found', feedback: getFeedback('admin.userNotFound') });
    }

    await knex('users').where({ id }).del();

    res.status(200).json({ message: 'User deleted successfully', feedback: getFeedback('admin.userDeleted') });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', feedback: getFeedback('admin.errorDeletingUser'), error });
  }
};
