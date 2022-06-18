import { createPool, Pool } from 'mysql';
import { outputFile } from 'fs-extra';
import * as path from 'path';
import type { Song } from './api';

export const DATA_SOURCES = {
  DB_HOST: process.env.MY_SQL_DB_HOST,
  DB_USER: process.env.MY_SQL_DB_USER,
  DB_PASSWORD: process.env.MY_SQL_DB_PASSWORD,
  DB_PORT: process.env.MY_SQL_DB_PORT,
  DB_DATABASE: process.env.MY_SQL_DB_DATABASE,
  DB_CONNECTION_LIMIT: process.env.MY_SQL_DB_CONNECTION_LIMIT ? parseInt(process.env.MY_SQL_DB_CONNECTION_LIMIT) : 4
};
let pool: Pool;
const SONGS_PATH = './songs';
export const init = () => {
  if (pool) return;
  try {
    pool = createPool({
      connectionLimit: DATA_SOURCES.DB_CONNECTION_LIMIT,
      host: DATA_SOURCES.DB_HOST,
      user: DATA_SOURCES.DB_USER,
      password: DATA_SOURCES.DB_PASSWORD,
      database: DATA_SOURCES.DB_DATABASE
    });

    console.debug('MySql Adapter Pool generated successfully');
  } catch (error) {
    console.error('[mysql.connector][init][Error]: ', error);
    throw new Error('failed to initialized pool');
  }
};

const execute = <T>(query: string, params: string[] | Object = {}): Promise<T> => {
  try {
    if (!pool) init();

    return new Promise<T>((resolve, reject) => {
      pool.query(query, params, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
  } catch (error) {
    console.error('[mysql.connector][execute][Error]: ', error);
    throw new Error('failed to execute MySQL query');
  }
};

export const saveSong = async ({ album, year, title, author }: Song, content) => {
  const savedContentPath = path.join(SONGS_PATH, author, title);
  await outputFile(savedContentPath, content);
  const documentId = await execute(
    `
INSERT INTO metadata (name, value) VALUES 
                ('album', '${album}'),
                ('year', '${year}'),
                ('title', '${title}'),
                ('author', '${album}');
select LAST_INSERT_ID()`
  );
  await execute<Song>(
    `
INSERT INTO metadata (name, value, documentId) VALUES 
                ('album', '${album}', ${documentId}),
                ('year', '${year}', ${documentId}),
                ('title', '${title}', ${documentId}),
                ('author', '${album}', ${documentId});
`
  );
};
