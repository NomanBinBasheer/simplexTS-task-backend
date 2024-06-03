import { defineConfig } from 'drizzle-kit';
import dotenv from "dotenv";

dotenv.config();


export default defineConfig({
  schema: './src/drizzle/schema.ts',
  out: './src/drizzle/migrations',
  dialect: 'mysql', 
  dbCredentials: {
    host: process.env.MYSQL_HOST as string,
    user: process.env.MYSQL_USER as string,
    password: process.env.MYSQL_PASSWORD as string,
    database: process.env.MYSQL_DATABASE as string,
  },
});