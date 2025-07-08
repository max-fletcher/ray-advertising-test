import { Response } from 'express';
import { AdminUserService } from '../../services/admin/admin-user.service';
import { AuthenticatedRequest } from '../../types/authenticate.type';
import { UserTypes } from '../../constants/enums';
import { UserPayload } from '../../schema/token-payload.schema';

const adminUserService = new AdminUserService();

export async function getAdminUsers(req: AuthenticatedRequest, res: Response) {
  try {
    const userType = req.query.user_type ? req.query.user_type : 'ALL';
    const response = await adminUserService.getAllAdminUsers(
      userType as string,
    );

    res.send({
      users: response,
    });
  } catch (error) {
    res.send(error);
  }
}

export async function getUserDetails(req: AuthenticatedRequest, res: Response) {
  try {
    const response = await adminUserService.userDetails(req.params.id);

    res.send({
      user: response,
    });
  } catch (error) {
    res.send(error);
  }
}

export async function createAdminUser(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const authUser = req.user;

    if (
      authUser?.userType === UserTypes.ADMIN &&
      (req.body?.user_type === UserTypes.ADMIN ||
        req.body?.user_type === UserTypes.SUPERADMIN)
    ) {
      return res.status(401).send({
        user: null,
        message:
          "You don't have permission to create admin or super admin user",
      });
    }

    const response = await adminUserService.createAdminUser(req.body);

    return res.status(response.status).send({
      message: response.message,
      user: response.user,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
}

export async function updateAdminUser(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const authUser = req.user;

    if (
      authUser?.userType === UserTypes.ADMIN &&
      (req.body?.user_type === UserTypes.ADMIN ||
        req.body?.user_type === UserTypes.SUPERADMIN)
    ) {
      return res.status(401).send({
        user: null,
        message:
          "You don't have permission to create admin or super admin user",
      });
    }

    const response = await adminUserService.updateAdminUser(req.body);

    return res.status(response.status).send({
      message: response.message,
      user: response.user,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
}

// Update User Profile

export async function updateUserProfile(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const response = await adminUserService.updateProfile(
      req.body,
      req.files,
      req.user as UserPayload,
    );

    return res.status(response.status).send({
      message: response.message,
      user: response.user,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
}
