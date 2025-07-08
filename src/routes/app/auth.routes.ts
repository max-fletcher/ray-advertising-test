import express from 'express';
import { authenticateAppUser } from '../../controllers/app/auth.controller';
import { validateRequestBody } from '../../utils/validatiion.utils';
import { phoneNoSchema } from '../../schema/app-auth.schema';

const appAuthRouter = express.Router();

// Define routes
appAuthRouter.post(
                '/login',
                validateRequestBody(phoneNoSchema),
                authenticateAppUser,
              );

export { appAuthRouter };
