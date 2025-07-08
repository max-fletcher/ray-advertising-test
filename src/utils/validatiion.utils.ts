import { rollbackMultipleFileLocalUpload } from '../middleware/fileUploadLocal.middleware';
// import { rollbackMultipleFileS3 } from '../middleware/fileUploadS3.middleware';
import { z } from 'zod';

export const validateRequestBody =
  (schema: z.ZodSchema) => async (req: any, res: any, next: any) => {
    try {
      await schema.parseAsync({ ...req.body, ...req.query, ...(req?.files ?? {}) });
      next();
    } catch (error: any) {
      // console.log('validateRequestBody', error);
      // rollbackMultipleFileS3(req);
      rollbackMultipleFileLocalUpload(req);
      if (error instanceof z.ZodError) {
        res.status(422).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.issues.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Internal server error',
        });
      }
    }
  };
