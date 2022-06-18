import * as csv from 'csv-string';
import { saveSong } from './store';

export const loadDocument = async (content: string) => {
  const parsedCsv = csv.parse(content, { output: 'objects' });
  console.log({ parsedCsv });
  parsedCsv.map(row => saveSong(row as any, row['content']));
};