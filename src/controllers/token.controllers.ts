import { Request, Response } from 'express';
import pool from '../assets/db';
// import bcrypt from 'bcryptjs';
import { generateToken } from '../assets/tokenServices';

//TODO: получение рефреш токена из кук и из юзера, сравнение и если тру, то отдать новую пару, если фолз, то вернуть ошибку и открывать страницу логин

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const { email }: {email: string} = req.body;
    const token = req.cookies.refresh_token;

    const user = await pool.query('SELECT * FROM `users` WHERE `email` = ?', email);
    console.log(req.cookies.refresh_token);
    // console.log(user[0]);



    if (user) {
      const token = generateToken('123', email);
  
      return res
        .status(200)
        .cookie("refresh_token", token.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .json({successToken: token.successToken });
    } else {
      res.status(404).json({
        error: 'user not found'
      })
    }

  } catch {
    res.json({
      error: 'Error token service'
    })
  }

}