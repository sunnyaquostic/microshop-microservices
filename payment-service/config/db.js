import pkg from 'pg';
import path from 'path';
import { configDotenv } from 'dotenv';

const { Pool } = pkg;

configDotenv({
  path: path.resolve(process.cwd(), 'config/config.env')
});

console.log(process.env.DB_PASS);

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// console.log(process.env.DB_PASS)

// const testConnection = async () => {
//   try {
//     const res = await pool.query('SELECT NOW()');
//     console.log('PostgreSQL connected at:', res.rows[0]);
//   } catch (err) {
//     console.error('PostgreSQL connection error:', err);
//   }
// };

// testConnection();

export default db
