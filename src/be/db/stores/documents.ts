import * as path from 'path';
import { uuid } from 'uuidv4';
import { DocumentMetadata, InputDocument } from '../../api';
import { Document } from '../models';
import { execute } from './common';
import { storeMetadata } from './metadata';

const SONGS_PATH = './songs';

const buildDocumentPath = (author: string, title: string) => path.join(SONGS_PATH, author, title);

export const queryDocument = async (document: DocumentMetadata) => {
  const songPath = buildDocumentPath(document.author, document.title);
  const data = await execute(`SELECT * FROM documents WHERE path = '${songPath}'`);
  return data[0][0] as Document;
};

export const saveDocument = async (document: InputDocument): Promise<string> => {
  const savedContentPath = buildDocumentPath(document.author, document.title);
  // await outputFile(savedContentPath, content);
  const documentId = uuid();
  // @ts-ignore
  await execute(`INSERT INTO documents (id, path) VALUES ('${documentId}', '${savedContentPath}');`);
  await storeMetadata(documentId, document);

  return documentId;
};
