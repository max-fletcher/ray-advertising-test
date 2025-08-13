import express from 'express';
// import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { createAppUser, deleteAppUser, getAllAppUser, getSingleAppUser, updateAppUser } from '../controllers/admin/app-user.controller';
import { validateRequestBody } from '../utils/validatiion.utils';
import { createAppUserSchema, updateAppUserSchema } from '../schema/app-user.schema';
// import { createAppUser, deleteAppUser, getAllAppUser, getSingleAppUser, updateAppUser } from '../controllers/admin/app-user.mock-controller';

const AppUserRouter = express.Router();
// const jwtMiddleware = new JwtMiddleware();

// Defining routes
AppUserRouter.get('/', getAllAppUser);
AppUserRouter.get('/:id', getSingleAppUser);
AppUserRouter.post(
  '/',
  validateRequestBody(createAppUserSchema),
  createAppUser,
);
AppUserRouter.patch(
  '/:id',
  validateRequestBody(updateAppUserSchema),
  updateAppUser,
);
AppUserRouter.delete('/:id', deleteAppUser);

export { AppUserRouter };
