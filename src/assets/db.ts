import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

/*
* Server database
*/

const pool = mysql2.createPool({
  user: process.env.USER as any,
  password: process.env.PASS as any,
  host: process.env.HOST as any,
  port: process.env.PORT_DB as any,
  database: process.env.NAME_DB as any
});

/*
* Local database
*/

// const pool = mysql2.createPool({
//   user: process.env.USER_L as any,
//   password: process.env.PASS_L as any,
//   host: process.env.HOST_L as any,
//   port: process.env.PORT_DB_L as any,
//   database: process.env.NAME_DB_L as any
// });

export default pool;
