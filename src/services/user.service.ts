import { db } from '../config/database';
import { User } from '../models/user.model';

export const findUserByMobile = async (mobile: string): Promise<User | null> => {
  return db('users').where({ mobile }).first();
};
