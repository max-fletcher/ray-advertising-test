import cors from 'cors';
import express from 'express';
import expressListRoutes from 'express-list-routes';
import helmet from 'helmet';
import path from 'path';
import { corsOptions } from './config/cors.config';
import { globalLimiterOptions } from './config/globalRateLimiter.config';
import { testRouter } from './routes/test.routes';
import { getEnvVar } from './utils/common.utils';
import { AppUserRouter } from './routes/app-user.routes';

const server = () => {
  try {
    const app = express();
    const PORT = process.env.PORT || 5000;

    // parse application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));

    // parse application/json
    app.use(express.json());

    // CORS protection
    app.use(cors(corsOptions));

    // For security purposes
    app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

    // serve static files
    const staticFileMode = getEnvVar('APP_STATIC_FILE_MODE')
    if(staticFileMode === 'production')
      app.use('/', express.static(path.join(__dirname, '/../src/public')));
    else
      app.use('/', express.static(path.join(__dirname, '/public')));

    //rate limiter
    app.use(globalLimiterOptions);
    app.set('trust proxy', 1)

    // ROUTES
    // test router. For development purposes only
    app.use('/api/v1/test', testRouter);
    // admin routes
    app.use('/api/v1/admin/app-users', AppUserRouter);
    // app routes

    app.all('*', (req, res) => {
      if (req.accepts('html')) {
        return res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
      } else if (req.accepts('application/json')) {
        return res.status(404).json({ 
          message: 'Route Not Found',
          statusCode: 404
        });
      } else {
        return res.status(404).type('txt').send('Route Not Found.');
      }
    });

    // List down all routes in the terminal on startup
    expressListRoutes(app, { prefix: '/' });

  // app.listen(Number(PORT), "0.0.0.0", () => {
  app.listen(Number(PORT), () => {
    console.log(`Worker ${process.pid} started on port ${PORT}`);
  });
  } catch (error) {
    console.log('Error', error);
  }
};

server();
