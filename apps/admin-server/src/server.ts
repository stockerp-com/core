import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

export const server = (): Express => {
  const app = express();

  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(helmet())
    .use(cors())
    .use(
      rateLimit({
        windowMs: 1000 * 60 * 15,
        limit: 100,
      }),
    )
    .use(cookieParser());

  app.get('/', (_req, res) => {
    res.send({ message: 'Hello World' });
  });

  return app;
};
