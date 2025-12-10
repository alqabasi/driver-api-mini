
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service';

interface DecodedToken {
  id: string;
  role: string;
}

export const rbac = (permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')?.[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token is missing' });
    }

    const decoded = verifyToken(token) as DecodedToken;

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid access token' });
    }

    // In a real application, you would fetch the user's permissions from the database
    // and check if they have the required permissions.
    // For this example, we will just check the user's role.

    if (!permissions.includes(decoded.role)) {
      return res.status(403).json({ message: 'You do not have permission to access this resource' });
    }

    next();
  };
};