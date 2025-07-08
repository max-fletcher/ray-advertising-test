import { sign, TokenExpiredError } from 'jsonwebtoken';
import { getEnvVar } from './common.utils';
import { AppUserPayload } from '../schema/token-payload.schema';
import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomException } from '../errors/CustomException.error';

const JWT_SECRET = getEnvVar('JWT_SECRET');
const expiresIn = Number(getEnvVar('JWT_EXPIRY'));

export function generateToken(payload: AppUserPayload): string {
  return sign(payload, getEnvVar('JWT_SECRET'), {
    expiresIn: `${expiresIn} days`,
  });
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];

    const token: string = authHeader?.split(' ')[1] ?? '';

    if (!token) {
      return res.status(401).json({
        error:{
          message: 'No token provided',
        },
        statusCode: 401,
      });
    }

    jwt.verify(token, JWT_SECRET as string, (err) => {
      if (err) {
        if (err instanceof TokenExpiredError) {
          return res.status(401).json({
            error:{
              message: 'Token expired',
            },
            statusCode: 401,
          });
        }

        return res.status(403).json({
          error:{
            message: 'Unauthorized access',
          },
          statusCode: 403,
        });
      }

      return next();
    });
  } catch (e) {
    if (e instanceof CustomException)
      return res.status(e.statusCode).json({
        error:{
          message: e.message,
        },
        statusCode: e.statusCode,
      });


    return res.status(500).json({
      error:{
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}
