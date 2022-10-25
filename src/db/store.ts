import { createConnection, Connection } from 'mysql2/promise';
import { outputFile } from 'fs-extra';
import * as path from 'path';
import type { InputDocument, DocumentMetadata } from 'api';
import { uuid } from 'uuidv4';
import { Document, Word } from './models';

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
  console.log(`executing ${query}`);
  try {
    if (!connection) await init();
    return await connection.execute(query, params);
  } catch (error) {
    console.error('[mysql.connector][execute][Error]: ', error);
    throw new Error('failed to execute MySQL query');
  }
};

const buildSongPath = (author: string, title: string) => path.join(SONGS_PATH, author, title);

export const saveSong = async ({ album, year, title, author, content }: InputDocument): Promise<string> => {
  const savedContentPath = buildSongPath(author, title);
  await outputFile(savedContentPath, content);
  const documentId = uuid();
  // @ts-ignore
  await execute(`INSERT INTO documents (id, path) VALUES ('${documentId}', '${savedContentPath}');`);
  await execute(
    `
INSERT INTO metadata (id, name, value, documentId) VALUES 
                ('${uuid()}', 'album', '${album}', '${documentId}'),
                ('${uuid()}', 'year', '${year}',   '${documentId}'),
                ('${uuid()}', 'title', '${title}', '${documentId}'),
                ('${uuid()}', 'author', '${album}','${documentId}');
`
  );
  return documentId;
};

const queryWord = async (word: string) => {
  const data = await execute(`SELECT * FROM words WHERE word = '${word}'`);
  return data[0][0] as Word;
};

export const queryDocument = async (document: DocumentMetadata) => {
  const songPath = buildSongPath(document.author, document.title);
  const data = await execute(`SELECT * FROM documents WHERE path = '${songPath}'`);
  return data[0][0] as Document;
};

export const saveWordsOfDocument = async (lines: string[][], documentId: string) => {
  // BUG NEED TO RUN PROMISE ONE BY ONE AND NOT ALL
  await Promise.all(
    lines.flatMap((line, lineIndex) =>
      line.flatMap(async (word, wordIndex) => {
        const wordDBData = await queryWord(word);
        const isWordExists = !!wordDBData;
        console.log(`the word ${word} exists = ${isWordExists}`);
        const wordMetadata = {
          id: isWordExists ? wordDBData.id : uuid(),
          lineIndex,
          wordIndex,
          word
        };
        if (!isWordExists) {
          await execute(`INSERT INTO words (id, word) VALUES ('${wordMetadata.id}', '${wordMetadata.word}');`);
        }
        await execute(`INSERT INTO wordsToDocuments (id, lineIndex, wordIndex, wordId, documentId) VALUES
                    ('${uuid()}', ${lineIndex}, ${wordIndex}, '${wordMetadata.id}', '${documentId}');`);
      })
    )
  );
};

export const clearDb = async () => {
  await execute('DELETE FROM `metadata`;');
  await execute('DELETE FROM `documents`;');
  await execute('DELETE FROM `wordsToDocuments`;');
  await execute('DELETE FROM `words`;');
};
