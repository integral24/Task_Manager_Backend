import { Request, Response } from 'express';
import pool from '../assets/db';
import bcrypt from 'bcrypt';
import { generateToken } from '../assets/tokenServices';
import dotenv from 'dotenv';
dotenv.config();

const hashedPass = (pass: string) => {
  return bcrypt.hashSync(pass, 10);
};

const resErrorUserPayload = (res: Response) => {
  return res.status(200).json({
    error: 'Wrong auth data'
  })
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const pass = hashedPass(req.body.pass);
    
    const newUser: any = await pool.query('INSERT INTO `users` SET ?', {name, email, pass});
    const id = newUser[0].insertId;
    const { refreshToken, successToken } = generateToken(id, email);

    await pool.query('UPDATE `users` SET ? WHERE `id` = ?', [{ refreshToken }, id]);

    res
      .status(200)
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .json({
        successToken: successToken,
        user: { 
          name, 
          email, 
          userId: newUser[0].insertId 
        },
      });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.json({
        message: err.message,
        code: 1,
      });
    } else {
      res.json(err);
      console.log('signUp', err);
    }
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, pass } = req.body;
    const user: any = await pool.query('SELECT * FROM `users` WHERE `email` = ?', email);

    if (user[0].length > 0) {
      if (bcrypt.compareSync(pass, user[0][0].pass)) {
        const { id } = user[0][0];
        const { refreshToken, successToken } = generateToken(id, email);
        await pool.query('UPDATE `users` SET ? WHERE `id` = ?', [{ refreshToken }, id]);
        
        res
          .status(200)
          .cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          })
          .json({
            successToken: successToken,
            user: { 
              userId: id,
              name: user[0][0].name, 
              email
            },
          });
      } else resErrorUserPayload(res);
    } else resErrorUserPayload(res);
  } catch (err: any) {
    res.json(err);
    console.log('signIn ---->', err);
  }
};

//TODO: дописать функции ниже

export const signOut = async (req: Request, res: Response) => {
  try {
  } catch (err: unknown) {}
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { name, email } = req.body;
    const pass = hashedPass(req.body.pass);
    const user = await pool.query('UPDATE `users` SET ? WHERE `id` = ?', [
      { name, email, pass },
      id,
    ]);
    res.json(user[0]);
  } catch (err: unknown) {
    res.json(err);
    console.log('updateUser', err);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await pool.query('DELETE FROM `users` WHERE `id` = ?', id);
    res.json(user[0]);
  } catch (err: unknown) {
    res.json(err);
    console.log('deleteUser', err);
  }
};
