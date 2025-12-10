import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../config';
import { User } from '../models/user.model';

const { secret, accessExpiry, refreshExpiry } = config.jwt;

export const generateTokens = (user: User) => {
  // `accessExpiry` and `refreshExpiry` are now guaranteed to be numbers from the config file.
  const accessTokenOptions: SignOptions = { expiresIn: accessExpiry };
  const refreshTokenOptions: SignOptions = { expiresIn: refreshExpiry };

  const accessToken = jwt.sign({ id: user.id, role: user.role }, secret, accessTokenOptions);
  const refreshToken = jwt.sign({ id: user.id }, secret, refreshTokenOptions);

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
