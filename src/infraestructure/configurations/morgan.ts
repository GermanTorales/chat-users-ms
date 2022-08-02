import * as morgan from 'morgan';
import { HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

morgan.token('message', (_req: Request, res: Response) => res.locals.errorMessage || '');

const successResponseFormat = ':method :status :url :response-time ms';
const errorResponseFormat = ':method :status :url :response-time ms - message: :message';

export const morganSuccessHandler = morgan(successResponseFormat, {
  skip: (req: Request, res: Response) => {
    return res.statusCode >= HttpStatus.BAD_REQUEST || req.originalUrl === '/healthz';
  },
  stream: { write: message => Logger.log(message.trim(), 'Morgan') },
});

export const morganErrorHandler = morgan(errorResponseFormat, {
  skip: (_req: Request, res: Response) => res.statusCode < HttpStatus.BAD_REQUEST,
  stream: { write: message => Logger.error(message.trim(), 'Morgan') },
});
