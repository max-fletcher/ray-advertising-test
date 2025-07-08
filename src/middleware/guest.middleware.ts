import { NextFunction, Response } from 'express';
import { AppAuthenticatedRequest } from '../types/authenticate.type';
import { AppUserRepository } from '../db/rdb/repositories/app-user.repository';

export const appUserGuestMiddleware = async (req: AppAuthenticatedRequest, res: Response, next: NextFunction) => {
  const userRepo = new AppUserRepository();
  const guest = await userRepo.userIsGuest(req.user!.id);

  if(guest)
    return res.status(401).json({
      data:{
        message: "You are signed up as a guest! Please purchase a tier to proceed.",
        statusCode: 401
      }
    })

  next();
};
