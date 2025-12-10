
import { Response } from 'express';
import knex from '../database/connection';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const createTransaction = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.id;
  if (!user_id) {
    return res.status(401).json({ message: 'Authentication error: User ID not found.' });
  }

  const { amount, type, description } = req.body;

  if (!amount || !type) {
    return res.status(400).json({ message: 'Amount and type are required fields.' });
  }

  if (type !== 'income' && type !== 'expense') {
    return res.status(400).json({ message: "Type must be either 'income' or 'expense'." });
  }

  try {
    const [newTransaction] = await knex('transactions').insert({
      user_id,
      amount,
      type,
      description,
    }).returning('*');

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Server error while creating transaction.' });
  }
};

export const getTransactions = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.id;
  if (!user_id) {
    return res.status(401).json({ message: 'Authentication error: User ID not found.' });
  }

  try {
    
    const transactions = await knex('transactions')
      .where({ user_id })
      .orderBy('timestamp', 'desc');

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error while fetching transactions.' });
  }
};
