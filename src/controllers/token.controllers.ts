import { Request, Response } from 'express';
import pool from '../assets/db';
import { generateToken } from '../assets/tokenServices';
import { errors, messages } from '../assets/responses';

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const currentToken = req.cookies.refresh_token;
    const user: any = await pool.query('SELECT * FROM `users` WHERE `email` = ?', email);

    if (user[0].length > 0) {
      const { id, refreshToken } = user[0][0];
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
            message: messages.refreshSuccess,
          });
      } else {
        const refreshToken = null;
        await pool.query('UPDATE `users` SET ? WHERE `email` = ?', [{ refreshToken }, email]);

        res
          .status(200)
          .cookie('refresh_token', '', {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30,
            secure: true,
            sameSite: 'none',
          })
          .json({
            message: messages.signoutSuccess,
            error: errors.wrongRefreshToken,
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
