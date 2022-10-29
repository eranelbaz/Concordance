import { uuid } from 'uuidv4';
import { Word } from '../models';
import { execute } from './common';

const queryWord = async (word: string) => {
  const data = await execute(`SELECT * FROM words WHERE word = '${word}'`);
  return data[0][0] as Word;
};

export const saveWordsOfDocument = async (lines: string[][], documentId: string) => {
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
