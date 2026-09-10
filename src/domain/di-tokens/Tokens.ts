import type { MySql2Database } from 'drizzle-orm/mysql2';
import { Token } from 'typedi';

export const DB = new Token<MySql2Database>('DB');
