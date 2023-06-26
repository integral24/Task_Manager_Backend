import { Request, Response } from 'express';
import pool from '../assets/db';
import { generateToken } from '../assets/tokenServices';
import { errors, messages } from '../assets/responses';
import jwt from 'jsonwebtoken';
import { IDecodeToken } from './task.controllers';

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const { email } = jwt.decode(req.cookies.refresh_token, {}) as IDecodeToken;
    const currentToken = req.cookies.refresh_token;
    const user: any = await pool.query('SELECT * FROM `users` WHERE `email` = ?', email);

    if (user[0].length > 0) {
      const { id, refreshToken } = user[0][0];
      if (currentToken === refreshToken) {
        const newTokens = generateToken(id, email);
        const refreshToken = newTokens.refreshToken;
        await pool.query('UPDATE `users` SET ? WHERE `email` = ?', [{ refreshToken }, email]);

        res
          .status(200)
          .cookie('refresh_token', newTokens.refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30,
            secure: true,
            sameSite: 'none',
          })
          .json({
            accessToken: newTokens.accessToken,
            message: messages.refreshSuccess,
          });
      } else {
        res.status(403).json({
          error: errors.needAuthorization,
        });
      }
    } else {
      res.status(404).json({
        error: errors.wrongEmail,
      });
    }
  } catch {
    res.json({
      error: errors.errorTokenService,
    });
  }
};
