import { sign, TokenExpiredError } from 'jsonwebtoken';
import { getEnvVar } from './common.utils';
import { UserPayload } from '../schema/token-payload.schema';
import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = getEnvVar('JWT_SECRET');
const expiresIn = Number(getEnvVar('JWT_EXPIRY'));

export function generateToken(payload: UserPayload): string {
  return sign(payload, getEnvVar('JWT_SECRET'), {
    expiresIn: `${expiresIn} days`,
  });
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];

    const token: string = authHeader?.split(' ')[1] ?? '';

    jwt.verify(token, JWT_SECRET as string, (err) => {
      if (err) {
        if (err instanceof TokenExpiredError) {
          return res.status(401).json({ message: 'Token expired' });
        }
        return res.sendStatus(403).json({
          message: 'Unauthorized access',
        });
      }

      next();
    });

    if (token == null) {
      res.sendStatus(401);
      return;
    }
  } catch (error) {
    res.sendStatus(403);
    throw new TokenExpiredError('Token Expired', new Date());
  }
}
