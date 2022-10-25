import dotenv from 'dotenv';
import { clearDb } from './db/store';
dotenv.config();

clearDb();
