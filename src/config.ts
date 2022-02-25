import { config } from 'dotenv';
config();

export const PORT = process.env.PORT || 3000;
export const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017';
export const SECRET_KEY = process.env.SECRET_KEY || "DEFAULT_SECRET_KEY";
export const TOKEN_EXPIRE = process.env.TOKEN_EXPIRE || "7d";