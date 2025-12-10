
import { Response } from 'express';
import knex from '../database/connection';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { getFeedback } from '../utils/feedback';

export const createTransaction = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.id;
  if (!user_id) {
    return res.status(401).json({ message: 'Authentication error: User ID not found.', feedback: getFeedback('auth.authErrorUserIdNotFound') });
  }

  const { amount, type, description } = req.body;

  if (!amount || !type) {
    return res.status(400).json({ message: 'Amount and type are required fields.', feedback: getFeedback('transaction.amountAndTypeRequired') });
  }

  if (type !== 'income' && type !== 'expense') {
    return res.status(400).json({ message: "Type must be either 'income' or 'expense'.", feedback: getFeedback('transaction.invalidTransactionType') });
  }

  try {
    const [newTransaction] = await knex('transactions').insert({
      user_id,
      amount,
      type,
      description,
    }).returning('*');

    res.status(201).json({newTransaction, feedback: getFeedback('transaction.transactionCreated')});
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Server error while creating transaction.', feedback: getFeedback('transaction.errorCreatingTransaction') });
  }
};

export const getTransactions = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.id;
  if (!user_id) {
    return res.status(401).json({ message: 'Authentication error: User ID not found.', feedback: getFeedback('auth.authErrorUserIdNotFound') });
  }

  try {
    
    const transactions = await knex('transactions')
      .where({ user_id })
      .orderBy('timestamp', 'desc');

    res.status(200).json({transactions, feedback: getFeedback('transaction.transactionsFetched')});
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error while fetching transactions.', feedback: getFeedback('transaction.errorFetchingTransactions') });
  }
};
