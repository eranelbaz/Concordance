import { DocumentMetadata, InputDocument } from 'api';
import { uuid } from 'uuidv4';
import { outputFile } from 'fs-extra';
import * as path from 'path';
import { execute } from './common';
import { Document } from 'db/models';

const SONGS_PATH = './songs';

const buildDocumentPath = (author: string, title: string) => path.join(SONGS_PATH, author, title);

export const queryDocument = async (document: DocumentMetadata) => {
  const songPath = buildDocumentPath(document.author, document.title);
  const data = await execute(`SELECT * FROM documents WHERE path = '${songPath}'`);
  return data[0][0] as Document;
};

export const saveDocument = async ({ album, year, title, author, content }: InputDocument): Promise<string> => {
  const savedContentPath = buildDocumentPath(author, title);
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
