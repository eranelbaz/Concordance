import * as csv from 'csv-string';
import { saveSong } from '../db/store';
export const loadDocument = async (content: string) => {
  const parsedCsv = csv.parse(content, { output: 'objects' });
  parsedCsv.map(row => saveSong(row as any, row['content']));
};
