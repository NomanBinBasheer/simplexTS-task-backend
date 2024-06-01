import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/drizzle/schema.ts',
  out: './src/drizzle/migrations',
  dialect: 'mysql', 
  dbCredentials: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'simplex_mern_task_db',
  },
});