import { DocumentLineContext } from '@/components/DocumentLineContext';
import { post } from '@/services/client';
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { Word, WordToDocument } from '../be/db/models';

type FixedMetadata = { author: string; album: string; title: string; year: string; id: string };
const DocumentWords: React.FC = () => {
  const [word, setWord] = useState<Word>();
  const [documentMetadata, setDocumentMetadata] = useState<FixedMetadata>();
  const [documentContent, setDocumentContent] = useState<WordToDocument[]>();
  const wordId = document.URL.split('/').reverse()[0];
  const documentId = document.URL.split('/').reverse()[1];
  useAsyncEffect(async () => {
    const { data: wordData } = await post('/getWord', { wordId });
    const { data: documentMetadata } = await post('/getDocumentMetadata', { documentId });
    const { data: documentContent } = await post('/getDocumentContent', { documentId });

    setWord(wordData);
    setDocumentMetadata(documentMetadata);
    setDocumentContent(documentContent);
  }, [wordId, documentId]);

  const relevantInstances = documentContent?.filter(content => content.wordId == wordId);
  const relevantLines = _(documentContent)
    .filter(content => relevantInstances.map(instance => instance.lineIndex).includes(content.lineIndex))
    .groupBy('lineIndex')
    .value();
  const documentContentByLines = _(documentContent).groupBy('lineIndex').value();
  console.log(documentContentByLines);
  return word && documentMetadata ? (
    <PageContainer content={'Query Document'}>
      <Card>
        <h1>
          Context for the word "{word?.word}" in the document of {documentMetadata[documentId]?.author},{' '}
          {documentMetadata[documentId]?.album},{documentMetadata[documentId]?.title},
          {documentMetadata[documentId]?.year}
        </h1>
        {Object.keys(relevantLines).map(lineNumber => {
          return (
            <DocumentLineContext lineNumber={parseInt(lineNumber)} documentContentByLines={documentContentByLines} />
          );
        })}
      </Card>
    </PageContainer>
  ) : (
    <></>
  );
};

export default DocumentWords;

// Print document content by order
//{/*{Object.keys(wordsResults).map(documentId => {*/}
//       {/*  const documentsWords = wordsResults[documentId];*/}
//       {/*  const sortedWords = {};*/}
//       {/*  documentsWords.forEach(word => {*/}
//       {/*    const line = (sortedWords[word.lineIndex] || []) as WordToDocument[];*/}
//       {/*    sortedWords[word.lineIndex] = [...line, word].sort((a, b) => a.wordIndex - b.wordIndex);*/}
//       {/*  });*/}
//       {/*  const linesWithWords = Object.values(sortedWords) as WordToDocument[][];*/}
//       {/*  return (*/}
//       {/*    <>*/}
//       {/*      <h3>*/}
//       {/*        The words for {wordsMetadataResults[documentId].author}, {wordsMetadataResults[documentId].album},{' '}*/}
//       {/*        {wordsMetadataResults[documentId].title}, {wordsMetadataResults[documentId].year}*/}
//       {/*      </h3>*/}
//       {/*      {linesWithWords.flatMap(line => {*/}
//       {/*        return (*/}
//       {/*          <>*/}
//       {/*            <span>{line.flatMap(wordInLine => wordInLine.word).join(' ')}</span>*/}
//       {/*            <br />*/}
//       {/*          </>*/}
//       {/*        );*/}
//       {/*      })}*/}
//       {/*    </>*/}
//       {/*  );*/}
//       {/*})}*/}
