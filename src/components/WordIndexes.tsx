import React, { useMemo } from 'react';
import { WordToDocument } from '../be/db/models';

type Props = {
  documentWords: WordToDocument[];
  wordId: string;
};
export const DocumentLineContext: React.FC<Props> = ({ wordId, documentWords }) => {
  const wordInstances = useMemo(() => documentWords.filter(({ wordId: id }) => id === wordId), [documentWords, wordId]);
  console.log({ documentWords, wordInstances });
  return (
    <div>
      {wordInstances.map(({ lineIndex, wordIndex, paragraphLineIndex, paragraphIndex }) => {
        return (
          <>
            line,word - {lineIndex},{wordIndex} <br />
            paragraph,line in paragraph - {paragraphLineIndex},{paragraphLineIndex}
            <br />
            <br />
          </>
        );
      })}
    </div>
  );
};

//{wordInstances.map(({ lineIndex, wordIndex, paragraphLineIndex, paragraphIndex }) => (
//       line,word - {lineIndex},{wordIndex}
//       paragraph,line in paragraph - {paragraphIndex},{paragraphLineIndex}
//   ))}
