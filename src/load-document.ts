import * as csv from 'csv-string';
import { saveSong, saveWordsOfDocument } from './store';

export const loadDocument = async (content: string) => {
  const parsedCsv = csv.parse(content, { output: 'objects' });
  console.log({ parsedCsv });
  await Promise.all(
    parsedCsv.map(async row => {
      console.log({ row });
      const songContent = row['content'];
      const songId = await saveSong(row as any, songContent);

      const lines = songContent.split('\n'); //_(songContent).split('\n').split(' ').value();
      const words = lines.map(line => line.split(' '));
      await saveWordsOfDocument(words, songId);
    })
  );
};
