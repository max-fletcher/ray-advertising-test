import express, { Request, Response } from 'express';
import { MigrationService } from '../services/migration.services';
import { multipleFileLocalUploader } from '../middleware/fileUploadLocal.middleware';
import { fileDeleteFullpathsS3Test, fileDeleteS3Test, fileDeleteTest, fileUploadS3Test, fileUploadTest } from '../controllers/test.controller';
import { RedisService } from '../services/redis.services';
import { NodeCacheService } from '../services/node-cache.services';
import { JwtMiddleware } from '../middleware/jwt.middleware';
import { AuthenticatedRequest } from '../types/authenticate.type';
import { s3FileUploader } from '../middleware/fileUploadS3.middleware';
import multer from 'multer';

const migrationService = new MigrationService();
// const redisService = new RedisService();
const nodeCacheService = new NodeCacheService();
const jwtMiddleware = new JwtMiddleware();

const testRouter = express.Router();

testRouter.get('/hello', (req: Request, res: Response) => {
  res.send('Hello User!!');
});

testRouter.get('/db', async (req: Request, res: Response) => {
  try {
    await migrationService.authentication();
    res.send({
      message: 'success',
    });
  } catch (e) {
    res.status(500).send({
      message: `${e}`,
    });
  }
});

testRouter.post(
  '/fileUploadTest',
  multipleFileLocalUploader(
    [
      { name: 'images1', maxCount: 1 },
      { name: 'images2', maxCount: 2 },
    ],
    'files',
    31457280,
  ),
  fileUploadTest,
);

testRouter.delete('/fileDeleteTest/:id', fileDeleteTest);

testRouter.post(
  '/fileUploadS3Test',
  s3FileUploader(
    [
      { name: 'images1', maxCount: 1 },
      { name: 'images2', maxCount: 2 },
    ],
    'files',
    31457280,
  ),
  fileUploadS3Test,
);

testRouter.delete('/fileDeleteS3Test', multer().none(), fileDeleteS3Test);

testRouter.delete('/fileDeleteFullPathS3Test', multer().none(), fileDeleteFullpathsS3Test);

testRouter.get('/db/migrate', async (req: Request, res: Response) => {
  try {
    await migrationService.migrate();
    res.send({
      message: 'success',
    });
  } catch (e) {
    res.status(500).send({
      message: `${e}`,
    });
  }
});

testRouter.get('/db/refreshMigration', async (req: Request, res: Response) => {
  try {
    await migrationService.refreshMigration();
    res.send({
      message: 'success',
    });
  } catch (e) {
    res.status(500).send({
      message: `${e}`,
    });
  }
});

testRouter.get('/db/seed-user', async (req: Request, res: Response) => {
  try {
    await migrationService.seed();
    res.send({
      message: 'success',
    });
  } catch (error) {
    res.status(500).send({
      message: `${error}`,
    });
  }
});


testRouter.get('/db/seed-user-balance', jwtMiddleware.verifyToken, async (req: Request, res: Response) => {
  try {
    await migrationService.seedUserBalance(req as AuthenticatedRequest);
    res.send({
      message: 'success',
    });
  } catch (error) {
    res.status(500).send({
      message: `${error}`,
    });
  }
});

testRouter.get('/db/seed-essential-data', async (req: Request, res: Response) => {
  try {
    await migrationService.seedEssentialData();
    res.send({
      message: 'success',
    });
  } catch (error) {
    res.status(500).send({
      message: `${error}`,
    });
  }
});

testRouter.get('/db/seed-app-user', async (req: Request, res: Response) => {
  try {
    await migrationService.seedAppUser();
    res.send({
      message: 'success',
    });
  } catch (error) {
    res.status(500).send({
      message: `${error}`,
    });
  }
});

testRouter.post('/redis/setData', async (req: Request, res: Response) => {
  try {
    const { key, expiresIn, data } = req.body;
    // await redisService.setRedisData(key, JSON.stringify(data), expiresIn);
    res.send({
      message: 'success',
    });
  } catch (error) {
    res.status(500).send({
      message: `${error}`,
    });
  }
});

testRouter.post('/redis/getData', async (req: Request, res: Response) => {
  try {
    const { key } = req.body;
    // const data = await redisService.getRedisData(key);
    res.send({
      message: 'success',
      // data: data ? JSON.parse(data) : null,
    });
  } catch (error) {
    res.status(500).send({
      message: `${error}`,
    });
  }
});

testRouter.post('/redis/deleteData', async (req: Request, res: Response) => {
  try {
    const { key } = req.body;
    // const deleted = await redisService.deleteRedisData(key);
    res.send({
      message: 'success',
      // deleted: deleted,
    });
  } catch (error) {
    res.status(500).send({
      message: `${error}`,
    });
  }
});

testRouter.post('/node_cache/setData', async (req: Request, res: Response) => {
  try {
    const { key, expiresIn, data } = req.body;
    await nodeCacheService.setNodeCacheData(key, data, expiresIn);
    res.send({
      message: 'success',
    });
  } catch (error) {
    res.status(500).send({
      message: `${error}`,
    });
  }
});

testRouter.post('/node_cache/getData', async (req: Request, res: Response) => {
  try {
    const { key } = req.body;
    const data = nodeCacheService.getNodeCacheData(key);
    res.send({
      message: 'success',
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      message: `${error}`,
    });
  }
});

testRouter.post('/node_cache/deleteData', async (req: Request, res: Response) => {
  try {
    const { key } = req.body;
    const data = nodeCacheService.deleteNodeCacheData(key);
    res.send({
      message: 'success',
      deleted: data,
    });
  } catch (error) {
    res.status(500).send({
      message: `${error}`,
    });
  }
});

export { testRouter };
