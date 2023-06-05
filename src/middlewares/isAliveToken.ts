import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export const isAliveSuccessToken = (req: Request, res: Response, next: NextFunction) => {
  const token = String(req.headers.authorization?.split(' ')[1]);

  jwt.verify(token as string, process.env.TOKEN_SECRET as string, { complete: true }, (err) => {
    if (err) {
      res.status(401).json({
        error: 'SuccessToken expired',
      });
    } else {
      next();
    }
  });
};

export const isAliveRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.refresh_token;

  jwt.verify(
    token as string,
    process.env.TOKEN_SECRET as string,
    { complete: true },
    (err, decode) => {
      if (err) {
        res.status(401).json({
          error: 'Need signin',
        });
      } else {
        next();
      }
    },
  );
};
