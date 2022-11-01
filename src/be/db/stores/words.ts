import { uuid } from 'uuidv4';
import { Word, WordToDocument } from '../models';
import { execute } from './common';
import { groupMetadata } from './metadata';

export const queryWord = async (word: string) => {
  const data = await execute(`SELECT * FROM words WHERE word = '${word}'`);
  return data[0][0] as Word;
};

export const queryMetadataOfWords = async (word: string) => {
  const data = await execute(`select metadata.* from words join wordsToDocuments
on words.id = wordsToDocuments.wordId and words.word = '${word}'
join metadata
on wordsToDocuments.documentId = metadata.documentId`);
  // @ts-ignore
  return groupMetadata(data[0]);
};

export const getDocumentContent = async (documentId: string) => {
  const [data] = (await execute(`select * from words join wordsToDocuments
on wordsToDocuments.wordId = words.id and wordsToDocuments.documentId ="${documentId}" order by lineIndex,wordIndex`)) as unknown as [
    WordToDocument[]
  ];

  return data;
};

export const getWord = async (wordId: string) => {
  const [data] = await execute(`select * from words where id = '${wordId}'`);
  return data[0];
};

export const getDocumentWords = async (documentIds: string[]) => {
  const [data] =
    (await execute(`select distinct words.word, wordsToDocuments.wordId, wordsToDocuments.documentId from words join wordsToDocuments
on wordsToDocuments.wordId = words.id
${documentIds.length > 0 ? ` and wordsToDocuments.documentId in ("${documentIds.join('","')}")` : ``}`)) as unknown as [
      WordToDocument[]
    ];
  const wordsByDocumentIds = {};
  data.forEach(row => {
    const words = (wordsByDocumentIds[row.documentId] || []) as WordToDocument[];
    words.push(row);
    wordsByDocumentIds[row.documentId] = words;
  });

  return wordsByDocumentIds;
};

export const saveWordsOfDocument = async (lines: string[][], documentId: string) => {
  const runSerial = tasks => {
    var result = Promise.resolve();
    tasks.forEach(task => {
      result = result.then(() => task());
    });
    return result;
  };
  const insertWord = async (word: string, wordIndex: number, lineIndex: number) => {
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
  };

  const dataToInsert = lines.flatMap((line, lineIndex) =>
    line.flatMap((word, wordIndex) => ({ word, wordIndex, lineIndex }))
  );

  const tasks = dataToInsert.map(
    ({ word, wordIndex, lineIndex }) =>
      () =>
        insertWord(word, wordIndex, lineIndex)
  );

  await runSerial(tasks);
};
