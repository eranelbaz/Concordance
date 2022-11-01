import _ from 'lodash';
import React, { useState } from 'react';
import { WordToDocument } from '../be/db/models';

type Props = {
  documentContentByLines: _.Dictionary<WordToDocument[]>;
  lineNumber: number;
};
export const DocumentLineContext: React.FC<Props> = ({ lineNumber, documentContentByLines }) => {
  const [offset, setOffset] = useState(0);

  return (
    <div>
      <h2>
        <button onClick={() => setOffset(offset - 1)}>before</button>
        context for word in line {lineNumber} <button onClick={() => setOffset(offset + 1)}>after</button>
      </h2>
      <br />
      {documentContentByLines[lineNumber - 1 + offset]?.map(word => word.word).join(' ')} <br />
      {documentContentByLines[lineNumber + offset]?.map(word => word.word).join(' ')}
      <br />
      {documentContentByLines[lineNumber + 1 + offset]?.map(word => word.word).join(' ')}
    </div>
  );
};
