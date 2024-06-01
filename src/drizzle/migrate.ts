
// import 'dotenv/config';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db, pool } from './db';

async function main(){
  await migrate(db, { migrationsFolder: './src/drizzle/migrations' });

  await pool.end();
};

main()