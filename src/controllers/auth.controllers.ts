import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../assets/db';
import bcrypt from 'bcrypt';
import { generateToken } from '../assets/tokenServices';
import { errors, messages } from '../assets/responses';
import dotenv from 'dotenv';
dotenv.config();

interface IDecodeToken {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

const hashedPass = (pass: string) => {
  return bcrypt.hashSync(pass, 10);
};

export const signUp = async (req: Request, res: Response) => {
  try {
    let { name, email, pass } = req.body;
    if (name && email && pass) {
      pass = hashedPass(req.body.pass);

      const newUser: any = await pool.query('INSERT INTO `users` SET ?', { name, email, pass });
      const id = newUser[0].insertId;
      const { refreshToken, successToken } = generateToken(id, email);
      await pool.query('UPDATE `users` SET ? WHERE `id` = ?', [{ refreshToken }, id]);

      res
        .status(200)
        .cookie('refresh_token', refreshToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 30,
          secure: true,
          sameSite: 'none',
        })
        .json({
          successToken: successToken,
          user: {
            id,
            name,
            email,
          },
          message: messages.regSuccess,
        });
    } else {
      res.status(200).json({
        error: errors.incorrectUserData,
      });
    }
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.json({
        error: errors.doubleEmail,
      });
    } else {
      res.json(err);
    }
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, pass } = req.body;
    const user: any = await pool.query('SELECT * FROM `users` WHERE `email` = ?', email);

    if (user[0].length > 0) {
      if (bcrypt.compareSync(pass, user[0][0].pass)) {
        const id = user[0][0].id;
        const { refreshToken, successToken } = generateToken(id, email);
        await pool.query('UPDATE `users` SET ? WHERE `email` = ?', [{ refreshToken }, email]);

        res
          .status(200)
          .cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30,
            secure: true,
            sameSite: 'none',
          })
          .json({
            successToken: successToken,
            user: {
              id,
              name: user[0][0].name,
              email,
            },
            message: messages.signinSuccess,
          });
      } else {
        res.status(200).json({
          error: errors.wrongPass,
        });
      }
    } else {
      res.status(200).json({
        error: errors.wrongEmail,
      });
    }
  } catch (err: any) {
    res.json(err);
  }
};

export const signOut = async (req: Request, res: Response) => {
  try {
    const { email } = jwt.decode(req.headers.authorization?.split(' ')[1] || '', {}) as IDecodeToken;
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
      });
  } catch (err: unknown) {
    res.json(err);
  }
};

// export const updateUser = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;
//     const { name, email } = req.body;
//     const pass = hashedPass(req.body.pass);
//     const user = await pool.query('UPDATE `users` SET ? WHERE `id` = ?', [
//       { name, email, pass },
//       id,
//     ]);
//     res.json(user[0]);
//   } catch (err: unknown) {
//     res.json(err);
//   }
// };

// export const deleteUser = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;
//     const user = await pool.query('DELETE FROM `users` WHERE `id` = ?', id);
//     res.json(user[0]);
//   } catch (err: unknown) {
//     res.json(err);
//     console.log('deleteUser', err);
//   }
// };
