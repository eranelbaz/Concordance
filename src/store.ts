import { createConnection, Connection } from 'mysql2/promise';
import { outputFile } from 'fs-extra';
import * as path from 'path';
import type { Song } from './api';
const SONGS_PATH = './songs';
export const DATA_SOURCES = {
  DB_HOST: 'localhost',
  DB_USER: 'concordance',
  DB_PASSWORD: 'concordance',
  DB_PORT: '3306',
  DB_DATABASE: 'concordance'
};

let connection: Connection;

export const init = async () => {
  if (connection) return;
  try {
    connection = await createConnection({
      host: DATA_SOURCES.DB_HOST,
      user: DATA_SOURCES.DB_USER,
      password: DATA_SOURCES.DB_PASSWORD,
      database: DATA_SOURCES.DB_DATABASE
    });
    await execute('SELECT 1');

    console.debug('MySql Adapter Pool generated successfully');
  } catch (error) {
    console.error('[mysql.connector][init][Error]: ', error);
    throw new Error('failed to initialized pool');
  }
};

const execute = async (query: string, params: string[] | Object = {}) => {
  try {
    if (!connection) await init();

    return await connection.execute(query, params);
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
select LAST_INSERT_ID();`
  );
  await execute(
    `
INSERT INTO metadata (name, value, documentId) VALUES 
                ('album', '${album}', ${documentId}),
                ('year', '${year}', ${documentId}),
                ('title', '${title}', ${documentId}),
                ('author', '${album}', ${documentId});
`
  );
};
