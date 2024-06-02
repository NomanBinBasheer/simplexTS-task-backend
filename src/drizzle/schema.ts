import { mysqlTable, varchar, float, text, int, serial, boolean } from 'drizzle-orm/mysql-core';

export const User = mysqlTable('users', {
  id: serial('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  isDeleted: boolean('isDeleted').notNull().default(false)
})
export const Product = mysqlTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 255 }).notNull(),
  price: float('price').notNull(),
  size: varchar('size', { length: 255 }).notNull(),
  description: text('description').notNull(),
  quantity: int('quantity').notNull(),
  image: varchar('image', { length: 255 }).notNull(),
  priority: int('priority').notNull(),
  isDeleted: boolean('isDeleted').notNull().default(false)
});
