import { WordToDocument } from '@/be/db/models';
import { post } from '@/services/client';
import { Button, Form } from 'antd';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type FixedMetadata = { author: string; album: string; title: string; year: string; id: string };

export const SearchByIndex: React.FC = () => {
  const {
    register,
    getValues,
    formState: { isValid },
    trigger
  } = useForm();

  const [wordsResults, setWordsResults] = useState<Record<string, WordToDocument[]>>({});
  const [wordsMetadataResults, setWordsMetadataResults] = useState<Record<string, FixedMetadata>>({});
  const onWordsSearch = async () => {
    const documentIds = Array.from(document.querySelectorAll('.queryThisDocument'))
      // @ts-ignore
      .filter(element => element.checked)
      .map(element => element.getAttribute('data-id'));
    const { data: words } = await post('/getDocumentWords', { documentIds });
    const { data: metadata } = await post('/getDocumentsMetadata', { documentIds });

    setWordsResults(words);
    setWordsMetadataResults(metadata);
  };

  return (
    <div>
      <Form.Item label={'line number'}>
        <input onInput={() => trigger()} type={'number'} {...register('lineIndex', { required: true })} />
      </Form.Item>
      <Form.Item label={'word in line number'}>
        <input onInput={() => trigger()} type={'number'} {...register('wordIndex', { required: true })} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" disabled={!isValid} onClick={() => onWordsSearch()}>
          Search
        </Button>
      </Form.Item>

      {Object.keys(wordsResults).map(documentId => {
        const { wordIndex, lineIndex } = getValues();
        const relevantWord = wordsResults[documentId].find(
          wordData => wordData.lineIndex === parseInt(lineIndex) && wordData.wordIndex === parseInt(wordIndex)
        );

        return (
          <>
            <h3>
              {wordsMetadataResults[documentId] != undefined && (
                <>
                  The words for {wordsMetadataResults[documentId]?.author}, {wordsMetadataResults[documentId]?.album},
                  {wordsMetadataResults[documentId]?.title}, {wordsMetadataResults[documentId]?.year}
                </>
              )}
            </h3>
            {relevantWord?.word}
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
