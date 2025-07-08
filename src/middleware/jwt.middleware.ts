import { NextFunction, Response } from 'express';
import { sign, TokenExpiredError, verify } from 'jsonwebtoken';
import { AdminUserRepository } from '../db/rdb/repositories/admin-user.repository';
import { AppUserPayload, UserPayload } from '../schema/token-payload.schema';
import {
  AppAuthenticatedRequest,
  AuthenticatedRequest,
} from '../types/authenticate.type';
import { getEnvVar } from '../utils/common.utils';
import { AppUserRepository } from '../db/rdb/repositories/app-user.repository';
import { datetimeYMDHis } from '../utils/datetime.utils';

export class JwtMiddleware {
  generateToken(payload: UserPayload): string {
    const expiresIn = Number(getEnvVar('JWT_EXPIRY'));
    return sign(payload, getEnvVar('JWT_SECRET'), {
      expiresIn: `${expiresIn} days`,
    });
  }

  async verifyToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader?.startsWith('Bearer '))
        return res.status(401).json({ message: 'You are not logged in!' });

      const token = authHeader.split(' ')[1];

      const payload = verify(token, getEnvVar('JWT_SECRET'));

      if (payload) {
        req.user = payload as UserPayload;
        const adminRepo = new AdminUserRepository();
        const checkUser = await adminRepo.findUserById(req.user.id);

        if (!checkUser) {
          throw new TokenExpiredError('Invalid Token Data', new Date());
        }

        next();
      } else {
        throw new TokenExpiredError('Token Expired', new Date());
      }
    } catch (e: any) {
      if (e instanceof TokenExpiredError)
        return res.status(401).json({ message: e.message });

      return res
        .status(500)
        .json({ message: 'Something went wrong! Please try again.' });
    }
  }

  generateAppUserToken(payload: AppUserPayload): {
    token: string;
    validity: string;
  } {
    const expiresIn = Number(getEnvVar('JWT_EXPIRY'));
    return {
      token: sign(payload, getEnvVar('JWT_SECRET'), {
        expiresIn: `${expiresIn} days`,
      }),
      validity: datetimeYMDHis(null, 'days', expiresIn),
    };
  }

  async verifyAppUserToken(
    req: AppAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader?.startsWith('Bearer '))
        return res.status(401).json({ message: 'You are not logged in!' });

      const token = authHeader.split(' ')[1];

      const payload = verify(token, getEnvVar('JWT_SECRET'));

      if (payload) {
        req.user = payload as AppUserPayload;
        const userRepo = new AppUserRepository();
        const checkUser = await userRepo.userExistsById(req.user.id);

        if (checkUser === 0) {
          throw new TokenExpiredError('Invalid token provided!', new Date());
        }

        next();
      } else {
        throw new TokenExpiredError(
          'Auth token expired! Please login again.',
          new Date(),
        );
      }
    } catch (e: any) {
      if (e instanceof TokenExpiredError)
        return res.status(401).json({ message: e.message });

      return res
        .status(500)
        .json({ message: 'Something went wrong! Please try again.' });
    }
  }

  async optionalVerifyAppUserToken(
    req: AppAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader?.startsWith('Bearer ')){
        const token = authHeader.split(' ')[1];
  
        const payload = verify(token, getEnvVar('JWT_SECRET')) as any;
        if (payload) {
          req.user = payload as AppUserPayload;
          if(!payload.device_id){
            const userRepo = new AppUserRepository();
            const checkUser = await userRepo.userExistsById(req.user.id);
  
            if (checkUser === 0)
              throw new TokenExpiredError('Invalid token provided!', new Date());
  
            next();
          }
        } else {
          throw new TokenExpiredError(
            'Auth token expired! Please login again.',
            new Date(),
          );
        }
      }
      else{
        next();
      }
    } catch (e: any) {
      if (e instanceof TokenExpiredError)
        return res.status(401).json({ message: e.message });

      return res
        .status(500)
        .json({ message: 'Something went wrong! Please try again.' });
    }
  }
}
