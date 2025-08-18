import express, { Request, Response } from 'express';
import { MigrationService } from '../services/migration.services';
import { NodeCacheService } from '../services/node-cache.services';

const migrationService = new MigrationService();
const nodeCacheService = new NodeCacheService();
// const redisService = new RedisService();

const testRouter = express.Router();

testRouter.get('/hello', (req: Request, res: Response) => {
  res.send('Hello User!!');
});

// testRouter.get('/db', async (req: Request, res: Response) => {
//   try {
//     await migrationService.testConnection();
//     res.send({
//       message: 'success',
//     });
//   } catch (e) {
//     res.status(500).send({
//       message: `${e}`,
//     });
//   }
// });

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

testRouter.get('/db/refresh-migration', async (req: Request, res: Response) => {
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

// testRouter.get('/db/seed-app-user', async (req: Request, res: Response) => {
//   try {
//     await migrationService.seedAppUser();
//     res.send({
//       message: 'success',
//     });
//   } catch (error) {
//     res.status(500).send({
//       message: `${error}`,
//     });
//   }
// });

testRouter.post('/node_cache/set-data', async (req: Request, res: Response) => {
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

testRouter.post('/node_cache/get-data', async (req: Request, res: Response) => {
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

testRouter.post('/node_cache/delete-data', async (req: Request, res: Response) => {
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
  },
);

export { testRouter };
