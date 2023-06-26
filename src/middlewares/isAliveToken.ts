import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { errors } from '../assets/responses';
import dotenv from 'dotenv';
dotenv.config();

export const isAliveAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(403).json({
      error: errors.needAuthorization,
    });
  } else {
    jwt.verify(token as string, process.env.TOKEN_SECRET as string, { complete: true }, (err, decode) => {
      if (err) {
        res.status(401).json({
          error: errors.accessTokenExp,
        });
      } else {
        const { email } = decode?.payload as {email: string};
        // res.json({
        //   data: email
        // })
        next();
      }
    });
  }
};

export const isAliveRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.refresh_token;

  jwt.verify(token as string, process.env.TOKEN_SECRET as string, { complete: true }, (err, decode) => {
    if (err) {
      res.status(403).json({
        error: 'Need signin',
      });
    } else {
      next();
    }
  });
};
