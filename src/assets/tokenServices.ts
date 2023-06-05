import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface IJwt {
  successToken: string;
  refreshToken: string;
}

const createToken = (payload: any, expiresIn: string) =>
  jwt.sign(payload, process.env.TOKEN_SECRET || 'secret', { expiresIn });

export const generateToken = (name: string, email: string): IJwt => {
  const payload = {
    userId: name,
    email: email,
  };

  return {
    successToken: createToken(payload, '30m'),
    refreshToken: createToken(payload, '30d'),
  };
};
