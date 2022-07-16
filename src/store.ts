import { createConnection, Connection } from 'mysql2/promise';
import { outputFile } from 'fs-extra';
import * as path from 'path';
import type { Song } from './api';
import { uuid } from 'uuidv4';

const SONGS_PATH = './songs';
export const DB_CONNECTION_DETAILS = {
  DB_HOST: 'localhost',
  DB_USER: 'root',
  DB_PASSWORD: 'root',
  DB_PORT: '3306',
  DB_DATABASE: 'concordance'
};

let connection: Connection;

export const init = async () => {
  if (connection) return;
  try {
    connection = await createConnection({
      host: DB_CONNECTION_DETAILS.DB_HOST,
      user: DB_CONNECTION_DETAILS.DB_USER,
      password: DB_CONNECTION_DETAILS.DB_PASSWORD,
      database: DB_CONNECTION_DETAILS.DB_DATABASE
    });
    await execute('SELECT 1');

    console.debug('MySql Adapter Pool generated successfully');
  } catch (error) {
    console.error('[mysql.connector][init][Error]: ', error);
    throw new Error('failed to initialized pool');
  }
};

const execute = async (query: string, params: string[] | Object = []) => {
  try {
    if (!connection) await init();

    return await connection.execute(query, params);
  } catch (error) {
    console.error('[mysql.connector][execute][Error]: ', error);
    throw new Error('failed to execute MySQL query');
  }
};

export const saveSong = async ({ album, year, title, author }: Song, content): Promise<string> => {
  const savedContentPath = path.join(SONGS_PATH, author, title);
  await outputFile(savedContentPath, content);
  const documentId = uuid();
  // @ts-ignore
  await execute(`INSERT INTO documents (id, path) VALUES ('${documentId}', '${savedContentPath}');`);
  await execute(
    `
INSERT INTO metadata (id, name, value, documentId) VALUES 
                ('album', '${album}', ${documentId}),
                ('year', '${year}', ${documentId}),
                ('title', '${title}', ${documentId}),
                ('author', '${album}', ${documentId});
`
  );
  return documentId;
};
// TODO Check the uuid conversion works
export const saveWordsOfDocument = async (words: string[], documentId: number) => {
  const wordIds = Array.from({ length: words.length }, () => uuid());
  const sqlValuesForWordsTable = words.map((word, wordIndex) => `('${wordIds[wordIndex]}', '${word}')`).join(',');
  const sqlValuesForWordsToDocumentsTable = words
    .map((word, wordIndex) => `('${uuid()}', ${wordIds[wordIndex]},  ${documentId})`)
    .join(',');
  // @ts-ignore
  await execute(`INSERT IGNORE INTO words (id, word) VALUES ${sqlValuesForWordsTable};`);
  // @ts-ignore
  await execute(`
  INSERT IGNORE INTO wordsToDocuments (id, wordId, documentId) VALUES
                    ${sqlValuesForWordsToDocumentsTable};`);
};
