import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

import createConnection from './database';
import { router } from './routes';
import { AppError } from './errors/AppError';

createConnection();
const app = express();

app.use(express.json());

app.use(router);

app.use(function errorHandlingMiddleware(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
): Response {
  if (error instanceof AppError)
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });

  return response.status(500).json({
    status: 'error',
    message: `Internal server error ${error.message}`,
  });
});

export { app };
