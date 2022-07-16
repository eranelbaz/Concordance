import * as csv from 'csv-string';
import { saveSong, saveWordsOfDocument } from './store';
import _ from 'lodash';

export const loadDocument = async (content: string) => {
  const parsedCsv = csv.parse(content, { output: 'objects' });
  console.log({ parsedCsv });
  await Promise.all(
    parsedCsv.map(async row => {
      console.log({ row });
      const songContent = row['content'];
      const songId = await saveSong(row as any, songContent);

      let words = _(songContent).split('\n').split(' ').flatten().value();
      await saveWordsOfDocument(words, songId);
    })
  );
};
