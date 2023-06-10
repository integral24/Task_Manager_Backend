import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql2.createPool({
  user: process.env.USER_DB,
  password: process.env.PASS,
  host: process.env.HOST,
  port: 3306,
  database: process.env.NAME_DB
});

// const pool = mysql2.createPool({
//   user: process.env.USER_L,
//   password: process.env.PASS_L,
//   host: process.env.HOST_L,
//   port: 3306,
//   database: process.env.NAME_DB_L
// });

export default pool;
