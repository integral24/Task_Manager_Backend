import { Request, Response } from 'express';
import pool from '../assets/db';
import { generateToken } from '../assets/tokenServices';

// вероятно, что сайт будет работать только на одном устройстве из-за сверки токена с юзером

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const currentToken = req.cookies.refresh_token;

    const user: any = await pool.query('SELECT * FROM `users` WHERE `email` = ?', email);
    const { id, refreshToken } = user[0][0];

    if (user) {
      if (currentToken === refreshToken) {
        const newToken = generateToken(id, email);
        const refreshToken = newToken.refreshToken;
        await pool.query('UPDATE `users` SET ? WHERE `email` = ?', [{ refreshToken }, email]);

        res
          .status(200)
          .cookie('refresh_token', newToken.refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30,
            secure: true,
            sameSite: 'none',
          })
          .json({
            successToken: newToken.successToken,
          });
      } else {
        const refreshToken = null;
        await pool.query('UPDATE `users` SET ? WHERE `email` = ?', [{ refreshToken }, email]);

        res.json({
          signOut: true,
        });
      }
    } else {
      res.status(404).json({
        error: 'user not found',
      });
    }
  } catch {
    res.json({
      error: 'Error token service',
    });
  }
};
