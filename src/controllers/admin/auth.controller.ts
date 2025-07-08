import { formatUserResponse } from '../../utils/response.utils';
import { UserPayload } from '../../schema/token-payload.schema';
import { AdminAuthService } from '../../services/admin/auth.service';
import { generateToken } from '../../utils/jwt.utils';
import { Request, Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AuthenticatedRequest } from '../../types/authenticate.type';

const adminAuthService = new AdminAuthService();

export async function login(req: Request, res: Response) {
  const response = await adminAuthService.adminLogin(req.body, true);

  if (response.authenticated && response.user) {
    const token = generateToken({
      value: response.user.email,
      id: response.user.id,
      userType: response.user.user_type,
      professionalId: response.user.professional ? response.user.professional!.id : null
    } as UserPayload);

    const user = formatUserResponse(response.user);

    res.send({
      userInfo: user,
      access_token: token,
    });
  } else {
    res.status(response.status).send({
      message: response.message,
    });
  }
}

// Verify Invited User

export async function verifyInvitation(req: Request, res: Response) {
  try {
    const response = await adminAuthService.verifyInvitation(req.params.token);

    return res.send({
      data: response,
      status: 200,
    });
  } catch (error) {
    if (error instanceof CustomException) {
      return res.status(error.statusCode).send({
        message: error.message,
        status: error.statusCode,
      });
    }

    res.status(500).send({
      error: error,
    });
  }
}

// Reset Password

export async function resetPassword(req: AuthenticatedRequest, res: Response) {
  try {
    await adminAuthService.resetPassword(req.body, req.user as UserPayload);

    return res.send({
      message: 'Password change succesfully',
    });
  } catch (error) {
    if (error instanceof CustomException) {
      return res.status(error.statusCode).send({
        message: error.message,
        status: error.statusCode,
      });
    }

    res.status(500).send({
      error: error,
    });
  }
}
