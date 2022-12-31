import { uuid } from 'uuidv4';
import { Word, WordToDocument } from '../models';
import { execute } from './common';
import { groupMetadata } from './metadata';

export const queryWord = async (word: string) => {
  const data = await execute(`SELECT * FROM words WHERE word = '${word}'`);
  return data[0][0] as Word;
};

export const avgWordLength = async () => {
  const data = await execute('select avg(length(word)) as value from words');

  return data[0][0].value as string;
};

export const avgWordsInLine = async () => {
  const data = await execute('select count(*) / max(lineIndex) as value from wordsToDocuments group by documentId');
  return data[0][0].value as string;
};
export const mostCommonWords = async () => {
  const data = await execute(
    'SELECT word from words join wordsToDocuments on words.id = wordsToDocuments.wordId group by wordId order by count(wordId) desc limit 3'
  );

  // @ts-ignore
  return data[0].map(({ word }) => word as string).join(', ') as string;
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
on wordsToDocuments.wordId = words.id and wordsToDocuments.documentId ="${documentId}" order by paragraphIndex,lineIndex,wordIndex`)) as unknown as [
    WordToDocument[]
  ];

  return data;
};

export const getWord = async (wordId: string) => {
  const [data] = await execute(`select * from words where id = '${wordId}'`);
  return data[0];
};

export const getDocumentWords = async (documentIds: string[]) => {
  const [data] = (await execute(`select * from words join wordsToDocuments
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

export const saveWordsOfDocument = async (words: string[][][], documentId: string) => {
  const runSerial = tasks => {
    var result = Promise.resolve();
    tasks.forEach(task => {
      result = result.then(() => task());
    });
    return result;
  };
  const insertWord = async (word: string, index: { paragraph; word; line; lineParagraph }) => {
    const wordDBData = await queryWord(word);
    const isWordExists = !!wordDBData;
    console.log(`the word ${word} exists = ${isWordExists}`);
    const wordMetadata = {
      id: isWordExists ? wordDBData.id : uuid(),
      lineIndex: index.line,
      wordIndex: index.word,
      paragraphIndex: index.paragraph,
      paragraphLineIndex: index.lineParagraph,
      word
    };
    if (!isWordExists) {
      await execute(`INSERT INTO words (id, word) VALUES ('${wordMetadata.id}', '${wordMetadata.word}');`);
    }
    await execute(`INSERT INTO wordsToDocuments (id,paragraphIndex,paragraphLineIndex, lineIndex, wordIndex, wordId, documentId) VALUES
                    ('${uuid()}',${wordMetadata.paragraphIndex},${wordMetadata.paragraphLineIndex}, ${
      wordMetadata.lineIndex
    }, ${wordMetadata.wordIndex}, '${wordMetadata.id}', '${documentId}');`);
  };

  let wordIndex = 1;
  let lineIndex = 1;
  let paraLineIndex = 1;
  let paragraphIndex = 1;

  const dataToInsert = words.flatMap(lines => {
    paraLineIndex = 1;
    const ret = lines.flatMap(words => {
      wordIndex = 1;
      const ret = words.flatMap(word => {
        const ret = { word, wordIndex, lineIndex, paraLineIndex, paragraphIndex };
        wordIndex += 1;

        return ret;
      });
      lineIndex += 1;
      paraLineIndex += 1;
      return ret;
    });
    paragraphIndex += 1;
    return ret;
  });

  const tasks = dataToInsert.map(
    ({ word, wordIndex, lineIndex, paragraphIndex, paraLineIndex }) =>
      () =>
        insertWord(word, { paragraph: paragraphIndex, word: wordIndex, line: lineIndex, lineParagraph: paraLineIndex })
  );

  await runSerial(tasks);
};
