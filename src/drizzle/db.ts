import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

export const pool =  mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '66626',
  database: 'simplex_mern_task_db',
  multipleStatements: true,
});

export const db = drizzle(pool);