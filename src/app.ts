// import cluster from 'cluster';
// import * as os from 'os';
import cors from 'cors';
import express from 'express';
import expressListRoutes from 'express-list-routes';
import helmet from 'helmet';
import path from 'path';
import { corsOptions } from './config/cors.config';
import { globalLimiterOptions } from './config/globalRateLimiter.config';
import { JwtMiddleware } from './middleware/jwt.middleware';
import { appAuthRouter } from './routes/app/auth.routes';
import { appUserRouter } from './routes/app/user.router';
import { testRouter } from './routes/test.routes';

// const numCPUs = os.cpus().length

const server = () => {
  // if (cluster?.isPrimary) {
  //     console.log(`Master ${process.pid} is running`)

  //     // Fork workers.
  //     for (let i = 0; i < numCPUs; i++) {
  //         cluster.fork()
  //     }

  //     cluster.on('exit', (worker) => {
  //         console.log(`worker ${worker.process.pid} died`)
  //     });
  // } else {
  try {
    const app = express();
    const PORT = process.env.PORT || 4001;

    // parse application/json
    app.use(express.json());

    // parse application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));

    // CORS protection
    app.use(cors(corsOptions));

    // For security purposes
    app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

    // serve static files
    app.use('/', express.static(path.join(__dirname, '/public')));

    //rate limiter
    app.use(globalLimiterOptions);

    const jwtMiddleware = new JwtMiddleware();
    // ROUTES
    // test router. For development purposes only
    app.use('/user/api/v1/test', testRouter);
    // admin routes

    // app routes
    app.use('/user/api/v1/app/auth', appAuthRouter);
    app.use('/user/api/v1/app/user', appUserRouter);

    app.all('*', (req, res) => {
      res.status(404);
      if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
      } else if (req.accepts('application/json')) {
        res.json({ error: 'Route Not Found' });
      } else {
        res.type('txt').send('Route Not Found.');
      }
    });

    // List down all routes in the terminal on startup
    expressListRoutes(app, { prefix: '/' });

    app.listen(PORT, () => {
      console.log(`Worker ${process.pid} started on port ${PORT}`);
    });
  } catch (error) {
    console.log('Error', error);
  }
  // }
};

server();
