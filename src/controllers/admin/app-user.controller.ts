import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AuthenticatedRequest } from '../../types/authenticate.type';
import { AppUserService } from '../../services/user.services';

const appUserService = new AppUserService();

export async function getAppUsers(req: AuthenticatedRequest, res: Response) {
  try {
    const response = await appUserService.getAllAppUsers();

    return res.send({
      users: response,
    });
  } catch (error) {
    console.log(error);
    throw new CustomException('Bad Request', 400);
  }
}

