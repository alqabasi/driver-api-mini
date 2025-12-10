import { Response } from 'express';
import knex from '../database/connection';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { getFeedback } from '../utils/feedback';

export const openDay = async (req: AuthenticatedRequest, res: Response) => {
  const driver_id = req.user?.id;
  if (!driver_id) {
    return res.status(401).json({ message: 'Authentication error: User ID not found.', feedback: getFeedback('auth.authErrorUserIdNotFound') });
  }

  const today = new Date().toISOString().slice(0, 10);

  try {
    const existingDay = await knex('driver_days')
      .where({ driver_id, status: 'open' })
      .first();

    if (existingDay) {
      return res.status(400).json({ message: 'You already have an open day that must be closed first.', feedback: getFeedback('driver.dayAlreadyOpen') });
    }

    const [newDay] = await knex('driver_days').insert({
      driver_id,
      date: today,
      status: 'open',
      opened_at: new Date().toISOString()
    }).returning('*');

    res.status(201).json({newDay, feedback: getFeedback('driver.dayOpened')});
  } catch (error) {
    console.error('Error opening day:', error);
    res.status(500).json({ message: 'Server error while opening day.', feedback: getFeedback('driver.errorOpeningDay') });
  }
};

export const closeDay = async (req: AuthenticatedRequest, res: Response) => {
  const driver_id = req.user?.id;
  if (!driver_id) {
    return res.status(401).json({ message: 'Authentication error: User ID not found.', feedback: getFeedback('auth.authErrorUserIdNotFound') });
  }
  
  try {
    const day = await knex('driver_days')
      .where({ driver_id, status: 'open' })
      .orderBy('opened_at', 'desc')
      .first();

    if (!day) {
      return res.status(404).json({ message: 'No open day found to close.', feedback: getFeedback('driver.noOpenDayToClose') });
    }

    const [updatedDay] = await knex('driver_days')
      .where({ id: day.id })
      .update({
        status: 'closed',
        closed_at: new Date().toISOString(),
      })
      .returning('*');

    res.status(200).json({updatedDay, feedback: getFeedback('driver.dayClosed')});
  } catch (error) {
    console.error('Error closing day:', error);
    res.status(500).json({ message: 'Server error while closing day.', feedback: getFeedback('driver.errorClosingDay') });
  }
};

export const getCurrentDay = async (req: AuthenticatedRequest, res: Response) => {
  const driver_id = req.user?.id;
  if (!driver_id) {
    return res.status(401).json({ message: 'Authentication error: User ID not found.', feedback: getFeedback('auth.authErrorUserIdNotFound') });
  }

  try {
    const day = await knex('driver_days')
      .where({ driver_id })
      .orderBy('opened_at', 'desc')
      .first();

    if (!day) {
      return res.status(404).json({ message: 'No work day records found.', feedback: getFeedback('driver.noWorkDayFound') });
    }

    res.status(200).json({day, feedback: getFeedback('driver.currentDayFetched')});
  } catch (error) {
    console.error('Error getting current day:', error);
    res.status(500).json({ message: 'Server error while fetching current day.', feedback: getFeedback('driver.errorFetchingCurrentDay') });
  }
};
